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
    voices.filter(
      (voice) =>
        voice.lang
          .toLowerCase()
          .includes("en-in") ||

        voice.name
          .toLowerCase()
          .includes("india") ||

        voice.name
          .toLowerCase()
          .includes("indian")
    );

  if (
    indianVoices.length
  ) {
    if (
      voiceType ===
      "female"
    ) {
      return (
        indianVoices.find(
          (voice) =>
            voice.name
              .toLowerCase()
              .includes(
                "female"
              )
        ) ||

        indianVoices.find(
          (voice) =>
            voice.name
              .toLowerCase()
              .includes(
                "google"
              )
        ) ||

        indianVoices[0]
      );
    }

    if (
      voiceType ===
      "male"
    ) {
      return (
        indianVoices.find(
          (voice) =>
            voice.name
              .toLowerCase()
              .includes(
                "male"
              )
        ) ||

        indianVoices[0]
      );
    }

    return (
      indianVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "google"
            )
      ) ||

      indianVoices[0]
    );
  }

  return null;
}

function getVoiceByType(
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

  const indianVoice =
    getIndianVoice(
      voiceType
    );

  if (indianVoice) {
    return indianVoice;
  }

  if (
    voiceType ===
    "female"
  ) {
    return (
      voices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "female"
            )
      ) ||

      voices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "zira"
            )
      ) ||

      voices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "google"
            )
      ) ||

      voices[0]
    );
  }

  if (
    voiceType ===
    "male"
  ) {
    return (
      voices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "male"
            )
      ) ||

      voices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "david"
            )
      ) ||

      voices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "google"
            )
      ) ||

      voices[0]
    );
  }

  return (
    voices.find(
      (voice) =>
        voice.name
          .toLowerCase()
          .includes(
            "google"
          )
    ) || voices[0]
  );
}

export function speakText({
  text,

  voiceType =
    "female",

  language =
    "en-IN",

  rate = 0.88,

  pitch = 1,

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
        "Speech synthesis is not supported on this device."
      );

      return;
    }

    const loadAndSpeak =
      () => {
        const utterance =
          new SpeechSynthesisUtterance(
            text
          );

        utterance.lang =
          language;

        utterance.rate =
          rate;

        utterance.pitch =
          voiceType ===
          "female"
            ? 1.02
            : pitch;

        utterance.volume =
          volume;

        const selectedVoice =
          getVoiceByType(
            voiceType
          );

        if (
          selectedVoice
        ) {
          utterance.voice =
            selectedVoice;

          utterance.lang =
            selectedVoice.lang;
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
              "Unable to play voice."
            );
          };

        window.speechSynthesis.cancel();

        window.speechSynthesis.speak(
          utterance
        );
      };

    const voices =
      window.speechSynthesis.getVoices();

    if (
      voices.length === 0
    ) {
      window.speechSynthesis.onvoiceschanged =
        () => {
          loadAndSpeak();
        };

      setTimeout(() => {
        loadAndSpeak();
      }, 400);

      return;
    }

    loadAndSpeak();
  } catch (error) {
    console.error(
      "Speech synthesis error:",
      error
    );

    onError?.(
      "Voice playback failed."
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
      name:
        voice.name,

      lang:
        voice.lang
    }));
      }
