import { buildSystemPrompt }
  from "@/server/ai/system-prompts";

import { buildConversationContext }
  from "@/server/ai/context-manager";

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
  conversationContext
}: {
  apiKey: string;

  model: string;

  systemPrompt: string;

  message: string;

  conversationContext: string;
}) {
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

        temperature: 0.7,

        top_p: 1,

        max_tokens: 140,

        messages: [
          {
            role: "system",

            content:
              systemPrompt
          },

          {
            role: "user",

            content: `
Conversation History:
${conversationContext}

Current User Message:
${message}

Instructions:
- Reply naturally.
- Keep conversation engaging.
- Help improve spoken English.
- Use short conversational replies.
- Ask follow-up questions when suitable.
`
          }
        ]
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
  );
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

    const conversationContext =
      buildConversationContext(
        history
      );

    try {
      return await makeRequest({
        apiKey,

        model:
          PRIMARY_MODEL,

        systemPrompt,

        message,

        conversationContext
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

        message,

        conversationContext
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
