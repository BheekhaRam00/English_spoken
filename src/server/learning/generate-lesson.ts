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
ONLY ACTIVE + STABLE FREE MODELS
*/
const MODELS = [
  "meta-llama/llama-3.2-3b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "google/gemma-2-9b-it:free"
];

/*
PREVENT SAME LESSON REPEAT
*/
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
- Every sentence MUST be on NEW LINE.
- Easy spoken English.
- Real life conversation.
- NO paragraph.
- NO markdown.
- NO numbering.
- NO heading inside lesson.
- Hindi translation line-by-line.
- Add ONLY 3 vocabulary words.
- Return STRICT VALID JSON ONLY.

DO NOT REPEAT THESE LESSONS:
${previousLessons.join("\n---\n")}

VALID JSON FORMAT:
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

            max_tokens: 220,

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

function normalizeLines(
  text: string
) {
  return text
    .split(
      /\n|[.!?]+/
    )
    .map((line) =>
      line.trim()
    )
    .filter(
      (line) =>
        line.length > 1
    )
    .slice(0, 5)
    .join("\n");
}

function sanitizeLesson(
  lesson: LessonResponse
): LessonResponse {
  return {
    title:
      lesson.title ||
      "English Practice",

    english:
      normalizeLines(
        lesson.english
      ),

    hindi:
      normalizeLines(
        lesson.hindi
      ),

    vocabulary:
      (
        lesson.vocabulary ||
        []
      )
        .filter(
          (item) =>
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

function rememberLesson(
  mode: string,
  english: string
) {
  const existing =
    RECENT_LESSONS.get(
      mode
    ) || [];

  existing.unshift(
    english
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
    beginner: [
      {
        title:
          "Simple English",

        english:
          "Hello\nWhat is your name\nMy name is Ravi\nI am learning English\nNice to meet you",

        hindi:
          "हेलो\nआपका नाम क्या है\nमेरा नाम रवि है\nमैं अंग्रेजी सीख रहा हूँ\nआपसे मिलकर अच्छा लगा"
      },

      {
        title:
          "Daily Speaking",

        english:
          "Good morning\nHow are you today\nI am feeling good\nI am going to school\nHave a nice day",

        hindi:
          "सुप्रभात\nआज आप कैसे हैं\nमैं अच्छा महसूस कर रहा हूँ\nमैं स्कूल जा रहा हूँ\nआपका दिन शुभ हो"
      }
    ],

    daily: [
      {
        title:
          "Daily Talk",

        english:
          "Where are you going\nI am going to the market\nDo you need anything\nPlease buy some fruits\nOkay I will",

        hindi:
          "आप कहाँ जा रहे हैं\nमैं बाजार जा रहा हूँ\nक्या आपको कुछ चाहिए\nकृपया कुछ फल ले आना\nठीक है मैं लाऊँगा"
      },

      {
        title:
          "Friends Conversation",

        english:
          "Hello my friend\nWhat are you doing\nI am watching a movie\nThat sounds fun\nEnjoy your day",

        hindi:
          "हेलो मेरे दोस्त\nआप क्या कर रहे हैं\nमैं फिल्म देख रहा हूँ\nयह मजेदार लगता है\nअपने दिन का आनंद लें"
      }
    ],

    office: [
      {
        title:
          "Office Meeting",

        english:
          "The meeting will start now\nPlease open the report\nWe need better planning\nLet's complete the work today\nThank you everyone",

        hindi:
          "मीटिंग अब शुरू होगी\nकृपया रिपोर्ट खोलें\nहमें बेहतर योजना चाहिए\nआइए आज काम पूरा करें\nसभी का धन्यवाद"
      }
    ],

    business: [
      {
        title:
          "Business Discussion",

        english:
          "Let's discuss the project\nThe client needs updates\nWe should improve sales\nPlease send the details today\nThank you",

        hindi:
          "आइए प्रोजेक्ट पर चर्चा करें\nक्लाइंट को अपडेट चाहिए\nहमें बिक्री सुधारनी चाहिए\nकृपया आज विवरण भेजें\nधन्यवाद"
      }
    ],

    interview: [
      {
        title:
          "Interview Questions",

        english:
          "Please introduce yourself\nI am a hardworking person\nI enjoy learning new skills\nI can work in a team\nThank you for this opportunity",

        hindi:
          "कृपया अपना परिचय दें\nमैं मेहनती व्यक्ति हूँ\nमुझे नई चीजें सीखना पसंद है\nमैं टीम में काम कर सकता हूँ\nइस अवसर के लिए धन्यवाद"
      }
    ],

    pronunciation: [
      {
        title:
          "Pronunciation Practice",

        english:
          "Please speak slowly\nRepeat the sentence clearly\nFocus on every word\nPractice every day\nConfidence is important",

        hindi:
          "कृपया धीरे बोलें\nवाक्य को स्पष्ट बोलें\nहर शब्द पर ध्यान दें\nरोज अभ्यास करें\nआत्मविश्वास जरूरी है"
      }
    ],

    advanced: [
      {
        title:
          "Advanced Speaking",

        english:
          "Your presentation was impressive\nWe should improve communication\nLet's finalize the strategy\nTeamwork increases productivity\nThank you for your support",

        hindi:
          "आपकी प्रस्तुति प्रभावशाली थी\nहमें संचार सुधारना चाहिए\nआइए रणनीति तय करें\nटीमवर्क उत्पादकता बढ़ाता है\nआपके सहयोग के लिए धन्यवाद"
      }
    ]
  };

  const lessons =
    fallbackLessons[
      mode as keyof typeof fallbackLessons
    ] ||
    fallbackLessons.daily;

  const randomLesson =
    lessons[
      Math.floor(
        Math.random() *
          lessons.length
      )
    ];

  return {
    title:
      randomLesson.title,

    english:
      randomLesson.english,

    hindi:
      randomLesson.hindi,

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

    /*
    FALLBACK IF NO API KEY
    */
    if (!apiKey) {
      const fallback =
        generateFallbackLesson(
          mode
        );

      rememberLesson(
        mode,
        fallback.english
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
            parsed.english
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

    /*
    SMART FALLBACK
    */
    const fallback =
      generateFallbackLesson(
        mode
      );

    rememberLesson(
      mode,
      fallback.english
    );

    return fallback;
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
