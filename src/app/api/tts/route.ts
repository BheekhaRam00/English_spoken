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

const HUGGINGFACE_API_URL =
  "https://api-inference.huggingface.co/models/hexgrad/Kokoro-82M";

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

function getVoice(
  voiceType:
    | "female"
    | "male"
    | "professional" = "female"
) {
  switch (voiceType) {
    case "male":
      return "am_adam";

    case "professional":
      return "af_bella";

    default:
      return "af_sarah";
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const huggingFaceKey =
      process.env
        .HUGGINGFACE_API_KEY;

    /*
    ENV CHECK
    */
    if (
      !huggingFaceKey
    ) {
      console.error(
        "Missing HuggingFace API key."
      );

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

    /*
    EMPTY TEXT CHECK
    */
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
    LIMIT LONG AUDIO
    */
    const limitedText =
      cleanedText.slice(
        0,
        700
      );

    /*
    REQUEST HUGGINGFACE
    */
    const response =
      await fetch(
        HUGGINGFACE_API_URL,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${huggingFaceKey}`,

            "Content-Type":
              "application/json",

            Accept:
              "audio/mpeg"
          },

          body: JSON.stringify({
            inputs:
              limitedText,

            parameters: {
              voice:
                getVoice(
                  body.voiceType
                )
            }
          })
        }
      );

    /*
    DEBUG ERROR RESPONSE
    */
    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Kokoro TTS Error:",
        errorText
      );

      return NextResponse.json(
        {
          success: false,

          status:
            response.status,

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
    AUDIO RESPONSE
    */
    const audioBuffer =
      await response.arrayBuffer();

    /*
    EMPTY AUDIO CHECK
    */
    if (
      !audioBuffer ||
      audioBuffer.byteLength ===
        0
    ) {
      console.error(
        "Empty audio buffer received."
      );

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
            "audio/mpeg",

          "Cache-Control":
            "no-store",

          "Content-Length":
            audioBuffer.byteLength.toString()
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
