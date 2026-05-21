import { callOpenRouter }
  from "@/server/ai/providers/openrouter";

import { callDeepSeek }
  from "@/server/ai/providers/deepseek";

import { callMockProvider }
  from "@/server/ai/providers/mock";

import { validateAIResponse }
  from "@/server/ai/response-validator";

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
        );

      if (
        validateAIResponse(
          cleanedReply
        )
      ) {
        return cleanedReply;
      }
    } catch (error) {
      logError(
        "OpenRouter Provider Failed",
        error
      );
    }

    try {
      const deepSeekReply =
        await callDeepSeek({
          apiKey,

          message,

          history,

          mode
        });

      const cleanedReply =
        cleanAIText(
          deepSeekReply
        );

      if (
        validateAIResponse(
          cleanedReply
        )
      ) {
        return cleanedReply;
      }
    } catch (error) {
      logError(
        "DeepSeek Provider Failed",
        error
      );
    }

    return callMockProvider({
      message,

      mode
    });
  } catch (error) {
    logError(
      "Provider Manager Fatal Error",
      error
    );

    return callMockProvider({
      message,

      mode
    });
  }
}
