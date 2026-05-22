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
      | "beginner"
      | "daily"
      | "office"
      | "business"
      | "interview"
      | "pronunciation"
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
  DEBUG
  */
  console.log(
    "REQUEST AI MODE:",
    mode
  );

  console.log(
    "REQUEST AI MESSAGE:",
    cleanedMessage
  );

  /*
  OPENROUTER
  */
  try {
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

    if (
      !cleanedReply ||
      cleanedReply.length <
        2
    ) {
      throw new Error(
        "Empty AI response."
      );
    }

    console.log(
      "OPENROUTER SUCCESS"
    );

    logInfo(
      "AI response generated successfully."
    );

    return cleanedReply;
  } catch (error: any) {
    /*
    IMPORTANT DEBUG
    */
    console.log(
      "OPENROUTER FAILED:"
    );

    console.log(error);

    logError(
      "OpenRouter Provider Failed",
      error
    );
  }

  /*
  FALLBACK
  */
  console.log(
    "USING MOCK PROVIDER FALLBACK"
  );

  const fallbackReply =
    await callMockProvider({
      message:
        cleanedMessage,

      mode:
        mode ===
          "business" ||
        mode ===
          "interview" ||
        mode ===
          "advanced"
          ? mode
          : "daily"
    });

  return normalizeReply(
    fallbackReply
  );
}
