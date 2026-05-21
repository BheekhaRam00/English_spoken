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

let activeUtterance:
  | SpeechSynthesisUtterance
  | null = null;

let speaking =
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

  /*
  MOBILE FIX
  */
  if (
    voices.length === 0 &&
    !voicesLoaded
  ) {
    voicesLoaded = true;

    synth.onvoiceschanged =
      () => {
        voices =
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

  /*
  PRIORITY:
  1. English India
  2. English US/UK
  */

  const englishVoices =
    voices.filter(
      (voice) =>
        voice.lang
          .toLowerCase()
          .includes(
            "en"
          )
    );

  const indianVoices =
    englishVoices.filter(
      (voice) =>
        voice.lang
          .toLowerCase()
          .includes(
            "in"
          )
    );

  const preferredVoices =
    indianVoices.length
      ? indianVoices
      : englishVoices;

  const femalePriority =
    [
      "heera",
      "swara",
      "female",
      "samantha",
      "zira"
    ];

  const malePriority =
    [
      "prabhat",
      "male",
      "daniel",
      "alex",
      "david"
    ];

  const professionalPriority =
    [
      "google",
      "microsoft",
      "zira",
      "daniel"
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
          voice.name
            .toLowerCase()
            .includes(
              name
            )
      );

    if (matched) {
      return matched;
    }
  }

  return (
    preferredVoices[0] ||
    voices[0] ||
    null
  );
}

function cleanSpeechText(
  text: string
) {
  return text
    .replace(
      /\s+/g,
      " "
    )
    .replace(
      /\n+/g,
      ". "
    )
    .trim();
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

    const cleanedText =
      cleanSpeechText(
        text
      );

    if (
      !cleanedText
    ) {
      return;
    }

    const synth =
      window.speechSynthesis;

    /*
    HARD RESET
    PREVENT:
    - overlap
    - double voice
    - stuck speech
    */
    synth.cancel();

    speaking =
      false;

    activeUtterance =
      null;

    const utterance =
      new SpeechSynthesisUtterance(
        cleanedText
      );

    activeUtterance =
      utterance;

    utterance.lang =
      language;

    utterance.volume =
      volume;

    /*
    NATURAL SETTINGS
    */

    if (
      voiceType ===
      "female"
    ) {
      utterance.rate =
        rate ?? 0.93;

      utterance.pitch =
        pitch ?? 1.02;
    } else if (
      voiceType ===
      "male"
    ) {
      utterance.rate =
        rate ?? 0.9;

      utterance.pitch =
        pitch ?? 0.94;
    } else {
      utterance.rate =
        rate ?? 0.91;

      utterance.pitch =
        pitch ?? 0.98;
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
      (
        event
      ) => {
        speaking =
          false;

        activeUtterance =
          null;

        /*
        IGNORE SAFE ERRORS
        */
        if (
          event.error ===
          "interrupted"
        ) {
          return;
        }

        onError?.(
          "Voice playback failed."
        );
      };

    /*
    MOBILE ANDROID FIX
    */
    setTimeout(() => {
      try {
        synth.speak(
          utterance
        );
      } catch (error) {
        onError?.(
          "Unable to play voice."
        );
      }
    }, 120);
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
  try {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    speaking =
      false;

    activeUtterance =
      null;
  } catch (error) {
    console.error(
      "Stop Speaking Error:",
      error
    );
  }
}

export function pauseSpeaking() {
  try {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    window.speechSynthesis.pause();
  } catch (error) {
    console.error(
      "Pause Speaking Error:",
      error
    );
  }
}

export function resumeSpeaking() {
  try {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    window.speechSynthesis.resume();
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
