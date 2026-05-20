import { generateAIReply } from "./gemini";

export type ConversationMessage = {
  role: "user" | "ai";
  text: string;
};

export type ConversationMode =
  | "daily"
  | "business"
  | "interview"
  | "advanced";

type StartConversationParams = {
  mode?: ConversationMode;
};

type ContinueConversationParams = {
  userMessage: string;

  apiKey: string;

  history: ConversationMessage[];

  mode?: ConversationMode;
};

const starters = {
  daily: [
    "Hello! Tell me about your day.",
    "What did you do today?",
    "What are your hobbies?",
    "How do you usually spend your weekends?"
  ],

  business: [
    "Tell me about your work responsibilities.",
    "How do you communicate with clients?",
    "Describe a challenge you solved at work.",
    "How do you handle professional meetings?"
  ],

  interview: [
    "Please introduce yourself.",
    "Tell me about your strengths.",
    "Why should we hire you?",
    "Describe your professional experience."
  ],

  advanced: [
    "Let's practice advanced English conversation.",
    "Tell me your opinion on modern technology.",
    "How would you explain your future goals professionally?",
    "Describe a difficult decision you made recently."
  ]
};

export function startConversation({
  mode = "daily"
}: StartConversationParams = {}) {
  const list =
    starters[mode] ||
    starters.daily;

  const randomIndex = Math.floor(
    Math.random() * list.length
  );

  return list[randomIndex];
}

export async function continueConversation({
  userMessage,
  apiKey,
  history,
  mode = "daily"
}: ContinueConversationParams): Promise<string> {
  try {
    const contextualHistory = [
      {
        role: "ai" as const,
        text: `Conversation mode: ${mode}`
      },

      ...history
    ];

    const reply =
      await generateAIReply({
        message: userMessage,

        apiKey,

        conversationHistory:
          contextualHistory
      });

    return cleanAIResponse(reply);
  } catch (error) {
    console.error(
      "Conversation Error:",
      error
    );

    return "Please continue speaking in English. You are doing well.";
  }
}

export function cleanAIResponse(
  text: string
) {
  return text
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

export function generateFallbackReply(
  message: string
) {
  const lower =
    message.toLowerCase();

  if (
    lower.includes("job") ||
    lower.includes("work")
  ) {
    return "That sounds interesting. What are your main responsibilities at work?";
  }

  if (
    lower.includes("business")
  ) {
    return "Professional communication improves with regular speaking practice.";
  }

  if (
    lower.includes("english")
  ) {
    return "Your English is improving. Keep practicing confidently every day.";
  }

  if (
    lower.includes("meeting")
  ) {
    return "Meetings become easier when you speak clearly and confidently.";
  }

  return "That's good. Please tell me more in English.";
}
