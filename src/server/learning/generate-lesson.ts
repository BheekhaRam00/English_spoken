import { cleanAIText }
  from "@/server/utils/text";

import { logError }
  from "@/server/utils/logger";

type GenerateLessonParams = {
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

  pronunciationTip: string;
};

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

/*
WORKING FAST MODELS
*/
const MODELS = [
  "google/gemma-2-9b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "qwen/qwen3-32b:free"
];

function buildLessonPrompt(
  mode: string
) {
  return `
Generate a SHORT spoken English lesson.

Mode: ${mode}

RULES:
- Only 4 to 6 short sentences.
- Very easy English.
- One sentence per line.
- Daily spoken style.
- No paragraph.
- No long explanation.

Return ONLY valid JSON.

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
  "pronunciationTip": ""
}
`;
}

async function requestLesson(
  apiKey: string,
  model: string,
  prompt: string
) {
  const response =
    await fetch(
      OPENROUTER_URL,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          model,

          temperature: 0.5,

          max_tokens: 300,

          messages: [
            {
              role: "user",

              content:
                prompt
            }
          ]
        })
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error
        ?.message ||
        "Model failed"
    );
  }

  return data?.choices?.[0]
    ?.message?.content;
}

function parseLesson(
  text: string
): LessonResponse | null {
  try {
    const cleaned =
      cleanAIText(text)
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    const jsonStart =
      cleaned.indexOf("{");

    const jsonEnd =
      cleaned.lastIndexOf("}");

    if (
      jsonStart === -1 ||
      jsonEnd === -1
    ) {
      return null;
    }

    const jsonString =
      cleaned.slice(
        jsonStart,
        jsonEnd + 1
      );

    return JSON.parse(
      jsonString
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
  const lessons = {
    daily: {
      title:
        "Daily English Practice",

      english:
        "Hello.\nHow are you?\nI am fine.\nWhat are you doing today?\nI am going to work.",

      hindi:
        "हेलो।\nआप कैसे हैं?\nमैं ठीक हूँ।\nआप आज क्या कर रहे हैं?\nमैं काम पर जा रहा हूँ।"
    },

    business: {
      title:
        "Business Meeting",

      english:
        "Good morning.\nThe meeting starts at 10 AM.\nPlease send the report.\nI will check the email.\nThank you.",

      hindi:
        "सुप्रभात।\nमीटिंग 10 बजे शुरू होती है।\nकृपया रिपोर्ट भेजें।\nमैं ईमेल चेक करूंगा।\nधन्यवाद।"
    },

    interview: {
      title:
        "Interview Practice",

      english:
        "Tell me about yourself.\nI am a hardworking person.\nI like learning new skills.\nI can work in a team.\nThank you.",

      hindi:
        "अपने बारे में बताइए।\nमैं मेहनती व्यक्ति हूँ।\nमुझे नई चीजें सीखना पसंद है।\nमैं टीम में काम कर सकता हूँ।\nधन्यवाद।"
    }
  };

  const selected =
    lessons[
      mode as keyof typeof lessons
    ] ||
    lessons.daily;

  return {
    title:
      selected.title,

    english:
      selected.english,

    hindi:
      selected.hindi,

    vocabulary: [
      {
        word:
          "Hello",

        meaning:
          "नमस्ते",

        pronunciation:
          "हैलो"
      },

      {
        word:
          "Work",

        meaning:
          "काम",

        pronunciation:
          "वर्क"
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

    const prompt =
      buildLessonPrompt(
        mode
      );

    for (const model of MODELS) {
      try {
        const reply =
          await requestLesson(
            apiKey,
            model,
            prompt
          );

        if (!reply) {
          continue;
        }

        const parsed =
          parseLesson(
            reply
          );

        if (parsed) {
          return parsed;
        }
      } catch (error) {
        logError(
          `Model Failed: ${model}`,
          error
        );
      }
    }

    return generateFallbackLesson(
      mode
    );
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
