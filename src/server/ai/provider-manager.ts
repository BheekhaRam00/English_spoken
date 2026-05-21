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
    .replace(
      /\s{2,}/g,
      " "
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
    CLEAN INPUT
    */
    const cleanedMessage =
      cleanAIText(
        message
      ).trim();

    if (
      !cleanedMessage
    ) {
      throw new Error(
        "Empty message."
      );
    }

    /*
    OPENROUTER AI
    */
    const openRouterReply =
      await callOpenRouter({
        apiKey,

        message:
          cleanedMessage,

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
      "AI response generated successfully."
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
      await callMockProvider({
        message,

        mode
      });

    return normalizeReply(
      fallbackReply
    );
  }
}
