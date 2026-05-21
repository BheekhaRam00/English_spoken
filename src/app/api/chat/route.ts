import { NextRequest, NextResponse } from "next/server";

import { env } from "@/server/env";

import { trimConversation } from "@/server/ai/context-manager";

import { validateAIResponse } from "@/server/ai/response-validator";

import { getOfflineReply } from "@/server/ai/offline-replies";

import { requestAICompletion } from "@/server/ai/provider-manager";

import { cleanAIText } from "@/server/utils/text";

import { validateChatRequest } from "@/server/security/request-validator";

import { applyRateLimit } from "@/server/security/rate-limit";

import {
  logInfo,
  logError
} from "@/server/utils/logger";

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

export async function POST(
  request: NextRequest
) {
  try {
    const rateLimitPassed =
      applyRateLimit(request);

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

    const body: ChatRequestBody =
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
        body.message
      );

    const history =
      trimConversation(
        body.history || [],
        14
      );

    logInfo(
      `Chat request received: ${cleanedMessage}`
    );

    if (
      !env.OPENROUTER_API_KEY
    ) {
      return NextResponse.json({
        success: true,

        reply:
          getOfflineReply({
            message:
              cleanedMessage,

            mode:
              body.mode ||
              "daily"
          }),

        source:
          "offline"
      });
    }

    const aiReply =
      await requestAICompletion(
        {
          message:
            cleanedMessage,

          history,

          mode:
            body.mode ||
            "daily",

          apiKey:
            env.OPENROUTER_API_KEY
        }
      );

    const cleanedReply =
      cleanAIText(
        aiReply
      );

    const validReply =
      validateAIResponse(
        cleanedReply
      );

    if (!validReply) {
      const fallbackReply =
        getOfflineReply({
          message:
            cleanedMessage,

          mode:
            body.mode ||
            "daily"
        });

      return NextResponse.json({
        success: true,

        reply:
          fallbackReply,

        source:
          "fallback"
      });
    }

    return NextResponse.json({
      success: true,

      reply:
        cleanedReply,

      source: "ai"
    });
  } catch (error) {
    logError(
      "Chat Route Error",
      error
    );

    return NextResponse.json(
      {
        success: true,

        reply:
          getOfflineReply({
            message:
              "general",

            mode:
              "daily"
          }),

        source:
          "emergency-fallback"
      },
      {
        status: 200
      }
    );
  }
}
