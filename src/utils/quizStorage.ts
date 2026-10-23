import { QuizData, QuizAttempt, TwoOptionQuestion } from '../types';
import { STARTER_TWO_OPTION_QUESTIONS } from '../data/thalapathyData';
import { db, auth } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

const STORAGE_KEY_QUIZZES = 'thalapathy_user_quizzes_v1';
const STORAGE_KEY_ATTEMPTS = 'thalapathy_quiz_attempts_v1';
const STORAGE_KEY_USER = 'thalapathy_current_user_v1';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Info: ', JSON.stringify(errInfo));
}

export function saveCurrentUser(name: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, name);
  } catch {}
}

export function getCurrentUser(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_USER);
  } catch {
    return null;
  }
}

export function clearCurrentUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_USER);
  } catch {}
}

export function getSavedQuizzes(): QuizData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUIZZES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function fetchQuizzesFromFirestore(): Promise<QuizData[]> {
  const path = 'quizzes';
  try {
    const snapshot = await getDocs(collection(db, path));
    const items: QuizData[] = [];
    snapshot.forEach(d => {
      items.push(d.data() as QuizData);
    });
    if (items.length > 0) {
      localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(items));
    }
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return getSavedQuizzes();
  }
}

export function saveQuiz(quiz: QuizData): void {
  try {
    const existing = getSavedQuizzes();
    const index = existing.findIndex(q => q.id === quiz.id);
    if (index >= 0) {
      existing[index] = quiz;
    } else {
      existing.unshift(quiz);
    }
    localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(existing));

    // Save directly to Firestore Cloud Database
    const quizDocPath = `quizzes/${quiz.id}`;
    setDoc(doc(db, 'quizzes', quiz.id), quiz)
      .catch(err => {
        handleFirestoreError(err, OperationType.WRITE, quizDocPath);
      });
  } catch {}
}

export function deleteQuiz(id: string): void {
  try {
    const existing = getSavedQuizzes().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(existing));

    const path = `quizzes/${id}`;
    deleteDoc(doc(db, 'quizzes', id)).catch(err => {
      handleFirestoreError(err, OperationType.DELETE, path);
    });
  } catch {}
}

export function getQuizAttempts(quizId?: string): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!raw) return [];
    const all: QuizAttempt[] = JSON.parse(raw);
    if (quizId) {
      return all.filter(a => a.quizId === quizId);
    }
    return all;
  } catch {
    return [];
  }
}

export async function fetchAttemptsFromFirestore(quizId?: string): Promise<QuizAttempt[]> {
  const path = 'attempts';
  try {
    const snapshot = await getDocs(collection(db, path));
    const all: QuizAttempt[] = [];
    snapshot.forEach(d => {
      all.push(d.data() as QuizAttempt);
    });
    if (all.length > 0) {
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(all));
    }
    if (quizId) {
      return all.filter(a => a.quizId === quizId);
    }
    return all;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return getQuizAttempts(quizId);
  }
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  try {
    const existing = getQuizAttempts();
    existing.unshift(attempt);
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(existing));

    // Persist attempt to Firestore
    const attemptPath = `attempts/${attempt.id}`;
    setDoc(doc(db, 'attempts', attempt.id), attempt)
      .catch(err => {
        handleFirestoreError(err, OperationType.WRITE, attemptPath);
      });
  } catch {}
}

// Encode Quiz into URL Safe string
export function encodeQuizToUrl(quiz: QuizData): string {
  try {
    const minified = {
      i: quiz.id,
      c: quiz.creatorName,
      t: quiz.title,
      q: quiz.questions.map(q => ({
        q: q.question,
        a: q.optionA,
        b: q.optionB,
        ans: q.correctOption
      }))
    };
    const jsonStr = JSON.stringify(minified);
    const encoded = btoa(encodeURIComponent(jsonStr));
    return encoded;
  } catch {
    return '';
  }
}

// Decode Quiz from URL Safe string
export function decodeQuizFromUrl(encoded: string): QuizData | null {
  try {
    const jsonStr = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !parsed.c || !Array.isArray(parsed.q)) return null;

    const questions: TwoOptionQuestion[] = parsed.q.map((item: { q: string; a: string; b: string; ans: 0 | 1 }, idx: number) => ({
      id: `q-${idx}-${Date.now()}`,
      question: item.q,
      optionA: item.a,
      optionB: item.b,
      correctOption: item.ans === 1 ? 1 : 0
    }));

    return {
      id: parsed.i || `quiz-${Date.now()}`,
      creatorName: parsed.c,
      title: parsed.t || `How well do you know ${parsed.c}?`,
      createdAt: Date.now(),
      questions
    };
  } catch {
    return null;
  }
}

export function createDefaultQuizForUser(creatorName: string): QuizData {
  const selectedStarters = STARTER_TWO_OPTION_QUESTIONS.slice(0, 5);
  const questions: TwoOptionQuestion[] = selectedStarters.map((item, idx) => ({
    id: `starter-${idx}-${Date.now()}`,
    question: item.question,
    optionA: item.optionA,
    optionB: item.optionB,
    correctOption: item.correctOption
  }));

  const quiz: QuizData = {
    id: 'quiz-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    creatorName,
    title: `How Well Do You Know ${creatorName}? 🔥`,
    createdAt: Date.now(),
    questions
  };

  saveQuiz(quiz);
  return quiz;
}
