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
FAST + STABLE MODELS
*/
const PRIMARY_MODEL =
  "mistralai/mistral-7b-instruct:free";

const FALLBACK_MODEL =
  "openchat/openchat-7b:free";

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
      content: `
${systemPrompt}

VERY IMPORTANT RULES:
- Keep replies SHORT.
- Maximum 3 short sentences.
- Use simple spoken English.
- Do NOT generate paragraphs.
- Do NOT generate stories.
- Keep dialogue format clean.
- One sentence per line.
- Sound natural and human.
`
    },

    ...history.slice(-6).map(
      (item) => ({
        role:
          item.role === "ai"
            ? "assistant"
            : "user",

        content: item.text
      })
    ),

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
        Authorization:
          `Bearer ${apiKey}`,

        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        model,

        messages,

        temperature: 0.4,

        max_tokens: 80,

        top_p: 0.9
      })
    }
  );

  const data: OpenRouterResponse =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      `Model failed: ${model}`
    );
  }

  const aiReply =
    data?.choices?.[0]
      ?.message?.content;

  if (!aiReply) {
    throw new Error(
      "Empty AI response"
    );
  }

  return cleanAIText(
    aiReply
  ).trim();
}

export async function callOpenRouter({
  apiKey,
  message,
  history,
  mode
}: OpenRouterParams) {
  try {
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
        message,
        history
      });
    } catch (primaryError) {
      logError(
        "Primary model failed",
        primaryError
      );

      return await makeRequest({
        apiKey,
        model:
          FALLBACK_MODEL,
        systemPrompt,
        message,
        history
      });
    }
  } catch (error) {
    logError(
      "OpenRouter Error",
      error
    );

    throw error;
  }
}
