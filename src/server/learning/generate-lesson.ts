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
  "meta-llama/llama-3.2-3b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "google/gemma-2-9b-it:free"
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
- Add ONLY 3 vocabulary words.
- Return STRICT VALID JSON ONLY.
- NO markdown.
- NO explanation.
- NO numbering.

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
    }, 9000);

  try {
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

            max_tokens: 260,

            frequency_penalty: 0.6,

            presence_penalty: 0.6,

            messages: [
              {
                role: "system",

                content:
                  "You generate spoken English learning JSON."
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

    const data:
      OpenRouterResponse =
      await response.json();

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
            item?.word
        )
        .slice(0, 3),

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
      return null;
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
      !parsed?.sentences
        ?.length
    ) {
      return null;
    }

    return sanitizeLesson(
      parsed
    );
  } catch (error) {
    logError(
      "Lesson Parse Error",
      error
    );

    return null;
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

function generateFallbackLesson(
  mode: string
): LessonResponse {
  const fallbackLessons = {
    beginner: {
      title:
        "Simple English",

      sentences: [
        {
          english:
            "Hello",

          hindi:
            "हेलो"
        },

        {
          english:
            "What is your name",

          hindi:
            "आपका नाम क्या है"
        },

        {
          english:
            "My name is Ravi",

          hindi:
            "मेरा नाम रवि है"
        },

        {
          english:
            "I am learning English",

          hindi:
            "मैं अंग्रेजी सीख रहा हूँ"
        },

        {
          english:
            "Nice to meet you",

          hindi:
            "आपसे मिलकर अच्छा लगा"
        }
      ]
    },

    daily: {
      title:
        "Friends Conversation",

      sentences: [
        {
          english:
            "Hello my friend",

          hindi:
            "हेलो मेरे दोस्त"
        },

        {
          english:
            "What are you doing",

          hindi:
            "आप क्या कर रहे हैं"
        },

        {
          english:
            "I am watching a movie",

          hindi:
            "मैं फिल्म देख रहा हूँ"
        },

        {
          english:
            "That sounds fun",

          hindi:
            "यह मजेदार लगता है"
        },

        {
          english:
            "Enjoy your day",

          hindi:
            "अपने दिन का आनंद लें"
        }
      ]
    },

    office: {
      title:
        "Office Meeting",

      sentences: [
        {
          english:
            "The meeting will start now",

          hindi:
            "मीटिंग अब शुरू होगी"
        },

        {
          english:
            "Please open the report",

          hindi:
            "कृपया रिपोर्ट खोलें"
        },

        {
          english:
            "We need better planning",

          hindi:
            "हमें बेहतर योजना चाहिए"
        },

        {
          english:
            "Let's complete the work today",

          hindi:
            "आइए आज काम पूरा करें"
        },

        {
          english:
            "Thank you everyone",

          hindi:
            "सभी का धन्यवाद"
        }
      ]
    }
  };

  const lesson =
    fallbackLessons[
      mode as keyof typeof fallbackLessons
    ] ||
    fallbackLessons.daily;

  return {
    title:
      lesson.title,

    sentences:
      lesson.sentences,

    vocabulary: [
      {
        word:
          "Practice",

        meaning:
          "अभ्यास",

        pronunciation:
          "प्रैक्टिस"
      },

      {
        word:
          "Team",

        meaning:
          "टीम",

        pronunciation:
          "टीम"
      },

      {
        word:
          "Meeting",

        meaning:
          "बैठक",

        pronunciation:
          "मीटिंग"
      }
    ],

    pronunciationTip:
      "Speak slowly and confidently."
  };
}

export async function generateLesson({
  mode
}: GenerateLessonParams) {
  try {
    const apiKey =
      process.env
        .OPENROUTER_API_KEY;

    const previousLessons =
      getRecentLessons(
        mode
      );

    if (!apiKey) {
      const fallback =
        generateFallbackLesson(
          mode
        );

      rememberLesson(
        mode,
        JSON.stringify(
          fallback.sentences
        )
      );

      return fallback;
    }

    const prompt =
      buildLessonPrompt(
        mode,
        previousLessons
      );

    for (const model of MODELS) {
      try {
        const reply =
          await requestLesson(
            apiKey,
            model,
            prompt
          );

        const parsed =
          parseLesson(
            cleanAIText(
              reply
            )
          );

        if (parsed) {
          rememberLesson(
            mode,
            JSON.stringify(
              parsed.sentences
            )
          );

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
