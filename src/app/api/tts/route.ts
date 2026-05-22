import {
  NextRequest,
  NextResponse
} from "next/server";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type TTSRequestBody = {
  text: string;

  voiceType?:
    | "female"
    | "male"
    | "professional";
};

/*
WORKING HF TTS MODEL
*/
const HUGGINGFACE_API_URL =
  "https://api-inference.huggingface.co/models/espnet/kan-bayashi_ljspeech_vits";

function cleanSpeechText(
  text: string
) {
  return text
    .replace(/\r/g, "")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .replace(
      /[^\w\s.,!?'-]/g,
      ""
    )
    .trim();
}

export async function POST(
  request: NextRequest
) {
  try {
    const huggingFaceKey =
      process.env
        .HUGGINGFACE_API_KEY;

    if (
      !huggingFaceKey
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Missing HUGGINGFACE_API_KEY"
        },
        {
          status: 500
        }
      );
    }

    const body:
      TTSRequestBody =
      await request.json();

    const cleanedText =
      cleanSpeechText(
        body?.text || ""
      );

    if (
      !cleanedText
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Text is required."
        },
        {
          status: 400
        }
      );
    }

    /*
    SHORT LIMIT
    */
    const limitedText =
      cleanedText.slice(
        0,
        400
      );

    const response =
      await fetch(
        HUGGINGFACE_API_URL,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${huggingFaceKey}`,

            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            inputs:
              limitedText
          })
        }
      );

    /*
    HANDLE HF ERRORS
    */
    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "HF TTS Error:",
        errorText
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "TTS generation failed.",

          error:
            errorText
        },
        {
          status:
            response.status
        }
      );
    }

    /*
    AUDIO BUFFER
    */
    const audioBuffer =
      await response.arrayBuffer();

    if (
      !audioBuffer ||
      audioBuffer.byteLength ===
        0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Empty audio response."
        },
        {
          status: 500
        }
      );
    }

    return new NextResponse(
      audioBuffer,
      {
        status: 200,

        headers: {
          "Content-Type":
            "audio/wav",

          "Cache-Control":
            "no-store"
        }
      }
    );
  } catch (error) {
    console.error(
      "TTS Route Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to generate speech.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown error"
      },
      {
        status: 500
      }
    );
  }
}
