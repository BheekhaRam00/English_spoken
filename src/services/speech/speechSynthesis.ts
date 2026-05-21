export type SpeakTextOptions = {
  text: string;

  voiceType?:
    | "female"
    | "male"
    | "professional";

  language?: string;

  rate?: number;

  pitch?: number;

  volume?: number;

  onStart?: () => void;

  onEnd?: () => void;

  onError?: (
    error: string
  ) => void;
};

let cachedVoices:
  SpeechSynthesisVoice[] = [];

function loadVoices() {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  const voices =
    window.speechSynthesis.getVoices();

  if (voices.length) {
    cachedVoices = voices;
  }

  return cachedVoices;
}

function getBestVoice(
  voiceType:
    | "female"
    | "male"
    | "professional"
) {
  const voices =
    loadVoices();

  if (!voices.length) {
    return null;
  }

  const indianVoices =
    voices.filter((voice) => {
      const lang =
        voice.lang.toLowerCase();

      return (
        lang.includes("en-in") ||
        lang.includes("hi-in")
      );
    });

  const searchPool =
    indianVoices.length
      ? indianVoices
      : voices;

  if (
    voiceType ===
    "professional"
  ) {
    return (
      searchPool.find((v) =>
        v.name
          .toLowerCase()
          .includes("google")
      ) ||

      searchPool.find((v) =>
        v.name
          .toLowerCase()
          .includes("microsoft")
      ) ||

      searchPool[0]
    );
  }

  if (
    voiceType === "male"
  ) {
    return (
      searchPool.find((v) => {
        const name =
          v.name.toLowerCase();

        return (
          name.includes(
            "male"
          ) ||
          name.includes(
            "david"
          ) ||
          name.includes(
            "mark"
          ) ||
          name.includes(
            "rahul"
          )
        );
      }) ||

      searchPool[
        searchPool.length - 1
      ]
    );
  }

  return (
    searchPool.find((v) => {
      const name =
        v.name.toLowerCase();

      return (
        name.includes(
          "female"
        ) ||
        name.includes(
          "zira"
        ) ||
        name.includes(
          "priya"
        )
      );
    }) ||

    searchPool[0]
  );
}

export function speakText({
  text,

  voiceType = "female",

  language = "en-IN",

  rate,

  pitch,

  volume = 1,

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

    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      onError?.(
        "Speech synthesis is not supported."
      );

      return;
    }

    if (!text.trim()) {
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    const selectedVoice =
      getBestVoice(
        voiceType
      );

    utterance.lang =
      language;

    utterance.volume =
      volume;

    /*
      IMPORTANT:
      Lower speed = less robotic
    */

    if (
      voiceType ===
      "female"
    ) {
      utterance.rate =
        rate ?? 0.58;

      utterance.pitch =
        pitch ?? 0.92;
    } else if (
      voiceType ===
      "male"
    ) {
      utterance.rate =
        rate ?? 0.56;

      utterance.pitch =
        pitch ?? 0.72;
    } else {
      utterance.rate =
        rate ?? 0.60;

      utterance.pitch =
        pitch ?? 0.82;
    }

    if (selectedVoice) {
      utterance.voice =
        selectedVoice;
    }

    utterance.onstart =
      () => {
        onStart?.();
      };

    utterance.onend =
      () => {
        onEnd?.();
      };

    utterance.onerror =
      () => {
        onError?.(
          "Voice playback failed."
        );
      };

    window.speechSynthesis.cancel();

    setTimeout(() => {
      window.speechSynthesis.speak(
        utterance
      );
    }, 250);
  } catch (error) {
    console.error(
      "Speech synthesis error:",
      error
    );

    onError?.(
      "Unable to play voice."
    );
  }
}

export function stopSpeaking() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.speechSynthesis.cancel();
}

export function pauseSpeaking() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.speechSynthesis.pause();
}

export function resumeSpeaking() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.speechSynthesis.resume();
}

export function getAvailableVoices() {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  return loadVoices().map(
    (voice) => ({
      name: voice.name,
      lang: voice.lang
    })
  );
}

if (
  typeof window !==
  "undefined"
) {
  window.speechSynthesis.onvoiceschanged =
    () => {
      loadVoices();
    };

  loadVoices();
}
