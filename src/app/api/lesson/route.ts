import { NextResponse }
  from "next/server";

import {
  generateLesson
} from "@/server/learning/generate-lesson";

import {
  logError
} from "@/server/utils/logger";

import {
  applyRateLimit
} from "@/server/security/rate-limit";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

type LessonMode =
  | "beginner"
  | "daily"
  | "office"
  | "business"
  | "interview"
  | "pronunciation"
  | "advanced";

export async function GET(
  request: Request
) {
  try {
    const allowed =
      applyRateLimit(
        request
      );

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Too many requests."
        },
        {
          status: 429
        }
      );
    }

    const { searchParams } =
      new URL(
        request.url
      );

    const mode =
      (searchParams.get(
        "mode"
      ) as LessonMode) ||
      "daily";

    const lesson =
      await generateLesson({
        mode
      });

    return NextResponse.json(
      {
        success: true,

        lesson,

        generatedAt:
          Date.now()
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
      }
    );
  } catch (error) {
    logError(
      "Lesson API Error",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to generate lesson."
      },
      {
        status: 500
      }
    );
  }
}
