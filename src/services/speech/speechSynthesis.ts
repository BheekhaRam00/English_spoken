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

let activeUtterance:
  | SpeechSynthesisUtterance
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

/*
PRIMARY:
SERVER TTS
*/
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

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  /*
  JSON ERROR
  */
  if (
    contentType.includes(
      "application/json"
    )
  ) {
    const errorData =
      await response.json();

    console.error(
      "TTS API Error:",
      errorData
    );

    throw new Error(
      errorData?.error ||
        errorData?.message ||
        "TTS failed."
    );
  }

  if (!response.ok) {
    throw new Error(
      "TTS request failed."
    );
  }

  const audioBlob =
    await response.blob();

  if (
    audioBlob.size < 1000
  ) {
    throw new Error(
      "Invalid audio response."
    );
  }

  return URL.createObjectURL(
    audioBlob
  );
}

/*
FALLBACK:
BROWSER VOICE
*/
function getBrowserVoice() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const voices =
    window.speechSynthesis.getVoices();

  if (!voices.length) {
    return null;
  }

  const englishVoices =
    voices.filter(
      (voice) =>
        voice.lang
          .toLowerCase()
          .includes("en")
    );

  return (
    englishVoices[0] ||
    voices[0]
  );
}

async function speakWithBrowser({
  text,
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

    const synth =
      window.speechSynthesis;

    synth.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    activeUtterance =
      utterance;

    utterance.lang =
      "en-US";

    utterance.rate =
      0.92;

    utterance.pitch =
      1;

    utterance.volume =
      1;

    const selectedVoice =
      getBrowserVoice();

    if (
      selectedVoice
    ) {
      utterance.voice =
        selectedVoice;
    }

    utterance.onstart =
      () => {
        speaking =
          true;

        onStart?.();
      };

    utterance.onend =
      () => {
        speaking =
          false;

        activeUtterance =
          null;

        onEnd?.();
      };

    utterance.onerror =
      () => {
        speaking =
          false;

        activeUtterance =
          null;

        onError?.(
          "Browser voice failed."
        );
      };

    synth.speak(
      utterance
    );
  } catch (error) {
    console.error(
      "Browser TTS Error:",
      error
    );

    onError?.(
      "Unable to play browser voice."
    );
  }
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
    RESET
    */
    stopSpeaking();

    /*
    TRY SERVER TTS
    */
    try {
      const audioUrl =
        await fetchTTSAudio(
          {
            text:
              cleanedText,

            voiceType
          }
        );

      const audio =
        new Audio();

      activeAudio =
        audio;

      audio.src =
        audioUrl;

      audio.preload =
        "auto";

      audio.volume = 1;

      audio.crossOrigin =
        "anonymous";

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
        async () => {
          speaking =
            false;

          URL.revokeObjectURL(
            audioUrl
          );

          activeAudio =
            null;

          /*
          AUTO FALLBACK
          */
          await speakWithBrowser(
            {
              text:
                cleanedText,

              voiceType,

              onStart,

              onEnd,

              onError
            }
          );
        };

      audio.load();

      await audio.play();

      return;
    } catch (serverError) {
      console.error(
        "Server TTS Failed:",
        serverError
      );

      /*
      FALLBACK
      */
      await speakWithBrowser(
        {
          text:
            cleanedText,

          voiceType,

          onStart,

          onEnd,

          onError
        }
      );
    }
  } catch (error) {
    console.error(
      "Speech Error:",
      error
    );

    speaking =
      false;

    activeAudio =
      null;

    activeUtterance =
      null;

    onError?.(
      error instanceof Error
        ? error.message
        : "Unable to generate voice."
    );
  }
}

export function stopSpeaking() {
  try {
    /*
    AUDIO STOP
    */
    if (
      activeAudio
    ) {
      activeAudio.pause();

      activeAudio.currentTime =
        0;

      activeAudio.src = "";

      activeAudio = null;
    }

    /*
    BROWSER TTS STOP
    */
    if (
      typeof window !==
      "undefined"
    ) {
      window.speechSynthesis.cancel();
    }

    activeUtterance =
      null;

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

    if (
      typeof window !==
      "undefined"
    ) {
      window.speechSynthesis.pause();
    }
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

    if (
      typeof window !==
      "undefined"
    ) {
      window.speechSynthesis.resume();
    }
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
        "AI Female",

      lang:
        "en-IN"
    },

    {
      name:
        "AI Male",

      lang:
        "en-IN"
    },

    {
      name:
        "AI Professional",

      lang:
        "en-IN"
    }
  ];
      }
