const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
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

You help Indian users improve spoken English fluency.

Rules:
- Always reply in simple and natural English.
- Keep responses short and conversational.
- Encourage the learner confidently.
- Correct indirectly without sounding strict.
- Focus on professional, business, and daily English.
- Avoid complex grammar explanations unless asked.
- Never use markdown.
- Keep replies under 80 words.
`;

function buildConversationPrompt(
  message: string,
  history?: {
    role: "user" | "ai";
    text: string;
  }[]
) {
  const formattedHistory =
    history?.map((item) => {
      const role =
        item.role === "user"
          ? "User"
          : "AI";

      return `${role}: ${item.text}`;
    }) || [];

  return `
${SYSTEM_PROMPT}

Conversation:
${formattedHistory.join("\n")}

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
    if (!apiKey) {
      throw new Error(
        "Gemini API key is missing."
      );
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
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],

          generationConfig: {
            temperature: 0.8,
            topK: 32,
            topP: 1,
            maxOutputTokens: 120
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch AI response."
      );
    }

    const data: GeminiResponse =
      await response.json();

    const reply =
      data?.candidates?.[0]?.content
        ?.parts?.[0]?.text;

    if (!reply) {
      return "I am here to help you practice English. Please try again.";
    }

    return reply.trim();
  } catch (error) {
    console.error(
      "Gemini AI Error:",
      error
    );

    return "Sorry, I could not respond right now. Please try again.";
  }
}
