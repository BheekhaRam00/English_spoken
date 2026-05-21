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
    | "daily"
    | "business"
    | "interview"
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
  };
};

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

/*
WORKING STABLE FREE MODELS
*/
const MODELS = [
  "deepseek/deepseek-chat-v3-0324:free",

  "meta-llama/llama-3.3-8b-instruct:free",

  "microsoft/phi-3-mini-128k-instruct:free"
];

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
    }, 12000);

  try {
    const messages = [
      {
        role: "system",

        content: `
${systemPrompt}

IMPORTANT RULES:
- Reply naturally.
- Use spoken English.
- Maximum 3 short sentences.
- No paragraph.
- No markdown.
- One sentence per line.
- Keep conversation engaging.
- Ask small follow-up questions sometimes.
`
      },

      ...history
        .slice(-8)
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

        content: message
      }
    ];

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

            frequency_penalty: 0.2,

            presence_penalty: 0.2,

            max_tokens: 120
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

    const aiReply =
      data?.choices?.[0]
        ?.message?.content;

    if (
      !aiReply ||
      !aiReply.trim()
    ) {
      throw new Error(
        `Empty response from ${model}`
      );
    }

    logInfo(
      `OpenRouter success: ${model}`
    );

    return cleanAIText(
      aiReply
    ).trim();
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
      return await makeRequest({
        apiKey,

        model,

        systemPrompt,

        message,

        history
      });
    } catch (error) {
      lastError = error;

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
