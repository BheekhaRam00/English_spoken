import { cleanAIText }
  from "@/server/utils/text";

type ConversationMessage = {
  role: "user" | "ai";

  text: string;
};

export type GenerateAIReplyParams =
  {
    message: string;

    conversationHistory?: ConversationMessage[];

    mode?:
      | "daily"
      | "business"
      | "interview"
      | "advanced";
  };

type ChatApiResponse = {
  success: boolean;

  reply?: string;

  source?: string;

  message?: string;
};

const CHAT_API_ROUTE =
  "/api/chat";

function normalizeReply(
  text: string
) {
  return cleanAIText(
    text
  )
    .replace(
      /\s+/g,
      " "
    )
    .replace(
      /\n{2,}/g,
      "\n"
    )
    .trim();
}

export async function generateAIReply({
  message,
  conversationHistory = [],
  mode = "daily"
}: GenerateAIReplyParams): Promise<string> {
  try {
    const cleanedMessage =
      normalizeReply(
        message
      );

    if (
      !cleanedMessage
    ) {
      return "Please say something.";
    }

    const cleanedHistory =
      conversationHistory
        .slice(-10)
        .map(
          (item) => ({
            role:
              item.role,

            text:
              normalizeReply(
                item.text
              )
          })
        );

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => {
          controller.abort();
        },
        15000
      );

    const response =
      await fetch(
        CHAT_API_ROUTE,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          cache:
            "no-store",

          signal:
            controller.signal,

          body: JSON.stringify({
            message:
              cleanedMessage,

            history:
              cleanedHistory,

            mode
          })
        }
      );

    clearTimeout(
      timeout
    );

    const data: ChatApiResponse =
      await response.json();

    if (
      !response.ok
    ) {
      throw new Error(
        data?.message ||
          "Failed to fetch AI response."
      );
    }

    const reply =
      normalizeReply(
        data?.reply || ""
      );

    if (!reply) {
      throw new Error(
        "Empty AI reply received."
      );
    }

    return reply;
  } catch (error) {
    console.error(
      "Frontend AI Service Error:",
      error
    );

    if (
      error instanceof Error &&
      error.name ===
        "AbortError"
    ) {
      return "Sorry, the response took too long. Please try again.";
    }

    return "I am here to help you practice English. Please continue speaking.";
  }
}
