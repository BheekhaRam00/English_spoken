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
Generate ONE SHORT spoken English lesson for Indian learners.

MODE:
${mode}

VERY IMPORTANT RULES:
- Keep lesson SHORT
- Maximum 2 or 3 short sentences
- NO long paragraphs
- NO storytelling
- NO essays
- NO large conversations
- Mobile friendly format
- Beginner friendly spoken English
- Practical daily usage
- Natural English only

GOOD EXAMPLE:
English:
"Can I get a glass of water?"
"Sure, I will bring it."

Hindi:
"क्या मुझे एक गिलास पानी मिल सकता है?"
"ज़रूर, मैं लेकर आता हूँ।"

Vocabulary should contain ONLY 3 words.

Return STRICT JSON ONLY.

JSON FORMAT:
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
      "How are you today?\nI am doing well.",

    hindi:
      "आज आप कैसे हैं?\nमैं अच्छा हूँ।",

    vocabulary: [
      {
        word: "Today",

        meaning:
          "आज",

        pronunciation:
          "टुडे"
      },

      {
        word: "Well",

        meaning:
          "अच्छा",

        pronunciation:
          "वेल"
      },

      {
        word: "Doing",

        meaning:
          "कर रहा",

        pronunciation:
          "डूइंग"
      }
    ],

    phrases: [
      {
        phrase:
          "How are you?",

        meaning:
          "आप कैसे हैं?"
      }
    ],

    pronunciationTip:
      "Speak slowly and clearly."
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

    parsedLesson.english =
      parsedLesson.english
        ?.trim()
        ?.slice(0, 220);

    parsedLesson.hindi =
      parsedLesson.hindi
        ?.trim()
        ?.slice(0, 220);

    parsedLesson.vocabulary =
      (
        parsedLesson.vocabulary ||
        []
      ).slice(0, 3);

    parsedLesson.phrases =
      (
        parsedLesson.phrases ||
        []
      ).slice(0, 2);

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
