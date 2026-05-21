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

You are a highly natural spoken English conversation trainer for Indian users.

Your job is NOT to act like an AI assistant.
Your job is to behave like a real human English-speaking conversation partner and trainer.

Core behavior:
- Sound natural and emotionally aware.
- Speak like modern real-world English conversations.
- Keep replies conversational and realistic.
- Avoid robotic AI-style responses.
- Never sound repetitive.
- Never repeat the same follow-up question.
- Keep conversation flowing naturally.
- Encourage confidence naturally.
- Sometimes ask questions.
- Sometimes react casually.
- Sometimes teach naturally through examples.

English coaching behavior:
- Softly improve grammar indirectly.
- Do NOT over-correct.
- Keep users comfortable and confident.
- If user writes broken English, respond with correct natural English naturally inside your reply.
- Help users learn spoken English patterns.

Conversation behavior:
- Understand topic context deeply.
- Avoid generic replies.
- Avoid asking unrelated questions.
- Reply according to current topic.
- Continue the flow naturally.

Response style:
- Short replies preferred.
- Normally under 45 words.
- Maximum 70 words.
- No markdown.
- No bullet points.
- No emojis unless user uses them first.
- Sound warm, smart, and human.

Examples:

User: i go market yesterday
AI: Oh nice, you went to the market yesterday. What did you buy there?

User: i want improve english
AI: That's great. Your English will improve faster if you speak daily. What topics do you enjoy talking about?

User: let's practice office english
AI: Sure. Let's practice professional English. Imagine you are speaking in a meeting. How would you introduce yourself?
`;

function normalizeText(text: string) {
  return text
    .replace(/\*/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildMessages(
  message: string,
  history?: {
    role: "user" | "ai";
    text: string;
  }[]
) {
  const cleanedHistory =
    history
      ?.slice(-14)
      .map((item) => ({
        role:
          item.role === "user"
            ? "user"
            : "assistant",

        content: normalizeText(
          item.text
        )
      })) || [];

  return [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },

    ...cleanedHistory,

    {
      role: "user",
      content: normalizeText(
        message
      )
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
    }, 25000);

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

          temperature: 0.95,

          top_p: 0.9,

          frequency_penalty: 0.7,

          presence_penalty: 0.6,

          max_tokens: 140
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

    return normalizeText(
      reply
    );
  } finally {
    clearTimeout(timeout);
  }
}

function detectConversationIntent(
  message: string
) {
  const lower =
    message.toLowerCase();

  if (
    lower.includes("daily")
  ) {
    return "daily";
  }

  if (
    lower.includes("office") ||
    lower.includes("meeting") ||
    lower.includes("boss") ||
    lower.includes("client")
  ) {
    return "office";
  }

  if (
    lower.includes("interview")
  ) {
    return "interview";
  }

  if (
    lower.includes("sentence")
  ) {
    return "sentence-practice";
  }

  if (
    lower.includes("grammar")
  ) {
    return "grammar";
  }

  return "general";
}

function generateSmartOfflineReply(
  message: string
) {
  const lower =
    message.toLowerCase();

  const intent =
    detectConversationIntent(
      lower
    );

  if (
    intent ===
    "sentence-practice"
  ) {
    return "Sure. Let's practice daily English sentences. For example: 'What are you doing?' or 'I am going to work.' Now tell me one sentence you use every day.";
  }

  if (
    intent === "office"
  ) {
    return "Okay, let's practice office English. Imagine you are speaking with your manager. What would you say?";
  }

  if (
    intent === "interview"
  ) {
    return "Great. Let's practice interview English. Please introduce yourself professionally.";
  }

  if (
    lower.includes("hello") ||
    lower.includes("hi")
  ) {
    return "Hello! How has your day been so far?";
  }

  if (
    lower.includes("weekend")
  ) {
    return "Weekends are always refreshing. What do you usually enjoy doing?";
  }

  if (
    lower.includes("english")
  ) {
    return "Your English is improving nicely. The more you speak, the more natural it becomes.";
  }

  if (
    lower.includes("job") ||
    lower.includes("work")
  ) {
    return "That sounds interesting. What kind of work do you usually handle?";
  }

  const smartReplies = [
    "That sounds interesting. Tell me a little more.",

    "I understand. What happened after that?",

    "Oh nice. How did you feel in that situation?",

    "That's good. Can you explain it a little differently in English?",

    "Interesting. What do you usually do next?",

    "I see. How would you describe that experience in simple English?"
  ];

  return smartReplies[
    Math.floor(
      Math.random() *
        smartReplies.length
    )
  ];
}

export async function generateAIReply({
  message,
  apiKey,
  conversationHistory = []
}: GenerateAIReplyParams): Promise<string> {
  try {
    if (!apiKey?.trim()) {
      return generateSmartOfflineReply(
        message
      );
    }

    const messages =
      buildMessages(
        message,
        conversationHistory
      );

    const models = [
      "deepseek/deepseek-chat-v3-0324:free",

      "openchat/openchat-7b:free",

      "mistralai/mistral-7b-instruct:free"
    ];

    for (const model of models) {
      try {
        const reply =
          await requestModel({
            apiKey,
            model,
            messages
          });

        if (
          reply &&
          reply.length > 2
        ) {
          return reply;
        }
      } catch (error) {
        console.error(
          `${model} failed:`,
          error
        );
      }
    }

    return generateSmartOfflineReply(
      message
    );
  } catch (error) {
    console.error(
      "OpenRouter Fatal Error:",
      error
    );

    return generateSmartOfflineReply(
      message
    );
  }
}
