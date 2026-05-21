const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];

  error?: {
    message?: string;
  };
};

export type GenerateAIReplyParams = {
  message: string;

  apiKey: string;

  conversationHistory?: {
    role: "user" | "ai";
    text: string;
  }[];
};

const SYSTEM_PROMPT = `
You are FluentPro AI.

You help Indian users improve spoken English fluency naturally.

Rules:
- Speak in very natural conversational English.
- Keep replies short and realistic.
- Reply like a friendly Indian English trainer.
- Ask follow-up questions naturally.
- Avoid robotic replies.
- Never repeat the same sentence.
- Never use markdown.
- Keep replies under 60 words.
`;

function buildConversationPrompt(
  message: string,
  history?: {
    role: "user" | "ai";
    text: string;
  }[]
) {
  const formattedHistory =
    history
      ?.slice(-10)
      .map((item) => {
        const role =
          item.role === "user"
            ? "User"
            : "AI";

        return `${role}: ${item.text}`;
      })
      .join("\n") || "";

  return `
${SYSTEM_PROMPT}

Previous Conversation:
${formattedHistory}

User: ${message}

AI:
`;
}

export async function generateAIReply({
  message,
  apiKey,
  conversationHistory = []
}: GenerateAIReplyParams): Promise<string> {
  try {
    if (!apiKey?.trim()) {
      console.error(
        "Gemini API key missing"
      );

      return "AI setup is incomplete. Please add Gemini API key.";
    }

    const prompt =
      buildConversationPrompt(
        message,
        conversationHistory
      );

    const response = await fetch(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",

              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {
            temperature: 0.9,
            topP: 1,
            topK: 40,
            maxOutputTokens: 120
          },

          safetySettings: [
            {
              category:
                "HARM_CATEGORY_HARASSMENT",
              threshold:
                "BLOCK_NONE"
            },

            {
              category:
                "HARM_CATEGORY_HATE_SPEECH",
              threshold:
                "BLOCK_NONE"
            },

            {
              category:
                "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold:
                "BLOCK_NONE"
            },

            {
              category:
                "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold:
                "BLOCK_NONE"
            }
          ]
        })
      }
    );

    const data: GeminiResponse =
      await response.json();

    console.log(
      "Gemini Response:",
      data
    );

    if (!response.ok) {
      console.error(
        "Gemini API Error:",
        data?.error?.message
      );

      return "AI server error. Please try again.";
    }

    const reply =
      data?.candidates?.[0]?.content
        ?.parts?.[0]?.text;

    if (
      !reply ||
      reply.trim().length === 0
    ) {
      return "Can you tell me more about that?";
    }

    return reply
      .replace(/\*/g, "")
      .replace(/\n+/g, " ")
      .trim();
  } catch (error) {
    console.error(
      "Gemini AI Fatal Error:",
      error
    );

    return "Connection issue. Please try again.";
  }
}
