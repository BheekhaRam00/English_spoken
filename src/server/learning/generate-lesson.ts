import { requestAICompletion }
  from "@/server/ai/provider-manager";

import { cleanAIText }
  from "@/server/utils/text";

import { logError }
  from "@/server/utils/logger";

type GenerateLessonParams =
  {
    mode:
      | "beginner"
      | "daily"
      | "office"
      | "business"
      | "interview"
      | "pronunciation"
      | "advanced";
  };

type LessonResponse = {
  title: string;

  english: string;

  hindi: string;

  vocabulary: {
    word: string;

    meaning: string;

    pronunciation: string;
  }[];

  phrases: {
    phrase: string;

    meaning: string;
  }[];

  pronunciationTip: string;
};

function buildLessonPrompt(
  mode: string
) {
  return `
Generate ONE high-quality spoken English lesson for Indian learners.

Mode:
${mode}

Requirements:
- Practical spoken English
- Real-life conversation
- Easy to understand
- Professional when needed
- Natural English
- Hindi translation

Return STRICT JSON only.

JSON Format:
{
  "title": "",
  "english": "",
  "hindi": "",
  "vocabulary": [
    {
      "word": "",
      "meaning": "",
      "pronunciation": ""
    }
  ],
  "phrases": [
    {
      "phrase": "",
      "meaning": ""
    }
  ],
  "pronunciationTip": ""
}
`;
}

function parseLesson(
  text: string
): LessonResponse | null {
  try {
    const cleaned =
      text
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    return JSON.parse(
      cleaned
    );
  } catch (error) {
    logError(
      "Lesson Parse Error",
      error
    );

    return null;
  }
}

function generateFallbackLesson(
  mode: string
): LessonResponse {
  return {
    title:
      `${mode} English Practice`,

    english:
      "How was your day at work today?",

    hindi:
      "आज आपका दिन काम पर कैसा था?",

    vocabulary: [
      {
        word: "Work",

        meaning:
          "काम",

        pronunciation:
          "वर्क"
      },

      {
        word: "Today",

        meaning:
          "आज",

        pronunciation:
          "टुडे"
      }
    ],

    phrases: [
      {
        phrase:
          "How was your day?",

        meaning:
          "आपका दिन कैसा था?"
      }
    ],

    pronunciationTip:
      "Speak slowly and clearly while practicing."
  };
}

export async function generateLesson({
  mode
}: GenerateLessonParams) {
  try {
    const apiKey =
      process.env
        .OPENROUTER_API_KEY;

    if (!apiKey) {
      return generateFallbackLesson(
        mode
      );
    }

    const aiReply =
      await requestAICompletion({
        apiKey,

        message:
          buildLessonPrompt(
            mode
          ),

        history: [],

        mode:
          "daily"
      });

    const cleanedReply =
      cleanAIText(
        aiReply
      );

    const parsedLesson =
      parseLesson(
        cleanedReply
      );

    if (!parsedLesson) {
      return generateFallbackLesson(
        mode
      );
    }

    return parsedLesson;
  } catch (error) {
    logError(
      "Generate Lesson Error",
      error
    );

    return generateFallbackLesson(
      mode
    );
  }
}
