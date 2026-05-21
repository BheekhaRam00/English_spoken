const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";

type OpenRouterResponse = {
  choices?: {
    message?: {
      content?: string;
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
- Speak naturally like a real human conversation partner.
- Sound friendly, confident, and supportive.
- Keep replies short and conversational.
- Ask natural follow-up questions.
- Avoid robotic replies.
- Never repeat the same sentence.
- Never use markdown.
- Keep replies under 50 words.
`;

function buildMessages(
  message: string,
  history?: {
    role: "user" | "ai";
    text: string;
  }[]
) {
  const formattedHistory =
    history
      ?.slice(-10)
      .map((item) => ({
        role:
          item.role === "user"
            ? "user"
            : "assistant",

        content: item.text
      })) || [];

  return [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },

    ...formattedHistory,

    {
      role: "user",
      content: message
    }
  ];
}

async function requestModel({
  apiKey,
  model,
  messages
}: {
  apiKey: string;

  model: string;

  messages: {
    role: string;
    content: string;
  }[];
}) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 20000);

  try {
    const response = await fetch(
      OPENROUTER_API_URL,
      {
        method: "POST",

        signal:
          controller.signal,

        headers: {
          Authorization: `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",

          "HTTP-Referer":
            "https://fluentpro-ai.vercel.app",

          "X-Title":
            "FluentPro AI"
        },

        body: JSON.stringify({
          model,

          messages,

          temperature: 0.9,

          max_tokens: 120
        })
      }
    );

    const data: OpenRouterResponse =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error?.message ||
          `HTTP ${response.status}`
      );
    }

    const reply =
      data?.choices?.[0]
        ?.message?.content;

    if (
      !reply ||
      !reply.trim()
    ) {
      throw new Error(
        "Empty AI reply"
      );
    }

    return reply
      .replace(/\*/g, "")
      .replace(/\n+/g, " ")
      .trim();
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAIReply({
  message,
  apiKey,
  conversationHistory = []
}: GenerateAIReplyParams): Promise<string> {
  try {
    if (!apiKey?.trim()) {
      return "AI setup is incomplete.";
    }

    const messages =
      buildMessages(
        message,
        conversationHistory
      );

    try {
      return await requestModel({
        apiKey,

        model:
          "deepseek/deepseek-chat-v3-0324:free",

        messages
      });
    } catch (deepseekError) {
      console.error(
        "DeepSeek failed:",
        deepseekError
      );
    }

    try {
      return await requestModel({
        apiKey,

        model:
          "mistralai/mistral-7b-instruct:free",

        messages
      });
    } catch (mistralError) {
      console.error(
        "Mistral failed:",
        mistralError
      );
    }

    return generateOfflineReply(
      message
    );
  } catch (error) {
    console.error(
      "OpenRouter Fatal Error:",
      error
    );

    return generateOfflineReply(
      message
    );
  }
}

function generateOfflineReply(
  message: string
) {
  const lower =
    message.toLowerCase();

  if (
    lower.includes("job") ||
    lower.includes("work")
  ) {
    return "That sounds interesting. What kind of work do you do every day?";
  }

  if (
    lower.includes("weekend")
  ) {
    return "Nice. How do you usually relax during weekends?";
  }

  if (
    lower.includes("english")
  ) {
    return "Your English is improving well. Keep speaking confidently.";
  }

  if (
    lower.includes("meeting")
  ) {
    return "Professional speaking becomes easier with regular practice.";
  }

  const replies = [
    "That's interesting. Tell me more.",

    "I understand. What happened next?",

    "That sounds good. How do you feel about it?",

    "Nice. Can you explain a little more?",

    "Very good. What do you usually do in that situation?"
  ];

  return replies[
    Math.floor(
      Math.random() *
        replies.length
    )
  ];
}
