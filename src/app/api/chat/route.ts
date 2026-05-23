import {
  NextRequest,
  NextResponse
} from "next/server";

import { env }
  from "@/server/env";

import {
  trimConversation
} from "@/server/ai/context-manager";

import {
  getOfflineReply
} from "@/server/ai/offline-replies";

import {
  requestAICompletion
} from "@/server/ai/provider-manager";

import {
  cleanAIText
} from "@/server/utils/text";

import {
  validateChatRequest
} from "@/server/security/request-validator";

import {
  applyRateLimit
} from "@/server/security/rate-limit";

import {
  logInfo,
  logError
} from "@/server/utils/logger";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

type ChatRequestBody = {
  message: string;

  history?: {
    role: "user" | "ai";

    text: string;
  }[];

  mode?:
    | "daily"
    | "business"
    | "interview"
    | "advanced";
};

function buildFallbackReply({
  message,
  mode
}: {
  message: string;

  mode:
    | "daily"
    | "business"
    | "interview"
    | "advanced";
}) {
  return getOfflineReply({
    message,
    mode
  });
}

export async function POST(
  request: NextRequest
) {
  try {
    const rateLimitPassed =
      applyRateLimit(
        request
      );

    if (!rateLimitPassed) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Too many requests. Please try again later."
        },
        {
          status: 429
        }
      );
    }

    const body:
      ChatRequestBody =
      await request.json();

    const validationResult =
      validateChatRequest(
        body
      );

    if (
      !validationResult.success
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            validationResult.message
        },
        {
          status: 400
        }
      );
    }

    const cleanedMessage =
      cleanAIText(
        body.message || ""
      ).trim();

    if (!cleanedMessage) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Message cannot be empty."
        },
        {
          status: 400
        }
      );
    }

    const mode =
      body.mode ||
      "daily";

    const history =
      trimConversation(
        body.history || [],
        10
      );

    logInfo(
      `Chat request received: ${cleanedMessage}`
    );

    if (
      !env.OPENROUTER_API_KEY
    ) {
      logError(
        "Missing OPENROUTER_API_KEY",
        "Environment variable not found."
      );

      return NextResponse.json(
        {
          success: true,

          reply:
            buildFallbackReply({
              message:
                cleanedMessage,

              mode
            }),

          source:
            "offline"
        },
        {
          headers: {
            "Cache-Control":
              "no-store"
          }
        }
      );
    }

    let aiReply = "";

    try {
      aiReply =
        await requestAICompletion(
          {
            message:
              cleanedMessage,

            history,

            mode,

            apiKey:
              env.OPENROUTER_API_KEY
          }
        );
    } catch (aiError) {
      logError(
        "AI Completion Error",
        aiError
      );

      return NextResponse.json(
        {
          success: true,

          reply:
            buildFallbackReply({
              message:
                cleanedMessage,

              mode
            }),

          source:
            "fallback"
        },
        {
          headers: {
            "Cache-Control":
              "no-store"
          }
        }
      );
    }

    const cleanedReply =
      cleanAIText(
        aiReply
      ).trim();

    if (!cleanedReply) {
      return NextResponse.json(
        {
          success: true,

          reply:
            buildFallbackReply({
              message:
                cleanedMessage,

              mode
            }),

          source:
            "empty-fallback"
        },
        {
          headers: {
            "Cache-Control":
              "no-store"
          }
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        reply:
          cleanedReply,

        source: "ai"
      },
      {
        headers: {
          "Cache-Control":
            "no-store"
        }
      }
    );
  } catch (error) {
    logError(
      "Chat Route Error",
      error
    );

    return NextResponse.json(
      {
        success: true,

        reply:
          "Sorry, I had a temporary issue. Please try again.",

        source:
          "emergency-fallback"
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store"
        }
      }
    );
  }
}
