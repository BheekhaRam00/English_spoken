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

export const fetchCache =
  "force-no-store";

type LessonMode =
  | "beginner"
  | "daily"
  | "office"
  | "business"
  | "interview"
  | "pronunciation"
  | "advanced";

const VALID_MODES:
  LessonMode[] = [
  "beginner",
  "daily",
  "office",
  "business",
  "interview",
  "pronunciation",
  "advanced"
];

function getSafeMode(
  mode: string | null
): LessonMode {
  if (
    mode &&
    VALID_MODES.includes(
      mode as LessonMode
    )
  ) {
    return mode as LessonMode;
  }

  return "daily";
}

export async function GET(
  request: Request
) {
  try {
    /*
    RATE LIMIT
    */
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
          status: 429,

          headers: {
            "Cache-Control":
              "no-store"
          }
        }
      );
    }

    /*
    QUERY PARAMS
    */
    const { searchParams } =
      new URL(
        request.url
      );

    const mode =
      getSafeMode(
        searchParams.get(
          "mode"
        )
      );

    /*
    GENERATE UNIQUE LESSON
    */
    const lesson =
      await generateLesson({
        mode
      });

    /*
    SAFETY CHECK
    */
    if (
      !lesson ||
      !lesson.sentences ||
      !lesson.sentences.length
    ) {
      throw new Error(
        "Invalid lesson generated."
      );
    }

    /*
    RESPONSE
    */
    return NextResponse.json(
      {
        success: true,

        lesson,

        mode,

        generatedAt:
          Date.now(),

        randomSeed:
          Math.random()
            .toString(36)
            .slice(2, 10)
      },
      {
        status: 200,

        headers: {
          /*
          VERY IMPORTANT
          */
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",

          Pragma:
            "no-cache",

          Expires:
            "0",

          "Surrogate-Control":
            "no-store"
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
          "Unable to generate lesson.",

        generatedAt:
          Date.now()
      },
      {
        status: 500,

        headers: {
          "Cache-Control":
            "no-store"
        }
      }
    );
  }
}
