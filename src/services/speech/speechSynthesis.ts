export type SpeakTextOptions =
  {
    text: string;

    voiceType?:
      | "female"
      | "male"
      | "professional";

    onStart?: () => void;

    onEnd?: () => void;

    onError?: (
      error: string
    ) => void;
  };

let activeAudio:
  | HTMLAudioElement
  | null = null;

let speaking =
  false;

function cleanSpeechText(
  text: string
) {
  return text
    .replace(/\r/g, "")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchTTSAudio({
  text,
  voiceType
}: {
  text: string;

  voiceType:
    | "female"
    | "male"
    | "professional";
}) {
  const response =
    await fetch(
      "/api/tts",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          text,

          voiceType
        })
      }
    );

  if (!response.ok) {
    throw new Error(
      "TTS request failed."
    );
  }

  const audioBlob =
    await response.blob();

  return URL.createObjectURL(
    audioBlob
  );
}

export async function speakText({
  text,

  voiceType =
    "female",

  onStart,

  onEnd,

  onError
}: SpeakTextOptions) {
  try {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const cleanedText =
      cleanSpeechText(
        text
      );

    if (
      !cleanedText
    ) {
      return;
    }

    /*
    STOP OLD AUDIO
    */
    stopSpeaking();

    const audioUrl =
      await fetchTTSAudio(
        {
          text:
            cleanedText,

          voiceType
        }
      );

    const audio =
      new Audio(
        audioUrl
      );

    activeAudio =
      audio;

    audio.preload =
      "auto";

    audio.volume = 1;

    audio.onplay =
      () => {
        speaking =
          true;

        onStart?.();
      };

    audio.onended =
      () => {
        speaking =
          false;

        URL.revokeObjectURL(
          audioUrl
        );

        activeAudio =
          null;

        onEnd?.();
      };

    audio.onerror =
      () => {
        speaking =
          false;

        URL.revokeObjectURL(
          audioUrl
        );

        activeAudio =
          null;

        onError?.(
          "Audio playback failed."
        );
      };

    /*
    MOBILE SAFETY
    */
    await audio.play();
  } catch (error) {
    console.error(
      "Kokoro Speech Error:",
      error
    );

    speaking =
      false;

    activeAudio =
      null;

    onError?.(
      "Unable to generate voice."
    );
  }
}

export function stopSpeaking() {
  try {
    if (
      activeAudio
    ) {
      activeAudio.pause();

      activeAudio.currentTime =
        0;

      activeAudio = null;
    }

    speaking =
      false;
  } catch (error) {
    console.error(
      "Stop Speaking Error:",
      error
    );
  }
}

export function pauseSpeaking() {
  try {
    activeAudio?.pause();
  } catch (error) {
    console.error(
      "Pause Speaking Error:",
      error
    );
  }
}

export function resumeSpeaking() {
  try {
    activeAudio?.play();
  } catch (error) {
    console.error(
      "Resume Speaking Error:",
      error
    );
  }
}

export function isSpeaking() {
  return speaking;
}

export function getAvailableVoices() {
  return [
    {
      name:
        "Kokoro Female",

      lang:
        "en-IN"
    },

    {
      name:
        "Kokoro Male",

      lang:
        "en-IN"
    },

    {
      name:
        "Kokoro Professional",

      lang:
        "en-IN"
    }
  ];
}
