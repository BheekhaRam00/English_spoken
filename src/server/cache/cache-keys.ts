export const CACHE_KEYS = {
  lessons: {
    daily:
      "lessons:daily",

    business:
      "lessons:business",

    interview:
      "lessons:interview",

    advanced:
      "lessons:advanced"
  },

  practice: {
    daily:
      "practice:daily",

    business:
      "practice:business",

    interview:
      "practice:interview",

    advanced:
      "practice:advanced"
  },

  feedback: {
    pronunciation:
      "feedback:pronunciation",

    fluency:
      "feedback:fluency"
  },

  ai: {
    chat:
      "ai:chat",

    provider:
      "ai:provider"
  }
} as const;

export function buildDynamicCacheKey({
  prefix,
  identifier
}: {
  prefix: string;

  identifier: string;
}) {
  return `${prefix}:${identifier}`;
}
