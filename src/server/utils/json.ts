import { logError }
  from "@/server/utils/logger";

type SafeParseResult<T> =
  {
    success: boolean;

    data: T | null;

    error?: string;
  };

export function safeJsonParse<T>(
  value: string
): SafeParseResult<T> {
  try {
    const parsed =
      JSON.parse(
        value
      ) as T;

    return {
      success: true,

      data: parsed
    };
  } catch (error) {
    logError(
      "JSON Parse Error",
      error
    );

    return {
      success: false,

      data: null,

      error:
        error instanceof Error
          ? error.message
          : "Invalid JSON"
    };
  }
}

export function safeJsonStringify(
  value: unknown,
  spacing = 2
) {
  try {
    return JSON.stringify(
      value,
      null,
      spacing
    );
  } catch (error) {
    logError(
      "JSON Stringify Error",
      error
    );

    return "";
  }
}

export function isValidJson(
  value: string
) {
  try {
    JSON.parse(value);

    return true;
  } catch {
    return false;
  }
}
