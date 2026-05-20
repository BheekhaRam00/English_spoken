export type SpeechRecognitionResult = {
  transcript: string;

  confidence?: number;
};

declare global {
  interface Window {
    SpeechRecognition:
      | typeof SpeechRecognition
      | undefined;

    webkitSpeechRecognition:
      | typeof SpeechRecognition
      | undefined;
  }
}

type StartRecognitionParams = {
  language?: string;

  onStart?: () => void;

  onEnd?: () => void;

  onError?: (
    error: string
  ) => void;

  onResult?: (
    result: SpeechRecognitionResult
  ) => void;
};

let recognitionInstance:
  | SpeechRecognition
  | null = null;

export function isSpeechRecognitionSupported() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(
    window.SpeechRecognition ||
      window.webkitSpeechRecognition
  );
}

export function startSpeechRecognition({
  language = "en-US",

  onStart,

  onEnd,

  onError,

  onResult
}: StartRecognitionParams) {
  if (
    typeof window === "undefined"
  ) {
    onError?.(
      "Speech recognition is unavailable."
    );

    return;
  }

  const SpeechRecognitionAPI =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognitionAPI) {
    onError?.(
      "Speech recognition is not supported on this device."
    );

    return;
  }

  recognitionInstance =
    new SpeechRecognitionAPI();

  recognitionInstance.lang =
    language;

  recognitionInstance.continuous =
    false;

  recognitionInstance.interimResults =
    false;

  recognitionInstance.maxAlternatives =
    1;

  recognitionInstance.onstart = () => {
    onStart?.();
  };

  recognitionInstance.onend = () => {
    onEnd?.();
  };

  recognitionInstance.onerror = (
    event
  ) => {
    onError?.(event.error);
  };

  recognitionInstance.onresult = (
    event
  ) => {
    const result =
      event.results[0][0];

    onResult?.({
      transcript:
        result.transcript.trim(),

      confidence:
        result.confidence
    });
  };

  recognitionInstance.start();
}

export function stopSpeechRecognition() {
  recognitionInstance?.stop();
}

export function abortSpeechRecognition() {
  recognitionInstance?.abort();
}
