import {
  ConversationMessage,
  VoiceType
} from "@/types";

export function formatTime(
  date: Date | string
) {
  const target =
    typeof date === "string"
      ? new Date(date)
      : date;

  return target.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

export function generateId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

export function truncateText(
  text: string,
  length = 120
) {
  if (text.length <= length) {
    return text;
  }

  return `${text.slice(
    0,
    length
  )}...`;
}

export function capitalize(
  text: string
) {
  if (!text.length) {
    return "";
  }

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
}

export function normalizeText(
  text: string
) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function calculateProgress(
  completed: number,
  total: number
) {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (completed / total) * 100
    )
  );
}

export function getRandomItem<T>(
  items: T[]
) {
  return items[
    Math.floor(
      Math.random() *
        items.length
    )
  ];
}

export function shuffleArray<T>(
  array: T[]
) {
  const copied = [...array];

  for (
    let i = copied.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [copied[i], copied[j]] = [
      copied[j],
      copied[i]
    ];
  }

  return copied;
}

export function sleep(
  milliseconds: number
) {
  return new Promise((resolve) => {
    setTimeout(
      resolve,
      milliseconds
    );
  });
}

export function getGreeting() {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 18) {
    return "Good Afternoon";
  }

  return "Good Evening";
}

export function getVoiceLabel(
  voice: VoiceType
) {
  switch (voice) {
    case "female":
      return "Female Voice";

    case "male":
      return "Male Voice";

    case "professional":
      return "Professional Voice";

    default:
      return "AI Voice";
  }
}

export function estimateReadingTime(
  text: string
) {
  const words =
    text.split(" ").length;

  const wordsPerMinute = 180;

  return Math.max(
    1,
    Math.ceil(
      words / wordsPerMinute
    )
  );
}

export function calculateFluencyScore(
  original: string,
  spoken: string
) {
  const originalWords =
    normalizeText(original).split(
      " "
    );

  const spokenWords =
    normalizeText(spoken).split(
      " "
    );

  let matched = 0;

  originalWords.forEach((word) => {
    if (
      spokenWords.includes(word)
    ) {
      matched += 1;
    }
  });

  return Math.round(
    (matched /
      originalWords.length) *
      100
  );
}

export function buildConversationHistory(
  messages: ConversationMessage[]
) {
  return messages
    .map((message) => {
      const role =
        message.role === "ai"
          ? "AI"
          : "User";

      return `${role}: ${message.text}`;
    })
    .join("\n");
}

export function isBrowser() {
  return (
    typeof window !==
    "undefined"
  );
}

export function copyToClipboard(
  text: string
) {
  if (!isBrowser()) {
    return;
  }

  navigator.clipboard
    .writeText(text)
    .catch((error) => {
      console.error(
        "Clipboard error:",
        error
      );
    });
}

export function downloadTextFile(
  filename: string,
  content: string
) {
  if (!isBrowser()) {
    return;
  }

  const blob = new Blob(
    [content],
    {
      type: "text/plain"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function getFluencyLevel(
  score: number
) {
  if (score >= 76) {
    return "Advanced";
  }

  if (score >= 41) {
    return "Intermediate";
  }

  return "Beginner";
}

export function safeJsonParse<T>(
  value: string,
  fallback: T
): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
