import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  increment,
  FieldValue 
} from 'firebase/firestore';

export interface FlashcardData {
  id: string;
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  box: number; // Leitner box number (1-5)
  nextReview: Date;
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
  averageResponseTime?: number; // in milliseconds
}

export interface UserStats {
  totalReviews: number;
  correctReviews: number;
  currentStreak: number;
  longestStreak: number;
  lastReviewDate?: Date;
  wordsInBox: Record<LeitnerBox, number>;
}

interface FirestoreUserStats extends Omit<UserStats, 'lastReviewDate'> {
  lastReviewDate?: Timestamp;
}

type LeitnerBox = 1 | 2 | 3 | 4 | 5;

const REVIEW_INTERVALS: Record<LeitnerBox, number> = {
  1: 1,      // 1 day
  2: 3,      // 3 days
  3: 7,      // 1 week
  4: 14,     // 2 weeks
  5: 30,     // 1 month
};

export class LeitnerSystem {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private get userFlashcardsRef() {
    return collection(db, 'users', this.userId, 'flashcards');
  }

  private get userStatsRef() {
    return doc(db, 'users', this.userId, 'stats', 'learning');
  }

  async initializeUserStats() {
    const stats: UserStats = {
      totalReviews: 0,
      correctReviews: 0,
      currentStreak: 0,
      longestStreak: 0,
      wordsInBox: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };
    await setDoc(this.userStatsRef, stats);
    return stats;
  }

  async getUserStats(): Promise<UserStats> {
    const statsDoc = await getDoc(this.userStatsRef);
    if (!statsDoc.exists()) {
      return this.initializeUserStats();
    }
    const data = statsDoc.data() as FirestoreUserStats;
    return {
      ...data,
      lastReviewDate: data.lastReviewDate?.toDate(),
    };
  }

  async addFlashcard(flashcardData: Omit<FlashcardData, 'id' | 'box' | 'nextReview' | 'createdAt' | 'reviewCount' | 'correctCount'>) {
    const docRef = doc(collection(db, 'users', this.userId, 'flashcards'));
    const now = new Date();
    
    const newFlashcard: FlashcardData = {
      ...flashcardData,
      id: docRef.id,
      box: 1,
      nextReview: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      createdAt: now,
      reviewCount: 0,
      correctCount: 0,
    };

    await setDoc(docRef, {
      ...newFlashcard,
      nextReview: Timestamp.fromDate(newFlashcard.nextReview),
      createdAt: Timestamp.fromDate(newFlashcard.createdAt),
    });

    // Update stats
    await updateDoc(this.userStatsRef, {
      ['wordsInBox.1']: increment(1),
    });

    return newFlashcard;
  }

  async gradeFlashcard(flashcardId: string, grade: 'easy' | 'hard', responseTime: number) {
    const flashcardRef = doc(this.userFlashcardsRef, flashcardId);
    const flashcardDoc = await getDoc(flashcardRef);
    
    if (!flashcardDoc.exists()) {
      throw new Error('Flashcard not found');
    }

    const flashcard = flashcardDoc.data() as FlashcardData;
    const now = new Date();
    const isCorrect = grade === 'easy';

    // Update box number based on grade
    let newBox = flashcard.box as LeitnerBox;
    const oldBox = flashcard.box as LeitnerBox;
    
    if (isCorrect) {
      newBox = Math.min(flashcard.box + 1, 5) as LeitnerBox;
    } else {
      newBox = Math.max(flashcard.box - 1, 1) as LeitnerBox;
    }

    // Calculate next review date
    const nextReview = new Date(now.getTime() + REVIEW_INTERVALS[newBox] * 24 * 60 * 60 * 1000);

    // Update flashcard
    const newAvgTime = flashcard.averageResponseTime 
      ? (flashcard.averageResponseTime * flashcard.reviewCount + responseTime) / (flashcard.reviewCount + 1)
      : responseTime;

    await updateDoc(flashcardRef, {
      box: newBox,
      nextReview: Timestamp.fromDate(nextReview),
      lastReviewed: Timestamp.fromDate(now),
      reviewCount: increment(1),
      correctCount: increment(isCorrect ? 1 : 0),
      averageResponseTime: newAvgTime,
    });

    // Update user stats
    const statsUpdates: Record<string, FieldValue | Timestamp | number> = {
      totalReviews: increment(1),
      correctReviews: increment(isCorrect ? 1 : 0),
      [`wordsInBox.${oldBox}`]: increment(-1),
      [`wordsInBox.${newBox}`]: increment(1),
      lastReviewDate: Timestamp.fromDate(now),
    };

    // Update streak
    const stats = await this.getUserStats();
    if (stats.lastReviewDate) {
      const lastReview = stats.lastReviewDate;
      
      const isConsecutiveDay = 
        now.getDate() - lastReview.getDate() === 1 ||
        (now.getDate() === 1 && lastReview.getDate() === new Date(lastReview.getFullYear(), lastReview.getMonth() + 1, 0).getDate());

      if (isConsecutiveDay) {
        statsUpdates.currentStreak = increment(1);
        if ((stats.currentStreak + 1) > stats.longestStreak) {
          statsUpdates.longestStreak = increment(1);
        }
      } else if (now.getDate() !== lastReview.getDate()) {
        statsUpdates.currentStreak = increment(1);
      }
    } else {
      statsUpdates.currentStreak = increment(1);
    }

    await updateDoc(this.userStatsRef, statsUpdates);
  }

  async getDueFlashcards(limit: number = 10, isTiredMode: boolean = false): Promise<FlashcardData[]> {
    const now = new Date();
    
    const q = query(
      this.userFlashcardsRef,
      where('nextReview', '<=', Timestamp.fromDate(now))
    );

    const snapshot = await getDocs(q);
    const flashcards: FlashcardData[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      flashcards.push({
        ...data,
        id: doc.id,
        nextReview: data.nextReview.toDate(),
        createdAt: data.createdAt.toDate(),
        lastReviewed: data.lastReviewed?.toDate(),
      } as FlashcardData);
    });

    // Sort flashcards
    if (isTiredMode) {
      // In tired mode, get the 3 easiest cards (highest success rate)
      return flashcards
        .sort((a, b) => (b.correctCount / b.reviewCount) - (a.correctCount / a.reviewCount))
        .slice(0, 3);
    }

    // Normal mode: prioritize lower boxes and due dates
    return flashcards
      .sort((a, b) => a.box - b.box || a.nextReview.getTime() - b.nextReview.getTime())
      .slice(0, limit);
  }

  async getPerformanceStats(): Promise<{
    accuracy: number;
    averageResponseTime: number;
    masteredWords: number;
  }> {
    const stats = await this.getUserStats();
    const accuracy = stats.totalReviews > 0 
      ? (stats.correctReviews / stats.totalReviews) * 100 
      : 0;

    const snapshot = await getDocs(this.userFlashcardsRef);
    let totalTime = 0;
    let timeCount = 0;
    let masteredWords = 0;

    snapshot.forEach((doc) => {
      const data = doc.data() as FlashcardData;
      if (data.averageResponseTime) {
        totalTime += data.averageResponseTime;
        timeCount++;
      }
      if (data.box === 5) {
        masteredWords++;
      }
    });

    return {
      accuracy,
      averageResponseTime: timeCount > 0 ? totalTime / timeCount : 0,
      masteredWords,
    };
  }
} 