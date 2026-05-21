export type SpeakTextOptions =
  {
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

let voicesLoaded =
  false;

function loadVoices() {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  const synth =
    window.speechSynthesis;

  let voices =
    synth.getVoices();

  if (
    voices.length === 0 &&
    !voicesLoaded
  ) {
    voicesLoaded = true;

    synth.onvoiceschanged =
      () => {
        synth.getVoices();
      };
  }

  return voices;
}

function findBestVoice(
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
    voices.filter(
      (voice) =>
        voice.lang
          .toLowerCase()
          .includes(
            "en-in"
          ) ||
        voice.lang
          .toLowerCase()
          .includes(
            "hi-in"
          )
    );

  const preferredVoices =
    indianVoices.length
      ? indianVoices
      : voices;

  const femalePriority =
    [
      "Microsoft Heera",
      "Microsoft Swara",
      "Google हिन्दी",
      "Google UK English Female",
      "Samantha"
    ];

  const malePriority =
    [
      "Microsoft Prabhat",
      "Google UK English Male",
      "Daniel",
      "Alex"
    ];

  const professionalPriority =
    [
      "Microsoft Heera",
      "Microsoft Prabhat",
      "Google UK English Female",
      "Google UK English Male"
    ];

  let priorities:
    string[] = [];

  if (
    voiceType ===
    "female"
  ) {
    priorities =
      femalePriority;
  } else if (
    voiceType ===
    "male"
  ) {
    priorities =
      malePriority;
  } else {
    priorities =
      professionalPriority;
  }

  for (const name of priorities) {
    const matched =
      preferredVoices.find(
        (voice) =>
          voice.name.includes(
            name
          )
      );

    if (matched) {
      return matched;
    }
  }

  return (
    preferredVoices[0] ||
    null
  );
}

export function speakText({
  text,

  voiceType =
    "female",

  language =
    "en-IN",

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

    const synth =
      window.speechSynthesis;

    synth.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      language;

    utterance.volume =
      volume;

    if (
      voiceType ===
      "female"
    ) {
      utterance.rate =
        rate ?? 0.92;

      utterance.pitch =
        pitch ?? 1;
    } else if (
      voiceType ===
      "male"
    ) {
      utterance.rate =
        rate ?? 0.88;

      utterance.pitch =
        pitch ?? 0.92;
    } else {
      utterance.rate =
        rate ?? 0.9;

      utterance.pitch =
        pitch ?? 0.96;
    }

    const selectedVoice =
      findBestVoice(
        voiceType
      );

    if (
      selectedVoice
    ) {
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

    setTimeout(() => {
      synth.speak(
        utterance
      );
    }, 80);
  } catch (error) {
    console.error(
      "Speech Synthesis Error:",
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
      name:
        voice.name,

      lang:
        voice.lang
    }));
}
