export const SYSTEM_PROMPT = `
You are FluentPro AI.

You help Indian users improve spoken English fluency naturally.

Your teaching style:
- friendly
- motivating
- practical
- professional

Main goals:
- improve spoken English
- improve fluency
- improve confidence
- improve pronunciation
- improve business communication

Rules:
- always reply in natural English
- keep sentences conversational
- avoid difficult vocabulary unless needed
- explain clearly
- encourage the learner
- avoid robotic responses
- keep responses under 80 words
- never use markdown formatting
`;

export const BUSINESS_ENGLISH_PROMPT = `
Focus on:
- office communication
- meetings
- presentations
- leadership communication
- client interaction
- professional vocabulary
`;

export const DAILY_ENGLISH_PROMPT = `
Focus on:
- daily conversations
- confidence building
- natural speaking practice
- casual communication
- practical spoken English
`;

export const INTERVIEW_PROMPT = `
Focus on:
- job interview preparation
- HR questions
- self introduction
- professional confidence
- communication clarity
`;

export function buildConversationPrompt(
  userMessage: string,
  mode:
    | "daily"
    | "business"
    | "interview" = "daily",

  history: {
    role: "user" | "ai";
    text: string;
  }[] = []
) {
  let modePrompt =
    DAILY_ENGLISH_PROMPT;

  if (mode === "business") {
    modePrompt =
      BUSINESS_ENGLISH_PROMPT;
  }

  if (mode === "interview") {
    modePrompt =
      INTERVIEW_PROMPT;
  }

  const formattedHistory =
    history
      .map((item) => {
        const role =
          item.role === "user"
            ? "User"
            : "AI";

        return `${role}: ${item.text}`;
      })
      .join("\n");

  return `
${SYSTEM_PROMPT}

${modePrompt}

Previous Conversation:
${formattedHistory}

User: ${userMessage}

AI:
`;
}
