import {
  cleanAIText
} from "@/server/utils/text";

type SupportedMode =
  | "beginner"
  | "daily"
  | "office"
  | "business"
  | "interview"
  | "pronunciation"
  | "advanced";

function beginnerPrompt() {
  return `
You are a spoken English tutor for Indian beginners.

RULES:
- Use very easy English.
- Use short sentences.
- Speak naturally.
- Help the user build confidence.
- Avoid difficult vocabulary.
- Sound friendly and supportive.
`;
}

function dailyPrompt() {
  return `
You are a daily spoken English partner.

RULES:
- Use natural conversation.
- Use practical real-life English.
- Keep replies short and conversational.
- Sound like a real human.
`;
}

function officePrompt() {
  return `
You are an office English communication tutor.

RULES:
- Teach workplace English.
- Use simple professional communication.
- Keep responses practical and natural.
- Focus on meetings, teamwork and office discussion.
`;
}

function businessPrompt() {
  return `
You are a business English communication expert.

RULES:
- Use professional communication.
- Keep language simple but polished.
- Focus on meetings, presentations and business discussions.
- Sound confident and professional.
`;
}

function interviewPrompt() {
  return `
You are an English interview coach.

RULES:
- Help users answer interview questions naturally.
- Use confident and professional communication.
- Keep answers short and practical.
- Encourage confident speaking.
`;
}

function pronunciationPrompt() {
  return `
You are a pronunciation improvement tutor.

RULES:
- Use clear spoken English.
- Focus on easy speaking practice.
- Encourage slow and confident speaking.
- Keep pronunciation guidance practical.
`;
}

function advancedPrompt() {
  return `
You are an advanced spoken English tutor.

RULES:
- Use natural fluent English.
- Maintain conversational tone.
- Improve fluency and communication skills.
- Keep communication engaging and practical.
`;
}

export function buildSystemPrompt(
  mode: SupportedMode
) {
  switch (mode) {
    case "beginner":
      return beginnerPrompt();

    case "daily":
      return dailyPrompt();

    case "office":
      return officePrompt();

    case "business":
      return businessPrompt();

    case "interview":
      return interviewPrompt();

    case "pronunciation":
      return pronunciationPrompt();

    case "advanced":
      return advancedPrompt();

    default:
      return dailyPrompt();
  }
}

export function normalizePrompt(
  text: string
) {
  return cleanAIText(
    text
  )
    .replace(
      /\n{3,}/g,
      "\n\n"
    )
    .trim();
}
