import { LeitnerSystem } from '@/lib/leitner';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

describe('LeitnerSystem', () => {
  const mockUserId = 'test-user-123';
  let leitnerSystem: LeitnerSystem;
  
  beforeEach(() => {
    jest.clearAllMocks();
    leitnerSystem = new LeitnerSystem(mockUserId);
  });

  describe('addFlashcard', () => {
    it('should create a new flashcard in box 1', async () => {
      const mockDocRef = { id: 'test-card-1' };
      const mockSetDoc = jest.fn();
      const mockUpdateDoc = jest.fn();

      (collection as jest.Mock).mockReturnValue({
        doc: jest.fn().mockReturnValue({
          ...mockDocRef,
          set: mockSetDoc,
        }),
      });

      const flashcardData = {
        word: 'huis',
        translation: 'house',
        example: 'Ik woon in een groot huis.',
        exampleTranslation: 'I live in a big house.',
      };

      const result = await leitnerSystem.addFlashcard(flashcardData);

      expect(result).toMatchObject({
        ...flashcardData,
        id: 'test-card-1',
        box: 1,
        reviewCount: 0,
        correctCount: 0,
      });

      expect(mockSetDoc).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.any(Object), {
        'wordsInBox.1': expect.any(Object), // increment(1)
      });
    });
  });

  describe('gradeFlashcard', () => {
    it('should promote card to next box on easy grade', async () => {
      const mockDocRef = {
        id: 'test-card-1',
        exists: () => true,
        data: () => ({
          box: 1,
          reviewCount: 1,
          correctCount: 1,
        }),
      };

      const mockGetDoc = jest.fn().mockResolvedValue(mockDocRef);
      const mockUpdateDoc = jest.fn();

      (doc as jest.Mock).mockReturnValue({
        get: mockGetDoc,
        update: mockUpdateDoc,
      });

      await leitnerSystem.gradeFlashcard('test-card-1', 'easy', 1000);

      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
        box: 2,
      }));
    });

    it('should demote card to previous box on hard grade', async () => {
      const mockDocRef = {
        id: 'test-card-1',
        exists: () => true,
        data: () => ({
          box: 2,
          reviewCount: 2,
          correctCount: 1,
        }),
      };

      const mockGetDoc = jest.fn().mockResolvedValue(mockDocRef);
      const mockUpdateDoc = jest.fn();

      (doc as jest.Mock).mockReturnValue({
        get: mockGetDoc,
        update: mockUpdateDoc,
      });

      await leitnerSystem.gradeFlashcard('test-card-1', 'hard', 1000);

      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
        box: 1,
      }));
    });
  });

  describe('getDueFlashcards', () => {
    it('should return cards due for review', async () => {
      const mockDocs = [
        {
          id: 'card-1',
          data: () => ({
            word: 'huis',
            box: 1,
            nextReview: Timestamp.fromDate(new Date()),
            createdAt: Timestamp.fromDate(new Date()),
          }),
        },
        {
          id: 'card-2',
          data: () => ({
            word: 'fiets',
            box: 2,
            nextReview: Timestamp.fromDate(new Date()),
            createdAt: Timestamp.fromDate(new Date()),
          }),
        },
      ];

      const mockQuery = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: mockDocs,
          forEach: (callback: (doc: any) => void) => mockDocs.forEach(callback),
        }),
      });

      (query as jest.Mock).mockImplementation(mockQuery);

      const result = await leitnerSystem.getDueFlashcards(2);

      expect(result).toHaveLength(2);
      expect(result[0].box).toBe(1); // Should be sorted by box number
      expect(result[1].box).toBe(2);
    });

    it('should return easier cards in tired mode', async () => {
      const mockDocs = [
        {
          id: 'card-1',
          data: () => ({
            word: 'huis',
            box: 1,
            reviewCount: 10,
            correctCount: 5,
            nextReview: Timestamp.fromDate(new Date()),
            createdAt: Timestamp.fromDate(new Date()),
          }),
        },
        {
          id: 'card-2',
          data: () => ({
            word: 'fiets',
            box: 2,
            reviewCount: 10,
            correctCount: 8,
            nextReview: Timestamp.fromDate(new Date()),
            createdAt: Timestamp.fromDate(new Date()),
          }),
        },
      ];

      const mockQuery = jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: mockDocs,
          forEach: (callback: (doc: any) => void) => mockDocs.forEach(callback),
        }),
      });

      (query as jest.Mock).mockImplementation(mockQuery);

      const result = await leitnerSystem.getDueFlashcards(2, true);

      expect(result).toHaveLength(2);
      expect(result[0].correctCount / result[0].reviewCount).toBeGreaterThan(
        result[1].correctCount / result[1].reviewCount
      );
    });
  });
}); 