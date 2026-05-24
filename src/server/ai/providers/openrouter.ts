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
HYBRID STABLE MODELS
FIRST 2 = MOST STABLE
*/
const MODELS = [
  "openai/gpt-oss-20b:free",

  "qwen/qwen3-32b:free",

  "mistralai/mistral-small-3.1-24b-instruct:free",

  "google/gemma-2-9b-it:free",

  "microsoft/phi-3-mini-128k-instruct:free"
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
    }, 25000);

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

            temperature: 0.7,

            top_p: 0.9,

            max_tokens: 160
          })
        }
      );

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
    } catch {
      throw new Error(
        `Invalid JSON response from ${model}`
      );
    }

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

  /*
  PARALLEL PRIMARY REQUESTS
  */
  const primaryModels =
    MODELS.slice(0, 2);

  try {
    const parallelResult =
      await Promise.any(
        primaryModels.map(
          (model) =>
            makeRequest({
              apiKey,

              model,

              systemPrompt,

              message,

              history
            })
        )
      );

    if (
      parallelResult &&
      parallelResult.trim()
    ) {
      return parallelResult;
    }
  } catch (parallelError) {
    console.log(
      "PARALLEL MODELS FAILED",
      parallelError
    );
  }

  /*
SEQUENTIAL BACKUP MODELS
ONLY UNUSED MODELS
*/
let lastError:
  unknown = null;

const backupModels =
  MODELS.slice(2);

for (const model of backupModels) {
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
    `All AI providers failed: ${String(
      lastError
    )}`
  );
}
