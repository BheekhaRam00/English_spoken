import { buildSystemPrompt }
  from "@/server/ai/system-prompts";

import { cleanAIText }
  from "@/server/utils/text";

import { logError }
  from "@/server/utils/logger";

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

type OpenRouterResponse =
  {
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

const PRIMARY_MODEL =
  "google/gemma-2-9b-it:free";

const FALLBACK_MODEL =
  "meta-llama/llama-3.2-3b-instruct:free";

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
  const messages = [
    {
      role: "system",

      content:
        systemPrompt
    },

    ...history
      .slice(-12)
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

  const response = await fetch(
    OPENROUTER_URL,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,

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

        temperature: 0.45,

        top_p: 0.9,

        frequency_penalty: 0.3,

        presence_penalty: 0.2,

        max_tokens: 120
      })
    }
  );

  const data: OpenRouterResponse =
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

  return cleanAIText(
    aiReply
  )
    .replace(/\n+/g, " ")
    .trim();
}

export async function callOpenRouter({
  apiKey,
  message,
  history,
  mode
}: OpenRouterParams) {
  try {
    const cleanedMessage =
      cleanAIText(
        message
      ).trim();

    if (!cleanedMessage) {
      throw new Error(
        "Message is empty."
      );
    }

    const systemPrompt =
      buildSystemPrompt(
        mode
      );

    try {
      return await makeRequest({
        apiKey,

        model:
          PRIMARY_MODEL,

        systemPrompt,

        message:
          cleanedMessage,

        history
      });
    } catch (
      primaryError
    ) {
      logError(
        "Primary OpenRouter Model Failed",
        primaryError
      );

      return await makeRequest({
        apiKey,

        model:
          FALLBACK_MODEL,

        systemPrompt,

        message:
          cleanedMessage,

        history
      });
    }
  } catch (error) {
    logError(
      "OpenRouter Provider Error",
      error
    );

    throw error;
  }
}
