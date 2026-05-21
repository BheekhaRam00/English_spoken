type ValidationResult = {
  success: boolean;

  message?: string;
};

type ChatRequestBody = {
  message?: string;

  history?: {
    role: "user" | "ai";

    text: string;
  }[];

  mode?: string;
};

const ALLOWED_MODES = [
  "daily",
  "business",
  "interview",
  "advanced"
];

export function validateChatRequest(
  body: ChatRequestBody
): ValidationResult {
  if (!body) {
    return {
      success: false,

      message:
        "Request body is missing."
    };
  }

  if (
    typeof body.message !==
    "string"
  ) {
    return {
      success: false,

      message:
        "Message must be a string."
    };
  }

  const cleanedMessage =
    body.message.trim();

  if (!cleanedMessage) {
    return {
      success: false,

      message:
        "Message cannot be empty."
    };
  }

  if (
    cleanedMessage.length <
    2
  ) {
    return {
      success: false,

      message:
        "Message is too short."
    };
  }

  if (
    cleanedMessage.length >
    1000
  ) {
    return {
      success: false,

      message:
        "Message is too long."
    };
  }

  if (
    body.mode &&
    !ALLOWED_MODES.includes(
      body.mode
    )
  ) {
    return {
      success: false,

      message:
        "Invalid conversation mode."
    };
  }

  if (
    body.history &&
    !Array.isArray(
      body.history
    )
  ) {
    return {
      success: false,

      message:
        "History must be an array."
    };
  }

  if (
    Array.isArray(
      body.history
    )
  ) {
    const invalidHistory =
      body.history.some(
        (item) => {
          return (
            !item ||
            typeof item.text !==
              "string" ||
            ![
              "user",
              "ai"
            ].includes(
              item.role
            )
          );
        }
      );

    if (invalidHistory) {
      return {
        success: false,

        message:
          "Invalid conversation history."
      };
    }
  }

  return {
    success: true
  };
}
