const INVALID_PATTERNS = [
  "i am an ai",
  "as an ai",
  "language model",
  "cannot assist",
  "i cannot help",
  "openai",
  "artificial intelligence"
];

const GENERIC_REPLIES = [
  "tell me more",
  "that's interesting",
  "i understand",
  "nice",
  "okay"
];

export function validateAIResponse(
  text: string
) {
  if (!text) {
    return false;
  }

  const cleaned =
    text
      .toLowerCase()
      .trim();

  if (
    cleaned.length < 4
  ) {
    return false;
  }

  if (
    cleaned.length > 500
  ) {
    return false;
  }

  const hasInvalidPattern =
    INVALID_PATTERNS.some(
      (pattern) =>
        cleaned.includes(
          pattern
        )
    );

  if (
    hasInvalidPattern
  ) {
    return false;
  }

  const repeatedWords =
    /(\\b\\w+\\b)(\\s+\\1){3,}/i;

  if (
    repeatedWords.test(
      cleaned
    )
  ) {
    return false;
  }

  const genericReply =
    GENERIC_REPLIES.find(
      (reply) =>
        cleaned ===
        reply
    );

  if (genericReply) {
    return false;
  }

  return true;
}
