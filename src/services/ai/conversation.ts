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

    "What did you do today?",

    "How is your English practice going?",

    "What are your plans for today?",

    "Tell me something interesting about yourself."
  ],

  business: [
    "How is your work going today?",

    "Tell me about your current project.",

    "How do you manage meetings at work?",

    "What are your main job responsibilities?",

    "How do you communicate with clients?"
  ],

  interview: [
    "Please introduce yourself.",

    "Tell me about your strengths.",

    "Why should we hire you?",

    "Describe your work experience.",

    "What are your career goals?"
  ],

  advanced: [
    "What motivates you to improve yourself?",

    "How do you define success?",

    "What is an important lesson you learned recently?",

    "What are your thoughts on modern technology?",

    "How do you handle difficult situations?"
  ]
};

const DAILY_FALLBACKS = [
  "That sounds good. Tell me more about it.",

  "Interesting. What happened after that?",

  "Nice. How did you feel about it?",

  "That sounds enjoyable. What do you usually do next?",

  "Very nice. Can you explain a little more?"
];

const BUSINESS_FALLBACKS = [
  "That sounds professional. Can you explain more about your work?",

  "Interesting. How do you usually manage that task?",

  "Good communication is important in professional environments.",

  "That sounds like valuable experience.",

  "How do you normally handle workplace discussions?"
];

const INTERVIEW_FALLBACKS = [
  "That sounds like a strong interview answer.",

  "Good answer. Can you explain it in more detail?",

  "That experience sounds valuable.",

  "Employers usually appreciate confident communication.",

  "Very good. What skill are you strongest at?"
];

const ADVANCED_FALLBACKS = [
  "Interesting perspective. Can you explain your thinking further?",

  "That is a thoughtful answer.",

  "Good point. What influenced your opinion?",

  "That sounds meaningful. Can you elaborate more?",

  "Interesting idea. How would you apply it practically?"
];

function getFallbackReplies(
  mode: ConversationMode
) {
  switch (mode) {
    case "business":
      return BUSINESS_FALLBACKS;

    case "interview":
      return INTERVIEW_FALLBACKS;

    case "advanced":
      return ADVANCED_FALLBACKS;

    default:
      return DAILY_FALLBACKS;
  }
}

function getRandomReply(
  replies: string[]
) {
  return replies[
    Math.floor(
      Math.random() *
        replies.length
    )
  ];
}

export function startConversation({
  mode = "daily"
}: StartConversationParams = {}) {
  const starters =
    STARTERS[mode] ||
    STARTERS.daily;

  return getRandomReply(
    starters
  );
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
      )
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    if (
      !cleanedMessage
    ) {
      return "Please say something so we can continue.";
    }

    const cleanedHistory =
      history
        .slice(-10)
        .map(
          (item) => ({
            role:
              item.role,

            text:
              cleanAIText(
                item.text
              )
          })
        );

    const aiReply =
      await generateAIReply({
        message:
          cleanedMessage,

        conversationHistory:
          cleanedHistory,

        mode
      });

    const cleanedReply =
      cleanAIText(
        aiReply
      )
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    if (
      !cleanedReply ||
      cleanedReply.length <
        2
    ) {
      return generateFallbackReply(
        cleanedMessage,
        mode
      );
    }

    return cleanedReply;
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
    return "That sounds interesting. What kind of work do you do?";
  }

  if (
    lower.includes("english") ||
    lower.includes("practice")
  ) {
    return "Your English is improving well. Keep practicing every day.";
  }

  if (
    lower.includes("meeting")
  ) {
    return "Meetings become easier with regular speaking practice.";
  }

  if (
    lower.includes("weekend")
  ) {
    return "Nice. How do you usually spend your weekends?";
  }

  if (
    lower.includes("hobby")
  ) {
    return "That sounds enjoyable. How long have you enjoyed that hobby?";
  }

  if (
    lower.includes("travel")
  ) {
    return "Traveling is a great way to learn new experiences. Where do you like to go?";
  }

  return getRandomReply(
    getFallbackReplies(
      mode
    )
  );
}
