import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

// Leitner System Box Intervals (in days)
export const LEITNER_INTERVALS = {
  1: 1,    // Box 1: Review daily
  2: 2,    // Box 2: Review every 2 days
  3: 4,    // Box 3: Review every 4 days
  4: 7,    // Box 4: Review every week
  5: 14,   // Box 5: Review every 2 weeks
};

export interface Flashcard {
  id: string;
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  box: number;
  nextReview: Date;
  createdAt: Date;
  lastReviewed: Date | null;
}

export const leitnerSystem = {
  // Add a new flashcard to box 1
  async addFlashcard(userId: string, flashcard: Omit<Flashcard, 'id' | 'box' | 'nextReview' | 'createdAt' | 'lastReviewed'>) {
    const flashcardsRef = collection(db, 'users', userId, 'flashcards');
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: doc(flashcardsRef).id,
      box: 1,
      nextReview: new Date(),
      createdAt: new Date(),
      lastReviewed: null,
    };

    await setDoc(doc(flashcardsRef, newFlashcard.id), newFlashcard);
    return newFlashcard;
  },

  // Get all flashcards due for review
  async getDueFlashcards(userId: string) {
    const flashcardsRef = collection(db, 'users', userId, 'flashcards');
    const q = query(flashcardsRef, where('nextReview', '<=', new Date()));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Flashcard);
  },

  // Update flashcard after review
  async updateFlashcardBox(userId: string, flashcardId: string, wasCorrect: boolean) {
    const flashcardRef = doc(db, 'users', userId, 'flashcards', flashcardId);
    const flashcardDoc = await getDoc(flashcardRef);
    const flashcard = flashcardDoc.data() as Flashcard;

    let newBox = flashcard.box;
    if (wasCorrect && newBox < 5) {
      newBox++;
    } else if (!wasCorrect && newBox > 1) {
      newBox--;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + LEITNER_INTERVALS[newBox as keyof typeof LEITNER_INTERVALS]);

    await updateDoc(flashcardRef, {
      box: newBox,
      nextReview,
      lastReviewed: new Date(),
    });

    return {
      ...flashcard,
      box: newBox,
      nextReview,
      lastReviewed: new Date(),
    };
  },
};

export { app, db, auth }; 