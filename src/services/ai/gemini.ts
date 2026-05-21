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

export async function generateAIReply({
  message,
  conversationHistory = [],
  mode = "daily"
}: GenerateAIReplyParams): Promise<string> {
  try {
    const response =
      await fetch(
        CHAT_API_ROUTE,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            message:
              cleanAIText(
                message
              ),

            history:
              conversationHistory,

            mode
          })
        }
      );

    const data: ChatApiResponse =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to fetch AI response."
      );
    }

    if (
      !data.reply ||
      !data.reply.trim()
    ) {
      throw new Error(
        "Empty AI reply received."
      );
    }

    return cleanAIText(
      data.reply
    );
  } catch (error) {
    console.error(
      "Frontend AI Service Error:",
      error
    );

    return "I am here to help you practice English. Please continue speaking.";
  }
}
