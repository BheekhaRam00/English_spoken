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
    code?: number;
  };
};

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

/*
ONLY RELATIVELY STABLE MODELS
DO NOT KEEP ROTATING MODELS
*/
const MODELS = [
  "deepseek/deepseek-chat-v3-0324:free",

  "meta-llama/llama-3.1-8b-instruct:free"
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
    }, 12000);

  try {
    const messages = [
      {
        role: "system",

        content: `
${systemPrompt}

IMPORTANT RULES:
- Speak naturally like a real human.
- Use conversational spoken English.
- Maximum 3 short sentences.
- Keep replies engaging.
- Avoid robotic wording.
- Avoid repeating the same structure.
- Ask small follow-up questions sometimes.
- No markdown.
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

            temperature: 0.85,

            top_p: 0.92,

            frequency_penalty: 0.35,

            presence_penalty: 0.3,

            max_tokens: 140
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

    /*
    IMPORTANT:
    DO NOT OVER-CLEAN AI TEXT
    OTHERWISE NATURAL SPEECH BREAKS
    */
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
