type LogLevel =
  | "info"
  | "warn"
  | "error";

type LogPayload = {
  timestamp: string;

  level: LogLevel;

  message: string;

  metadata?: unknown;
};

function createLogPayload({
  level,
  message,
  metadata
}: {
  level: LogLevel;

  message: string;

  metadata?: unknown;
}): LogPayload {
  return {
    timestamp:
      new Date().toISOString(),

    level,

    message,

    metadata
  };
}

function printLog(
  payload: LogPayload
) {
  const formattedMessage =
    `[${payload.timestamp}] [${payload.level.toUpperCase()}] ${payload.message}`;

  if (
    payload.level ===
    "error"
  ) {
    console.error(
      formattedMessage,
      payload.metadata || ""
    );

    return;
  }

  if (
    payload.level ===
    "warn"
  ) {
    console.warn(
      formattedMessage,
      payload.metadata || ""
    );

    return;
  }

  console.log(
    formattedMessage,
    payload.metadata || ""
  );
}

export function logInfo(
  message: string,
  metadata?: unknown
) {
  printLog(
    createLogPayload({
      level: "info",

      message,

      metadata
    })
  );
}

export function logWarn(
  message: string,
  metadata?: unknown
) {
  printLog(
    createLogPayload({
      level: "warn",

      message,

      metadata
    })
  );
}

export function logError(
  message: string,
  metadata?: unknown
) {
  printLog(
    createLogPayload({
      level: "error",

      message,

      metadata
    })
  );
}
