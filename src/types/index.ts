export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrasal verb'
  | 'idiom'
  | 'preposition'
  | 'conjunction'
  | 'other';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface WordFamilyItem {
  pos: string;
  word: string;
}

export interface VocabularyWord {
  id?: string;
  userId: string;
  word: string;
  pronunciation: string;
  audioUrl: string;
  meaning: string;
  translation: string;
  partOfSpeech: PartOfSpeech | string;
  cefr: CEFRLevel | string;
  category: string;
  lesson: string;
  collocations: string[];
  wordFamily: WordFamilyItem[] | string[];
  synonyms: string[];
  antonyms: string[];
  commonMistakes: string;
  whatComesBefore: string;
  whatComesAfter: string;
  exampleSentence: string;
  exampleTranslation: string;
  mySentence: string;
  teacherFeedback: string;
  reviewDate: string; // YYYY-MM-DD
  difficulty: DifficultyLevel;
  mastered: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface WordAnalysisResult {
  word: string;
  pronunciation: string;
  audioUrl?: string;
  meaning: string;
  translation: string;
  partOfSpeech: PartOfSpeech | string;
  cefr: CEFRLevel | string;
  category: string;
  lesson: string;
  collocations: string[];
  wordFamily: string[];
  synonyms: string[];
  antonyms: string[];
  commonMistakes: string;
  whatComesBefore: string;
  whatComesAfter: string;
  exampleSentence: string;
  exampleTranslation: string;
  mySentenceSuggestion?: string;
  difficultyRecommendation: DifficultyLevel;
}

export type UserRole = 'admin' | 'student';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role?: UserRole;
  streak: number;
  lastActiveDate: string;
  theme: 'light' | 'dark';
  createdAt: string;
  isDemo?: boolean;
}

export interface VocabularyFilters {
  search: string;
  cefr: string;
  category: string;
  partOfSpeech: string;
  difficulty: string;
  mastered: string; // 'all' | 'mastered' | 'pending'
  lesson: string;
}

export interface VocabularyStats {
  totalWords: number;
  byCefr: Record<string, number>;
  byCategory: Record<string, number>;
  monthlyProgress: Array<{ month: string; count: number }>;
  reviewedCount: number;
  pendingReviewCount: number;
  masteredCount: number;
}
