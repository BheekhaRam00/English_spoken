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

type VocabularyItem = {
  word: string;

  meaning: string;

  pronunciation: string;
};

type LessonSentence = {
  english: string;

  hindi: string;
};

type LessonResponse = {
  title: string;

  sentences: LessonSentence[];

  vocabulary: VocabularyItem[];

  pronunciationTip: string;

  source?: string;

  model?: string;

  debug?: string;
};

type OpenRouterResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];

  error?: {
    message?: string;
  };
};

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

 const MODELS = [
  "openai/gpt-oss-20b:free",

  "qwen/qwen3-32b:free",

  "mistralai/mistral-small-3.1-24b-instruct:free"
];
const RECENT_LESSONS =
  new Map<
    string,
    string[]
  >();

function buildLessonPrompt(
  mode: string,
  previousLessons: string[]
) {
  return `
Generate ONE spoken English lesson for Indian learners.

MODE:
${mode}

STRICT RULES:
- ONLY 4 to 5 short sentences.
- Spoken English only.
- Real life conversation.
- VERY EASY English.
- Every English sentence MUST have matching Hindi translation.
- Add ONLY 3 vocabulary words related to the lesson.
- Return STRICT VALID JSON ONLY.
- NO markdown.
- NO explanation.
- NO numbering.
- Vocabulary MUST NOT repeat.
- Generate fresh lesson every time.

DO NOT REPEAT THESE LESSONS:
${previousLessons.join("\n---\n")}

VALID JSON FORMAT:
{
  "title": "",
  "sentences": [
    {
      "english": "",
      "hindi": ""
    }
  ],
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
  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 20000);

  try {
    console.log(
      "REQUESTING MODEL:",
      model
    );

    const response =
      await fetch(
        OPENROUTER_URL,
        {
          method: "POST",

          signal:
            controller.signal,

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",

            "HTTP-Referer":
              "https://fluentpro-ai.vercel.app",

            "X-Title":
              "FluentPro AI"
          },

          body: JSON.stringify({
            model,

            temperature: 1,

            top_p: 0.95,

            max_tokens: 320,

            frequency_penalty: 0.6,

            presence_penalty: 0.6,

            messages: [
              {
                role: "system",

                content:
                  "You generate spoken English learning lessons in STRICT JSON only."
              },

              {
                role: "user",

                content:
                  prompt
              }
            ]
          })
        }
      );

    console.log(
      "MODEL STATUS:",
      response.status
    );

    /*
    RAW RESPONSE FIRST
    */
    const rawText =
      await response.text();

    console.log(
      "RAW RESPONSE:",
      rawText
    );

    let data:
      OpenRouterResponse;

    try {
      data =
        JSON.parse(
          rawText
        );
    } catch {
      throw new Error(
        "Invalid JSON response from OpenRouter"
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.error
          ?.message ||
          `Model failed: ${model}`
      );
    }

    const content =
      data?.choices?.[0]
        ?.message?.content;

    if (
      !content ||
      typeof content !==
        "string"
    ) {
      throw new Error(
        `Empty AI response from ${model}`
      );
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}

function sanitizeLesson(
  lesson: any
): LessonResponse {
  return {
    title:
      lesson.title ||
      "English Practice",

    sentences:
      (
        lesson.sentences ||
        []
      )
        .filter(
          (
            item: any
          ) =>
            item?.english &&
            item?.hindi
        )
        .slice(0, 5)
        .map(
          (
            item: any
          ) => ({
            english:
              String(
                item.english
              ).trim(),

            hindi:
              String(
                item.hindi
              ).trim()
          })
        ),

    vocabulary:
      (
        lesson.vocabulary ||
        []
      )
        .filter(
          (
            item: any
          ) =>
            item?.word &&
            item?.meaning
        )
        .slice(0, 3)
        .map(
          (
            item: any
          ) => ({
            word:
              String(
                item.word
              ).trim(),

            meaning:
              String(
                item.meaning
              ).trim(),

            pronunciation:
              String(
                item.pronunciation ||
                item.word
              ).trim()
          })
        ),

    pronunciationTip:
      lesson.pronunciationTip ||
      "Speak slowly and clearly."
  };
}

function parseLesson(
  text: string
): LessonResponse | null {
  try {
    const cleaned =
      text
        .replace(
          /```json/gi,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

    console.log(
      "RAW AI CONTENT:",
      cleaned
    );

    const jsonStart =
      cleaned.indexOf("{");

    const jsonEnd =
      cleaned.lastIndexOf(
        "}"
      );

    if (
      jsonStart === -1 ||
      jsonEnd === -1
    ) {
      throw new Error(
        "JSON boundaries not found"
      );
    }

    const jsonString =
      cleaned.slice(
        jsonStart,
        jsonEnd + 1
      );

    const parsed =
      JSON.parse(
        jsonString
      );

    if (
      !parsed?.sentences ||
      !Array.isArray(
        parsed.sentences
      ) ||
      parsed.sentences.length ===
        0
    ) {
      throw new Error(
        "Invalid lesson sentences"
      );
    }

    return sanitizeLesson(
      parsed
    );
  } catch (error) {
    logError(
      "Lesson Parse Error",
      error
    );

    throw error;
  }
}

function rememberLesson(
  mode: string,
  lesson: string
) {
  const existing =
    RECENT_LESSONS.get(
      mode
    ) || [];

  existing.unshift(
    lesson
  );

  RECENT_LESSONS.set(
    mode,
    existing.slice(0, 6)
  );
}

function getRecentLessons(
  mode: string
) {
  return (
    RECENT_LESSONS.get(
      mode
    ) || []
  );
}

export async function generateLesson({
  mode
}: GenerateLessonParams) {
  const apiKey =
    process.env
      .OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY missing"
    );
  }

  const previousLessons =
    getRecentLessons(
      mode
    );

  const prompt =
    buildLessonPrompt(
      mode,
      previousLessons
    );

  let lastError:
    unknown = null;

  for (const model of MODELS) {
    try {
      console.log(
        "TRYING MODEL:",
        model
      );

      const reply =
        await requestLesson(
          apiKey,
          model,
          prompt
        );

      const cleanedReply =
        cleanAIText(
          reply
        );

      console.log(
        "CLEANED AI RESPONSE:",
        cleanedReply
      );

      const parsed =
        parseLesson(
          cleanedReply
        );

      if (
        !parsed
      ) {
        throw new Error(
          "Lesson parse failed"
        );
      }

      rememberLesson(
        mode,
        JSON.stringify(
          parsed.sentences
        )
      );

      return {
        ...parsed,

        source:
          "ai",

        model,

        debug:
          "AI generation success"
      };
    } catch (error) {
      lastError = error;

      console.log(
        "MODEL FAILED:",
        model,
        error
      );

      logError(
        `Model Failed: ${model}`,
        error
      );
    }
  }

  throw new Error(
    `All models failed: ${String(
      lastError
    )}`
  );
            }
