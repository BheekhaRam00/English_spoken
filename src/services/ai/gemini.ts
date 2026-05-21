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
    code?: number;
    message?: string;
    status?: string;
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
- Speak naturally.
- Keep replies short.
- Sound human and friendly.
- Ask follow-up questions naturally.
- Avoid robotic responses.
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

Conversation:
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

      return "DEBUG: Gemini API key missing.";
    }

    const prompt =
      buildConversationPrompt(
        message,
        conversationHistory
      );

    console.log(
      "Gemini Request Started"
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
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {
            temperature: 0.85,
            topP: 1,
            topK: 32,
            maxOutputTokens: 100
          }
        })
      }
    );

    console.log(
      "Gemini HTTP Status:",
      response.status
    );

    const rawText =
      await response.text();

    console.log(
      "Gemini Raw Response:",
      rawText
    );

    let data: GeminiResponse;

    try {
      data =
        JSON.parse(rawText);
    } catch (jsonError) {
      console.error(
        "Gemini JSON Parse Error:",
        jsonError
      );

      return `DEBUG: Invalid JSON response: ${rawText}`;
    }

    if (!response.ok) {
      console.error(
        "Gemini API Error:",
        data
      );

      return `DEBUG API ERROR:
Status: ${response.status}

Message:
${
  data?.error?.message ||
  "Unknown Gemini API error"
}`;
    }

    const reply =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (
      !reply ||
      !reply.trim()
    ) {
      console.error(
        "Gemini Empty Reply:",
        data
      );

      return `DEBUG: Empty AI reply received.
Raw Response:
${rawText}`;
    }

    return reply
      .replace(/\*/g, "")
      .replace(/\n+/g, " ")
      .trim();
  } catch (error) {
    console.error(
      "Gemini Fatal Error:",
      error
    );

    if (
      error instanceof Error
    ) {
      return `DEBUG FATAL ERROR:
${error.message}`;
    }

    return "DEBUG: Unknown fatal error.";
  }
}
