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

type LessonResponse = {
  title: string;

  english: string;

  hindi: string;

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

/*
STABLE FAST FREE MODELS
*/
const MODELS = [
  "deepseek/deepseek-chat-v3-0324:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "nousresearch/hermes-3-llama-3.1-8b:free"
];

function buildLessonPrompt(
  mode: string
) {
  return `
Generate ONE spoken English lesson for Indian learners.

MODE:
${mode}

STRICT RULES:
- ONLY 4 to 6 short spoken English sentences.
- Every sentence MUST be on a NEW LINE.
- Very easy English.
- Natural real-life conversation.
- NO paragraph.
- NO explanation.
- NO markdown.
- NO headings inside english text.
- Hindi translation line-by-line.
- Add 4 useful vocabulary words only.
- Output STRICT VALID JSON ONLY.

EXAMPLE ENGLISH:
Hello.
How are you?
I am fine.

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
    }, 12000);

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

            temperature: 0.8,

            top_p: 0.9,

            frequency_penalty: 0.2,

            presence_penalty: 0.2,

            max_tokens: 220,

            messages: [
              {
                role: "system",

                content:
                  "You are a spoken English lesson generator."
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
          `Provider failed for ${model}`
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
  lesson: LessonResponse
): LessonResponse {
  const english =
    lesson.english
      ?.split("\n")
      .map((line) =>
        line.trim()
      )
      .filter(Boolean)
      .slice(0, 6)
      .join("\n");

  const hindi =
    lesson.hindi
      ?.split("\n")
      .map((line) =>
        line.trim()
      )
      .filter(Boolean)
      .slice(0, 6)
      .join("\n");

  return {
    title:
      lesson.title ||
      "English Practice",

    english,

    hindi,

    vocabulary:
      lesson.vocabulary?.slice(
        0,
        4
      ) || [],

    pronunciationTip:
      lesson.pronunciationTip ||
      "Speak slowly and confidently."
  };
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

    const parsed =
      JSON.parse(
        jsonString
      ) as LessonResponse;

    if (
      !parsed?.english ||
      !parsed?.hindi
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

function generateFallbackLesson(
  mode: string
): LessonResponse {
  const lessons = {
    beginner: {
      title:
        "Beginner English",

      english:
        "Hello.\nMy name is Rahul.\nI am learning English.\nI practice every day.\nEnglish is important.",

      hindi:
        "हेलो।\nमेरा नाम राहुल है।\nमैं अंग्रेजी सीख रहा हूँ।\nमैं रोज अभ्यास करता हूँ।\nअंग्रेजी महत्वपूर्ण है।"
    },

    daily: {
      title:
        "Daily English Practice",

      english:
        "Hello.\nHow are you?\nI am fine.\nWhat are you doing today?\nI am going to work.",

      hindi:
        "हेलो।\nआप कैसे हैं?\nमैं ठीक हूँ।\nआप आज क्या कर रहे हैं?\nमैं काम पर जा रहा हूँ।"
    },

    office: {
      title:
        "Office English",

      english:
        "Good morning.\nPlease check the email.\nThe meeting starts now.\nI will finish the report.\nThank you.",

      hindi:
        "सुप्रभात।\nकृपया ईमेल चेक करें।\nमीटिंग अब शुरू होती है।\nमैं रिपोर्ट पूरी कर दूंगा।\nधन्यवाद।"
    },

    business: {
      title:
        "Business English",

      english:
        "Welcome to the meeting.\nLet's discuss the project.\nPlease share your ideas.\nWe need better results.\nThank you everyone.",

      hindi:
        "मीटिंग में आपका स्वागत है।\nआइए प्रोजेक्ट पर चर्चा करें।\nकृपया अपने विचार साझा करें।\nहमें बेहतर परिणाम चाहिए।\nसभी का धन्यवाद।"
    },

    interview: {
      title:
        "Interview Practice",

      english:
        "Tell me about yourself.\nI am a hardworking person.\nI enjoy learning new skills.\nI can work in a team.\nThank you for this opportunity.",

      hindi:
        "अपने बारे में बताइए।\nमैं मेहनती व्यक्ति हूँ।\nमुझे नई चीजें सीखना पसंद है।\nमैं टीम में काम कर सकता हूँ।\nइस अवसर के लिए धन्यवाद।"
    },

    pronunciation: {
      title:
        "Pronunciation Practice",

      english:
        "Please speak slowly.\nRepeat the sentence clearly.\nFocus on every word.\nPractice improves fluency.\nConfidence is important.",

      hindi:
        "कृपया धीरे बोलें।\nवाक्य को स्पष्ट रूप से दोहराएँ।\nहर शब्द पर ध्यान दें।\nअभ्यास से सुधार होता है।\nआत्मविश्वास महत्वपूर्ण है।"
    },

    advanced: {
      title:
        "Advanced English",

      english:
        "I would like to discuss the proposal.\nYour presentation was impressive.\nWe should improve communication.\nLet's finalize the strategy today.\nThank you for your support.",

      hindi:
        "मैं प्रस्ताव पर चर्चा करना चाहूँगा।\nआपकी प्रस्तुति प्रभावशाली थी।\nहमें संचार सुधारना चाहिए।\nआइए आज रणनीति अंतिम करें।\nआपके सहयोग के लिए धन्यवाद।"
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
          "Practice",

        meaning:
          "अभ्यास",

        pronunciation:
          "प्रैक्टिस"
      },

      {
        word:
          "Work",

        meaning:
          "काम",

        pronunciation:
          "वर्क"
      },

      {
        word:
          "Meeting",

        meaning:
          "बैठक",

        pronunciation:
          "मीटिंग"
      },

      {
        word:
          "Confidence",

        meaning:
          "आत्मविश्वास",

        pronunciation:
          "कॉन्फिडेंस"
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
