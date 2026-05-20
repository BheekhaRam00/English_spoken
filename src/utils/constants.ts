export const APP_NAME =
  "FluentPro AI";

export const APP_DESCRIPTION =
  "AI-powered spoken English learning app for Hindi users.";

export const APP_VERSION =
  "1.0.0";

export const DEFAULT_LANGUAGE =
  "en-US";

export const DEFAULT_VOICE =
  "female";

export const DEFAULT_SPEECH_RATE =
  0.95;

export const DEFAULT_PITCH = 1;

export const DEFAULT_VOLUME = 1;

export const MAX_CONVERSATION_MESSAGES =
  50;

export const PRACTICE_SESSION_LIMIT_MINUTES =
  60;

export const SUPPORTED_AI_MODES =
  [
    "beginner",
    "daily",
    "office",
    "business",
    "interview",
    "pronunciation",
    "advanced"
  ] as const;

export const SUPPORTED_VOICE_TYPES =
  [
    "female",
    "male",
    "professional"
  ] as const;

export const STORAGE_KEYS = {
  userProgress:
    "fluentpro-user-progress",

  conversationHistory:
    "fluentpro-conversation-history",

  selectedVoice:
    "fluentpro-selected-voice",

  aiMode:
    "fluentpro-ai-mode",

  practiceHistory:
    "fluentpro-practice-history",

  settings:
    "fluentpro-settings",

  streak:
    "fluentpro-streak"
};

export const GEMINI_CONFIG = {
  model: "gemini-1.5-flash",

  temperature: 0.8,

  topK: 32,

  topP: 1,

  maxOutputTokens: 120
};

export const LEARNING_CATEGORIES =
  [
    {
      id: "beginner",
      title:
        "Beginner English"
    },

    {
      id: "daily",
      title:
        "Daily Conversation"
    },

    {
      id: "office",
      title:
        "Office English"
    },

    {
      id: "business",
      title:
        "Business English"
    },

    {
      id: "interview",
      title:
        "Interview English"
    },

    {
      id: "advanced",
      title:
        "Advanced Fluency"
    }
  ];

export const PRACTICE_MODES = [
  {
    id: "voice",
    title:
      "Voice Conversation"
  },

  {
    id: "typing",
    title:
      "Typing Practice"
  },

  {
    id: "mixed",
    title:
      "Mixed Practice"
  }
];

export const AI_REPLY_FALLBACK =
  "Please continue speaking in English. You are improving well.";

export const OFFLINE_MESSAGE =
  "You are offline. Limited lessons are available.";

export const NETWORK_ERROR_MESSAGE =
  "Network connection failed. Please try again.";

export const SPEECH_NOT_SUPPORTED_MESSAGE =
  "Speech recognition is not supported on this device.";

export const SPEECH_PERMISSION_MESSAGE =
  "Microphone permission is required for voice practice.";

export const INSTALL_PWA_MESSAGE =
  "Install FluentPro AI for faster learning experience.";

export const DAILY_PRACTICE_GOAL_MINUTES =
  10;

export const FLUENCY_LEVELS = [
  {
    level: "Beginner",
    minScore: 0,
    maxScore: 40
  },

  {
    level: "Intermediate",
    minScore: 41,
    maxScore: 75
  },

  {
    level: "Advanced",
    minScore: 76,
    maxScore: 100
  }
];
