import {
  LessonItem,
  VocabularyItem,
  PhraseItem,
  PronunciationTip,
  LearningPhrase,
  LearningMode
} from "./index";

export type LearningLesson = {
  id: number;

  category: string;

  english: string;

  hindi: string;

  vocabulary: VocabularyItem[];

  phrases?: PhraseItem[];
};

export type AdvancedLesson = {
  id: number;

  category: string;

  sentence: string;

  translation: string;

  vocabulary: VocabularyItem[];

  phrases: PhraseItem[];
};

export type LearningCategory = {
  id: string;

  title: string;

  description: string;

  mode: LearningMode;

  totalLessons: number;
};

export type LessonProgressState = {
  lessonId: number;

  completed: boolean;

  score: number;

  practiced: boolean;

  updatedAt: string;
};

export type VocabularyPractice = {
  word: string;

  pronunciation: string;

  meaning: string;

  practiced: boolean;
};

export type PhrasePractice = {
  phrase: string;

  meaning: string;

  completed: boolean;
};

export type TranslationExercise = {
  id: number;

  english: string;

  hindi: string;

  difficulty:
    | "easy"
    | "medium"
    | "hard";
};

export type PronunciationExercise = {
  id: number;

  sentence: string;

  targetWords: string[];

  tip?: string;
};

export type AIPracticeSuggestion = {
  title: string;

  description: string;

  recommendedMode: LearningMode;
};

export type LearningSession = {
  sessionId: string;

  startedAt: string;

  mode: LearningMode;

  completedLessons: number[];

  totalPracticeTime: number;
};

export type LearningStatistics = {
  totalLessonsCompleted: number;

  totalPracticeMinutes: number;

  pronunciationScore: number;

  vocabularyLearned: number;

  fluencyLevel:
    | "beginner"
    | "intermediate"
    | "advanced";
};

export type OfflineLessonBundle = {
  beginner: LessonItem[];

  daily: LessonItem[];

  office: LessonItem[];

  business: LessonItem[];

  interview: LessonItem[];

  advanced: AdvancedLesson[];

  phrases: LearningPhrase[];

  pronunciationTips: PronunciationTip[];
};

export type DynamicAILesson = {
  title: string;

  english: string;

  hindi: string;

  vocabulary: VocabularyItem[];

  phrases: PhraseItem[];

  pronunciationTip: string;
};
