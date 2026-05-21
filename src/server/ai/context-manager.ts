type ConversationMessage = {
  role: "user" | "ai";

  text: string;
};

export function trimConversation(
  messages: ConversationMessage[],
  limit = 12
) {
  if (
    !Array.isArray(
      messages
    )
  ) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message?.text &&
        message?.role
    )
    .slice(-limit);
}

export function buildConversationContext(
  messages: ConversationMessage[]
) {
  return messages
    .map((message) => {
      const role =
        message.role ===
        "user"
          ? "User"
          : "AI";

      return `${role}: ${message.text}`;
    })
    .join("\n");
}

export function detectConversationTopic(
  text: string
) {
  const lower =
    text.toLowerCase();

  if (
    lower.includes(
      "job"
    ) ||
    lower.includes(
      "office"
    ) ||
    lower.includes(
      "meeting"
    ) ||
    lower.includes(
      "client"
    )
  ) {
    return "work";
  }

  if (
    lower.includes(
      "family"
    ) ||
    lower.includes(
      "friend"
    ) ||
    lower.includes(
      "home"
    )
  ) {
    return "personal";
  }

  if (
    lower.includes(
      "english"
    ) ||
    lower.includes(
      "speaking"
    ) ||
    lower.includes(
      "practice"
    )
  ) {
    return "learning";
  }

  return "general";
}

export function isTopicChanged({
  previousMessage,
  currentMessage
}: {
  previousMessage: string;

  currentMessage: string;
}) {
  const previousTopic =
    detectConversationTopic(
      previousMessage
    );

  const currentTopic =
    detectConversationTopic(
      currentMessage
    );

  return (
    previousTopic !==
    currentTopic
  );
}
