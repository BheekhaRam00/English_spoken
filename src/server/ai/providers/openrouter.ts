import {
  buildSystemPrompt
} from "@/server/ai/system-prompts";

import {
  cleanAIText
} from "@/server/utils/text";

import {
  logError,
  logInfo
} from "@/server/utils/logger";

type OpenRouterParams = {
  apiKey: string;

  message: string;

  history: {
    role: "user" | "ai";

    text: string;
  }[];

  mode:
    | "beginner"
    | "daily"
    | "office"
    | "business"
    | "interview"
    | "pronunciation"
    | "advanced";
};

type OpenRouterResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];

  error?: {
    message?: string;
    code?: number;
  };
};

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

/*
STABLE FREE MODELS
*/
const MODELS = [
  "openai/gpt-oss-20b:free",

  "deepseek/deepseek-chat-v3-0324:free"
];

function normalizeAIReply(
  text: string
) {
  return text
    .replace(/\r/g, "")
    .replace(
      /\n{3,}/g,
      "\n\n"
    )
    .replace(
      /[ \t]{2,}/g,
      " "
    )
    .trim();
}

async function makeRequest({
  apiKey,
  model,
  systemPrompt,
  message,
  history
}: {
  apiKey: string;

  model: string;

  systemPrompt: string;

  message: string;

  history: {
    role: "user" | "ai";

    text: string;
  }[];
}) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 8000);

  try {
    const messages = [
      {
        role: "system",

        content: `
${systemPrompt}

IMPORTANT RULES:
- Speak naturally.
- Use conversational English.
- Maximum 3 short sentences.
- No markdown.
- No bullet points.
`
      },

      ...history
        .slice(-6)
        .map((item) => ({
          role:
            item.role === "ai"
              ? "assistant"
              : "user",

          content:
            item.text
        })),

      {
        role: "user",

        content:
          cleanAIText(
            message
          )
      }
    ];

    console.log(
      "OPENROUTER MODEL:",
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

            messages,

            temperature: 0.8,

            max_tokens: 150
          })
        }
      );

    console.log(
      "OPENROUTER STATUS:",
      response.status
    );

    /*
    RAW RESPONSE FIRST
    */
    const rawText =
      await response.text();

    console.log(
      "OPENROUTER RAW:",
      rawText
    );

    let data:
      OpenRouterResponse;

    try {
      data =
        JSON.parse(
          rawText
        );
    } catch (
      parseError
    ) {
      throw new Error(
        "Invalid JSON response from OpenRouter"
      );
    }

    console.log(
      "OPENROUTER DATA:",
      JSON.stringify(data)
    );

    if (!response.ok) {
      throw new Error(
        data?.error
          ?.message ||
          `Model failed: ${model}`
      );
    }

    const aiReply =
      data?.choices?.[0]
        ?.message?.content;

    if (
      !aiReply ||
      typeof aiReply !==
        "string"
    ) {
      throw new Error(
        `Empty response from ${model}`
      );
    }

    logInfo(
      `OpenRouter success: ${model}`
    );

    return normalizeAIReply(
      aiReply
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function callOpenRouter({
  apiKey,
  message,
  history,
  mode
}: OpenRouterParams) {
  const systemPrompt =
    buildSystemPrompt(
      mode
    );

  let lastError:
    unknown = null;

  for (const model of MODELS) {
    try {
      const response =
        await makeRequest({
          apiKey,

          model,

          systemPrompt,

          message,

          history
        });

      if (
        response &&
        response.trim()
      ) {
        return response;
      }
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

  logError(
    "All OpenRouter Models Failed",
    lastError
  );

  throw new Error(
    "All AI providers failed."
  );
}
