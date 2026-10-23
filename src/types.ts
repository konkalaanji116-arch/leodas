export interface TwoOptionQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  correctOption: 0 | 1; // 0 for Option A, 1 for Option B
}

export interface QuizData {
  id: string;
  creatorName: string;
  title: string;
  createdAt: number;
  questions: TwoOptionQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  friendName: string;
  score: number;
  total: number;
  answers: { questionId: string; selected: 0 | 1; isCorrect: boolean }[];
  completedAt: number;
}

export interface DialogueItem {
  id: string;
  quote: string;
  transliteration?: string;
  movie: string;
  year: string;
  tag: 'punch' | 'motivation' | 'mass' | 'classic';
}

export interface ThalapathySticker {
  id: string;
  name: string;
  icon: string;
  movie: string;
  color: string;
}
