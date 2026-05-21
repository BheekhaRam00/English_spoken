import { logWarn }
  from "@/server/utils/logger";

type Environment = {
  OPENROUTER_API_KEY: string;

  NODE_ENV:
    | "development"
    | "production"
    | "test";

  NEXT_PUBLIC_APP_NAME: string;

  NEXT_PUBLIC_APP_URL: string;
};

function getEnvironment(): Environment {
  const OPENROUTER_API_KEY =
    process.env
      .OPENROUTER_API_KEY ||
    "";

  const NODE_ENV =
    (process.env
      .NODE_ENV as
      | "development"
      | "production"
      | "test") ||
    "development";

  const NEXT_PUBLIC_APP_NAME =
    process.env
      .NEXT_PUBLIC_APP_NAME ||
    "FluentPro AI";

  const NEXT_PUBLIC_APP_URL =
    process.env
      .NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  if (
    !OPENROUTER_API_KEY &&
    NODE_ENV ===
      "production"
  ) {
    logWarn(
      "OPENROUTER_API_KEY is missing in production environment."
    );
  }

  return {
    OPENROUTER_API_KEY,

    NODE_ENV,

    NEXT_PUBLIC_APP_NAME,

    NEXT_PUBLIC_APP_URL
  };
}

export const env =
  getEnvironment();
