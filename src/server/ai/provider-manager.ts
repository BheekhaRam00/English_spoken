import { callOpenRouter }
  from "@/server/ai/providers/openrouter";

import { callMockProvider }
  from "@/server/ai/providers/mock";

import { cleanAIText }
  from "@/server/utils/text";

import { logError }
  from "@/server/utils/logger";

type RequestAICompletionParams =
  {
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

    apiKey: string;
  };

export async function requestAICompletion({
  message,
  history,
  mode,
  apiKey
}: RequestAICompletionParams) {
  try {
    const openRouterReply =
      await callOpenRouter({
        apiKey,

        message,

        history,

        mode
      });

    const cleanedReply =
      cleanAIText(
        openRouterReply
      )
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (!cleanedReply) {
      throw new Error(
        "Empty AI response."
      );
    }

    return cleanedReply;
  } catch (error) {
    logError(
      "OpenRouter Provider Failed",
      error
    );

    return callMockProvider({
      message,

      mode
    });
  }
}
