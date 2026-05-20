import {
  LearningMode,
  VocabularyItem,
  PhraseItem
} from "@/types";

import {
  getAILearningMode
} from "./lesson-loader";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

type GenerateLessonParams = {
  apiKey: string;

  mode: LearningMode;

  userLevel?: string;
};

export type DynamicGeneratedLesson =
  {
    title: string;

    english: string;

    hindi: string;

    vocabulary: VocabularyItem[];

    phrases: PhraseItem[];

    pronunciationTip: string;
  };

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
};

function buildPrompt(
  mode: LearningMode,
  userLevel: string
) {
  const modeData =
    getAILearningMode(mode);

  return `
You are an expert spoken English trainer for Hindi speaking Indian users.

Generate a practical English learning lesson.

Mode:
${modeData?.title}

Focus:
${modeData?.focus.join(", ")}

User Level:
${userLevel}

Requirements:
- Natural spoken English
- Real-world conversation
- Professional tone if needed
- Hindi translation
- Vocabulary meanings
- English phrases
- Pronunciation tip

Return ONLY valid JSON.

JSON format:
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

function safeParseLesson(
  text: string
): DynamicGeneratedLesson | null {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "AI lesson parse error:",
      error
    );

    return null;
  }
}

export async function generateDynamicLesson({
  apiKey,
  mode,
  userLevel = "beginner"
}: GenerateLessonParams): Promise<DynamicGeneratedLesson | null> {
  try {
    const prompt =
      buildPrompt(
        mode,
        userLevel
      );

    const response = await fetch(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 1,
            maxOutputTokens: 500
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to generate lesson."
      );
    }

    const data: GeminiResponse =
      await response.json();

    const text =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!text) {
      return null;
    }

    return safeParseLesson(text);
  } catch (error) {
    console.error(
      "Dynamic lesson generation error:",
      error
    );

    return null;
  }
}

export async function generateBusinessScenario(
  apiKey: string
) {
  return generateDynamicLesson({
    apiKey,

    mode: "business",

    userLevel: "advanced"
  });
}

export async function generateInterviewPractice(
  apiKey: string
) {
  return generateDynamicLesson({
    apiKey,

    mode: "interview",

    userLevel: "intermediate"
  });
}

export async function generateDailyConversationLesson(
  apiKey: string
) {
  return generateDynamicLesson({
    apiKey,

    mode: "daily",

    userLevel: "beginner"
  });
}
