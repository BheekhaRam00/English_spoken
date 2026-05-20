import {
  VoiceType,
  LearningMode
} from "@/types";

export function isValidEmail(
  email: string
) {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(
    email.trim()
  );
}

export function isValidMessage(
  message: string,
  minLength = 1,
  maxLength = 500
) {
  const trimmed =
    message.trim();

  return (
    trimmed.length >=
      minLength &&
    trimmed.length <=
      maxLength
  );
}

export function isValidVoiceType(
  voice: string
): voice is VoiceType {
  return [
    "female",
    "male",
    "professional"
  ].includes(voice);
}

export function isValidLearningMode(
  mode: string
): mode is LearningMode {
  return [
    "beginner",
    "daily",
    "office",
    "business",
    "interview",
    "pronunciation",
    "advanced"
  ].includes(mode);
}

export function isValidScore(
  score: number
) {
  return (
    !Number.isNaN(score) &&
    score >= 0 &&
    score <= 100
  );
}

export function isValidSentence(
  sentence: string
) {
  const trimmed =
    sentence.trim();

  return (
    trimmed.length >= 3 &&
    trimmed.length <= 300
  );
}

export function isValidVocabularyWord(
  word: string
) {
  return (
    word.trim().length >=
      2 &&
    word.trim().length <=
      40
  );
}

export function hasMicrophoneSupport() {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  return Boolean(
    navigator.mediaDevices &&
      navigator.mediaDevices
        .getUserMedia
  );
}

export function isSpeechRecognitionAvailable() {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  return Boolean(
    window.SpeechRecognition ||
      window.webkitSpeechRecognition
  );
}

export function isSpeechSynthesisAvailable() {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  return (
    "speechSynthesis" in
    window
  );
}

export function validatePracticeDuration(
  minutes: number
) {
  return (
    !Number.isNaN(minutes) &&
    minutes >= 0 &&
    minutes <= 300
  );
}

export function validateConversationMessages(
  messages: {
    role: string;
    text: string;
  }[]
) {
  if (
    !Array.isArray(messages)
  ) {
    return false;
  }

  return messages.every(
    (message) =>
      typeof message.text ===
        "string" &&
      [
        "user",
        "ai"
      ].includes(message.role)
  );
}

export function validateApiKey(
  apiKey: string
) {
  return (
    apiKey.trim().length >=
    20
  );
}

export function containsOnlyEnglish(
  text: string
) {
  const regex =
    /^[A-Za-z0-9\s.,!?'"()-]+$/;

  return regex.test(text);
}

export function containsHindi(
  text: string
) {
  const regex =
    /[\u0900-\u097F]/;

  return regex.test(text);
}

export function sanitizeInput(
  text: string
) {
  return text
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isOnline() {
  if (
    typeof navigator ===
    "undefined"
  ) {
    return true;
  }

  return navigator.onLine;
}

export function validatePronunciationScore(
  score: number
) {
  return (
    score >= 0 &&
    score <= 100
  );
}

export function validateLessonId(
  id: number
) {
  return (
    Number.isInteger(id) &&
    id > 0
  );
}
