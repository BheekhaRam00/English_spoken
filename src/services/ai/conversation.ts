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
    "Hello! How was your day?",

    "What do you usually do in your free time?",

    "Tell me something interesting about your day.",

    "How do you usually spend your weekends?"
  ],

  business: [
    "Tell me about your current work responsibilities.",

    "How do you communicate with clients at work?",

    "What skills are important in your profession?",

    "How do you handle workplace challenges?"
  ],

  interview: [
    "Please introduce yourself professionally.",

    "What are your strengths?",

    "Why do you want this job?",

    "Tell me about your work experience."
  ],

  advanced: [
    "What are your future career goals?",

    "What do you think about modern technology?",

    "How can communication skills improve success?",

    "Describe an important life decision you made."
  ]
};

export function startConversation({
  mode = "daily"
}: StartConversationParams = {}) {
  const list =
    starters[mode] ||
    starters.daily;

  return list[
    Math.floor(
      Math.random() *
        list.length
    )
  ];
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

    return "I understand. Please continue speaking in English.";
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
  return "That's interesting. Tell me more.";
}
