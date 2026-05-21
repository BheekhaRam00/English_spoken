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

function selectBestVoice(
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

  const englishVoices =
    voices.filter(
      (voice) =>
        voice.lang
          .toLowerCase()
          .includes("en")
    );

  const indianVoices =
    englishVoices.filter(
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
    voiceType ===
    "female"
  ) {
    return (
      indianVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "google"
            )
      ) ||

      indianVoices[0] ||

      englishVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "female"
            )
      ) ||

      englishVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "zira"
            )
      ) ||

      englishVoices[0]
    );
  }

  if (
    voiceType ===
    "male"
  ) {
    return (
      indianVoices[0] ||

      englishVoices.find(
        (voice) =>
          voice.name
            .toLowerCase()
            .includes(
              "david"
            )
      ) ||

      englishVoices[0]
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

    indianVoices[0] ||

    englishVoices[0] ||

    voices[0]
  );
}

export function speakText({
  text,

  voiceType =
    "female",

  language =
    "en-IN",

  rate = 0.9,

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
        "Speech synthesis is not supported."
      );

      return;
    }

    const speak =
      () => {
        try {
          const utterance =
            new SpeechSynthesisUtterance(
              text
            );

          const selectedVoice =
            selectBestVoice(
              voiceType
            );

          if (
            selectedVoice
          ) {
            utterance.voice =
              selectedVoice;

            utterance.lang =
              selectedVoice.lang;
          } else {
            utterance.lang =
              language;
          }

          utterance.rate =
            rate;

          utterance.pitch =
            voiceType ===
            "female"
              ? 1.03
              : pitch;

          utterance.volume =
            volume;

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

          setTimeout(() => {
            window.speechSynthesis.speak(
              utterance
            );
          }, 120);
        } catch (error) {
          console.error(
            "Speech play error:",
            error
          );

          onError?.(
            "Voice playback failed."
          );
        }
      };

    const voices =
      window.speechSynthesis.getVoices();

    if (
      voices.length === 0
    ) {
      window.speechSynthesis.onvoiceschanged =
        () => {
          speak();
        };

      setTimeout(() => {
        speak();
      }, 800);

      return;
    }

    speak();
  } catch (error) {
    console.error(
      "Speech synthesis error:",
      error
    );

    onError?.(
      "Speech synthesis failed."
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
