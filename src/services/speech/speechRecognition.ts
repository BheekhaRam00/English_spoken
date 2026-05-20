type SpeechRecognitionResult = {
  transcript: string;
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResult[][];
};

interface CustomSpeechRecognition {
  lang: string;

  continuous: boolean;

  interimResults: boolean;

  maxAlternatives: number;

  onstart:
    | (() => void)
    | null;

  onend:
    | (() => void)
    | null;

  onerror:
    | (() => void)
    | null;

  onresult:
    | ((
        event: SpeechRecognitionEvent
      ) => void)
    | null;

  start: () => void;

  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): CustomSpeechRecognition;
}

type BrowserWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;

  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

let recognition:
  | CustomSpeechRecognition
  | null = null;

export function isSpeechRecognitionSupported() {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  const browserWindow =
    window as BrowserWindow;

  return Boolean(
    browserWindow.SpeechRecognition ||
      browserWindow.webkitSpeechRecognition
  );
}

export function startSpeechRecognition({
  onStart,
  onEnd,
  onError,
  onResult
}: {
  onStart?: () => void;

  onEnd?: () => void;

  onError?: () => void;

  onResult?: (
    transcript: string
  ) => void;
}) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  const browserWindow =
    window as BrowserWindow;

  const SpeechRecognitionAPI =
    browserWindow.SpeechRecognition ||
    browserWindow.webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) {
    console.error(
      "Speech recognition is not supported."
    );

    return;
  }

  recognition =
    new SpeechRecognitionAPI();

  recognition.lang =
    "en-US";

  recognition.continuous =
    false;

  recognition.interimResults =
    false;

  recognition.maxAlternatives =
    1;

  recognition.onstart = () => {
    onStart?.();
  };

  recognition.onend = () => {
    onEnd?.();
  };

  recognition.onerror = () => {
    onError?.();
  };

  recognition.onresult = (
    event
  ) => {
    const transcript =
      event.results[0][0]
        .transcript;

    onResult?.(
      transcript
    );
  };

  recognition.start();
}

export function stopSpeechRecognition() {
  if (recognition) {
    recognition.stop();

    recognition = null;
  }
}
