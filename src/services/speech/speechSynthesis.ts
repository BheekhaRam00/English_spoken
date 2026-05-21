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

function getIndianVoice(
  voiceType:
    | "female"
    | "male"
    | "professional"
) {
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

  const indianVoices =
    voices.filter((voice) =>
      voice.lang
        .toLowerCase()
        .includes("en-in")
    );

  if (
    !indianVoices.length
  ) {
    return voices[0];
  }

  if (
    voiceType ===
    "female"
  ) {
    return (
      indianVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes("female")
      ) ||

      indianVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes("google")
      ) ||

      indianVoices[0]
    );
  }

  if (
    voiceType === "male"
  ) {
    return (
      indianVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes("male")
      ) ||

      indianVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes("microsoft")
      ) ||

      indianVoices[
        indianVoices.length - 1
      ]
    );
  }

  return (
    indianVoices.find(
      (voice) =>
        voice.name
          .toLowerCase()
          .includes("google")
    ) ||

    indianVoices[0]
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

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    const selectedVoice =
      getIndianVoice(
        voiceType
      );

    utterance.lang =
      "en-IN";

    utterance.volume =
      volume;

    if (
      voiceType ===
      "female"
    ) {
      utterance.rate =
        rate ?? 0.72;

      utterance.pitch =
        pitch ?? 1.02;
    } else if (
      voiceType ===
      "male"
    ) {
      utterance.rate =
        rate ?? 0.68;

      utterance.pitch =
        pitch ?? 0.82;
    } else {
      utterance.rate =
        rate ?? 0.75;

      utterance.pitch =
        pitch ?? 0.92;
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
    }, 120);
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

  return window.speechSynthesis
    .getVoices()
    .map((voice) => ({
      name: voice.name,
      lang: voice.lang
    }));
}
