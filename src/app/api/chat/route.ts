import { NextRequest } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

type ChatMessage = {
  role: "user" | "ai";

  text: string;
};

type RequestBody = {
  message: string;

  history?: ChatMessage[];

  mode?:
    | "daily"
    | "business"
    | "interview"
    | "advanced";

  voiceType?:
    | "female"
    | "male"
    | "professional";
};

function buildPrompt(
  message: string,
  history: ChatMessage[] = [],
  mode = "daily"
) {
  return `
You are FluentPro AI.

You help Indian users improve spoken English fluency.

Mode:
${mode}

Rules:
- Speak natural English.
- Keep replies conversational.
- Encourage confidence.
- Help improve spoken English.
- Use short responses.
- Avoid markdown.
- Keep response under 80 words.

Conversation:
${history
  .map((item) => {
    const role =
      item.role === "user"
        ? "User"
        : "AI";

    return `${role}: ${item.text}`;
  })
  .join("\n")}

User: ${message}

AI:
`;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body: RequestBody =
      await request.json();

    const {
      message,
      history = [],
      mode = "daily"
    } = body;

    if (!message?.trim()) {
      return Response.json(
        {
          success: false,

          error:
            "Message is required."
        },
        {
          status: 400
        }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,

          error:
            "Gemini API key is missing."
        },
        {
          status: 500
        }
      );
    }

    const prompt =
      buildPrompt(
        message,
        history,
        mode
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
      return Response.json(
        {
          success: false,

          error:
            "Failed to generate AI response."
        },
        {
          status: 500
        }
      );
    }

    const data =
      await response.json();

    const aiText =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

    if (!aiText) {
      return Response.json(
        {
          success: false,

          error:
            "Empty AI response."
        },
        {
          status: 500
        }
      );
    }

    return Response.json({
      success: true,

      message: aiText
        .replace(/\*/g, "")
        .replace(/\n+/g, " ")
        .trim()
    });
  } catch (error) {
    console.error(
      "Chat API error:",
      error
    );

    return Response.json(
      {
        success: false,

        error:
          "Something went wrong."
      },
      {
        status: 500
      }
    );
  }
}
