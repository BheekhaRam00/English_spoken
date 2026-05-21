import { generateAIReply }
  from "@/services/ai/gemini";

import { cleanAIText }
  from "@/server/utils/text";

export type ConversationMessage =
  {
    role: "user" | "ai";

    text: string;
  };

export type ConversationMode =
  | "daily"
  | "business"
  | "interview"
  | "advanced";

type StartConversationParams =
  {
    mode?: ConversationMode;
  };

type ContinueConversationParams =
  {
    userMessage: string;

    history: ConversationMessage[];

    mode?: ConversationMode;
  };

const STARTERS = {
  daily: [
    "Hello! How was your day today?",

    "What do you usually do during weekends?",

    "Tell me something interesting about your routine.",

    "What are your hobbies and interests?"
  ],

  business: [
    "Tell me about your work responsibilities.",

    "How do you usually communicate with clients?",

    "Describe your typical workday.",

    "How do you handle meetings professionally?"
  ],

  interview: [
    "Please introduce yourself.",

    "Tell me about your strengths.",

    "Why should we hire you?",

    "Describe your professional experience."
  ],

  advanced: [
    "What are your thoughts on modern technology?",

    "How do you define personal success?",

    "Describe an important life lesson you learned recently.",

    "What motivates you to improve yourself?"
  ]
};

export function startConversation({
  mode = "daily"
}: StartConversationParams = {}) {
  const starters =
    STARTERS[mode] ||
    STARTERS.daily;

  return starters[
    Math.floor(
      Math.random() *
        starters.length
    )
  ];
}

export async function continueConversation({
  userMessage,
  history,
  mode = "daily"
}: ContinueConversationParams): Promise<string> {
  try {
    const cleanedMessage =
      cleanAIText(
        userMessage
      );

    if (
      !cleanedMessage
    ) {
      return "Please say something so we can continue the conversation.";
    }

    const aiReply =
      await generateAIReply({
        message:
          cleanedMessage,

        conversationHistory:
          history,

        mode
      });

    return cleanAIText(
      aiReply
    );
  } catch (error) {
    console.error(
      "Conversation Service Error:",
      error
    );

    return generateFallbackReply(
      userMessage,
      mode
    );
  }
}

export function generateFallbackReply(
  message: string,
  mode: ConversationMode =
    "daily"
) {
  const lower =
    message.toLowerCase();

  if (
    lower.includes("job") ||
    lower.includes("work")
  ) {
    return "That sounds interesting. What kind of work do you usually do?";
  }

  if (
    lower.includes("english") ||
    lower.includes("practice")
  ) {
    return "Your spoken English is improving well. Keep practicing confidently.";
  }

  if (
    lower.includes("meeting")
  ) {
    return "Professional communication becomes easier with regular practice.";
  }

  if (
    lower.includes("weekend")
  ) {
    return "Nice. How do you usually spend your weekends?";
  }

  if (
    mode ===
    "business"
  ) {
    return "That sounds professional. Can you explain your work in more detail?";
  }

  if (
    mode ===
    "interview"
  ) {
    return "That sounds like a strong interview answer. Can you elaborate further?";
  }

  if (
    mode ===
    "advanced"
  ) {
    return "Interesting perspective. What makes you think that?";
  }

  return "That sounds good. Can you tell me more about it?";
}
