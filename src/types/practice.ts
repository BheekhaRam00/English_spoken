import {
  ConversationMessage,
  VoiceType,
  AIConversationMode,
  SpeechRecognitionResult,
  PronunciationFeedback
} from "./index";

export type PracticeMode =
  | "voice"
  | "typing"
  | "mixed";

export type LiveConversationState = {
  active: boolean;

  listening: boolean;

  speaking: boolean;

  subtitle: string;
};

export type VoiceConversationSession = {
  sessionId: string;

  startedAt: string;

  mode: AIConversationMode;

  voiceType: VoiceType;

  messages: ConversationMessage[];
};

export type UserSpeechInput = {
  transcript: string;

  confidence: number;

  createdAt: string;
};

export type AIReply = {
  text: string;

  audioEnabled: boolean;

  createdAt: string;
};

export type ConversationStatistics = {
  totalMessages: number;

  totalPracticeMinutes: number;

  fluencyScore: number;

  pronunciationScore: number;
};

export type MicState = {
  enabled: boolean;

  listening: boolean;

  permissionGranted: boolean;
};

export type SubtitleMessage = {
  id: number;

  role: "user" | "ai";

  text: string;
};

export type VoicePreference = {
  selectedVoice: VoiceType;

  speechRate: number;

  pitch: number;

  volume: number;
};

export type ConversationPrompt = {
  id: number;

  mode: AIConversationMode;

  text: string;

  translation?: string;
};

export type PracticeFeedback = {
  pronunciation: PronunciationFeedback;

  tips: string[];

  suggestedSentence?: string;
};

export type SpeechRecognitionState = {
  supported: boolean;

  listening: boolean;

  lastResult?: SpeechRecognitionResult;

  error?: string;
};

export type PracticeScreenState = {
  loading: boolean;

  connected: boolean;

  conversationStarted: boolean;

  aiTyping: boolean;
};

export type TypingPracticeMessage = {
  text: string;

  correctedText?: string;

  aiResponse?: string;
};

export type PracticeHistoryItem = {
  id: string;

  createdAt: string;

  mode: AIConversationMode;

  duration: number;

  fluencyScore: number;
};

export type RealTimeConversationConfig = {
  autoSpeakAI: boolean;

  subtitlesEnabled: boolean;

  pronunciationFeedbackEnabled: boolean;

  saveHistory: boolean;
};
