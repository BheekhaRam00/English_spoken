import {
  callOpenRouter
} from "@/server/ai/providers/openrouter";

import {
  callMockProvider
} from "@/server/ai/providers/mock";

import {
  cleanAIText
} from "@/server/utils/text";

import {
  logError,
  logInfo
} from "@/server/utils/logger";

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

function normalizeReply(
  text: string
) {
  return cleanAIText(
    text
  )
    .replace(
      /\n{3,}/g,
      "\n\n"
    )
    .trim();
}

export async function requestAICompletion({
  message,
  history,
  mode,
  apiKey
}: RequestAICompletionParams) {
  try {
    /*
    OPENROUTER AI
    */
    const openRouterReply =
      await callOpenRouter({
        apiKey,

        message,

        history,

        mode
      });

    const cleanedReply =
      normalizeReply(
        openRouterReply
      );

    /*
    EMPTY CHECK
    */
    if (
      !cleanedReply ||
      cleanedReply.length <
        2
    ) {
      throw new Error(
        "Empty AI response."
      );
    }

    logInfo(
      `AI response generated successfully.`
    );

    return cleanedReply;
  } catch (error) {
    /*
    AI FAILED
    */
    logError(
      "OpenRouter Provider Failed",
      error
    );

    /*
    FALLBACK
    */
    const fallbackReply =
      callMockProvider({
        message,

        mode
      });

    return normalizeReply(
      fallbackReply
    );
  }
}
