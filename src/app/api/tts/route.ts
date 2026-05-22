import {
  NextRequest,
  NextResponse
} from "next/server";

export const runtime =
  "edge";

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

function getVoicePrompt(
  voiceType:
    | "female"
    | "male"
    | "professional" = "female"
) {
  switch (voiceType) {
    case "male":
      return "Male English voice with natural speaking tone.";

    case "professional":
      return "Professional English voice with clear pronunciation and natural pacing.";

    default:
      return "Natural friendly female English voice with realistic conversation tone.";
  }
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
    LIMIT VERY LONG AUDIO
    */
    const limitedText =
      cleanedText.slice(
        0,
        900
      );

    const voicePrompt =
      getVoicePrompt(
        body.voiceType
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
            inputs: limitedText,

            parameters: {
              prompt:
                voicePrompt
            }
          })
        }
      );

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

          message:
            "TTS generation failed."
        },
        {
          status: 500
        }
      );
    }

    const audioBuffer =
      await response.arrayBuffer();

    return new NextResponse(
      audioBuffer,
      {
        status: 200,

        headers: {
          "Content-Type":
            "audio/mpeg",

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
          "Unable to generate speech."
      },
      {
        status: 500
      }
    );
  }
}
