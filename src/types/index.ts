export type LearningMode =
  | "beginner"
  | "daily"
  | "office"
  | "business"
  | "interview"
  | "pronunciation"
  | "advanced";

export type ConversationRole =
  | "user"
  | "ai";

export type VoiceType =
  | "female"
  | "male"
  | "professional";

export type VocabularyItem = {
  word: string;

  meaning: string;

  pronunciation: string;
};

export type PhraseItem = {
  phrase: string;

  meaning: string;
};

export type LessonItem = {
  id: number;

  category: string;

  english?: string;

  hindi?: string;

  sentence?: string;

  translation?: string;

  vocabulary: VocabularyItem[];

  phrases?: PhraseItem[];
};

export type ConversationMessage = {
  id: number;

  role: ConversationRole;

  text: string;

  createdAt?: string;
};

export type AIConversationMode =
  | "daily"
  | "business"
  | "interview"
  | "advanced";

export type PronunciationFeedback = {
  score: number;

  level:
    | "excellent"
    | "good"
    | "average"
    | "needs-improvement";

  feedback: string;
};

export type PracticeSession = {
  id: string;

  duration: number;

  fluencyScore: number;

  createdAt: string;
};

export type UserProgress = {
  completedLessons: number[];

  completedPracticeSessions: number;

  streak: number;

  fluencyScore: number;
};

export type AIResponse = {
  success: boolean;

  message: string;
};

export type VoiceOption = {
  id: VoiceType;

  label: string;

  description: string;
};

export type SubtitleState = {
  active: boolean;

  text: string;
};

export type SpeechRecognitionResult = {
  transcript: string;

  confidence?: number;
};

export type LearningPhrase = {
  id: number;

  category: string;

  phrase: string;

  meaning: string;

  usage: string;

  pronunciation: string;
};

export type PronunciationTip = {
  id: number;

  title: string;

  description: string;

  example: string;

  tip: string;
};

export type ConversationStarter = {
  id: number;

  mode: AIConversationMode;

  starter: string;

  translation: string;
};

export type AILearningMode = {
  id: number;

  mode: LearningMode;

  title: string;

  description: string;

  focus: string[];

  aiPrompt: string;
};
