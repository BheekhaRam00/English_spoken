import { NextResponse } from "next/server";

import { env } from "@/server/env";

import { logError } from "@/server/utils/logger";

export async function GET() {
  try {
    const health = {
      success: true,

      status: "healthy",

      timestamp:
        new Date().toISOString(),

      services: {
        api: true,

        ai:
          Boolean(
            env.OPENROUTER_API_KEY
          ),

        environment: true
      }
    };

    return NextResponse.json(
      health,
      {
        status: 200
      }
    );
  } catch (error) {
    logError(
      "Health Route Error",
      error
    );

    return NextResponse.json(
      {
        success: false,

        status:
          "unhealthy",

        timestamp:
          new Date().toISOString()
      },
      {
        status: 500
      }
    );
  }
}
