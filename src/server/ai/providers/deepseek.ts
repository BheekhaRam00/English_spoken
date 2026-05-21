import { buildSystemPrompt }
  from "@/server/ai/system-prompts";

import { buildConversationContext }
  from "@/server/ai/context-manager";

import { cleanAIText }
  from "@/server/utils/text";

import { logError }
  from "@/server/utils/logger";

type DeepSeekParams = {
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

type DeepSeekResponse = {
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

export async function callDeepSeek({
  apiKey,
  message,
  history,
  mode
}: DeepSeekParams) {
  try {
    const systemPrompt =
      buildSystemPrompt(
        mode
      );

    const conversationContext =
      buildConversationContext(
        history
      );

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
          model:
            "deepseek/deepseek-r1-0528:free",

          temperature: 0.85,

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
`
            }
          ]
        })
      }
    );

    const data: DeepSeekResponse =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error
          ?.message ||
          "DeepSeek request failed."
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
        "DeepSeek returned empty response."
      );
    }

    return cleanAIText(
      aiReply
    );
  } catch (error) {
    logError(
      "DeepSeek Provider Error",
      error
    );

    throw error;
  }
}
