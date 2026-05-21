type StartSpeechRecognitionParams =
  {
    language?: string;

    continuous?: boolean;

    interimResults?: boolean;

    onStart?: () => void;

    onEnd?: () => void;

    onResult?: (
      transcript: string
    ) => void;

    onError?: (
      error:
        | Error
        | string
    ) => void;
  };

declare global {
  interface Window {
    webkitSpeechRecognition:
      any;

    SpeechRecognition:
      any;
  }
}

let recognition:
  | any
  | null = null;

let recognitionActive =
  false;

function getRecognitionClass() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return (
    window
      .SpeechRecognition ||
    window
      .webkitSpeechRecognition ||
    null
  );
}

export function startSpeechRecognition({
  language =
    "en-US",

  continuous =
    false,

  interimResults =
    true,

  onStart,

  onEnd,

  onResult,

  onError
}: StartSpeechRecognitionParams) {
  try {
    const Recognition =
      getRecognitionClass();

    if (
      !Recognition
    ) {
      onError?.(
        "Speech recognition is not supported in this browser."
      );

      return;
    }

    if (
      recognitionActive &&
      recognition
    ) {
      recognition.stop();

      recognition = null;

      recognitionActive =
        false;
    }

    recognition =
      new Recognition();

    recognition.lang =
      language;

    recognition.continuous =
      continuous;

    recognition.interimResults =
      interimResults;

    recognition.maxAlternatives =
      1;

    recognition.onstart =
      () => {
        recognitionActive =
          true;

        onStart?.();
      };

    recognition.onend =
      () => {
        recognitionActive =
          false;

        onEnd?.();
      };

    recognition.onerror =
      (
        event: any
      ) => {
        recognitionActive =
          false;

        const errorMessage =
          event?.error ||
          "Speech recognition failed.";

        onError?.(
          errorMessage
        );
      };

    recognition.onresult =
      (
        event: any
      ) => {
        try {
          let finalTranscript =
            "";

          for (
            let i = 0;
            i <
            event.results
              .length;
            i++
          ) {
            const result =
              event.results[
                i
              ];

            if (
              result.isFinal
            ) {
              finalTranscript +=
                result[0]
                  .transcript;
            }
          }

          const cleanedTranscript =
            finalTranscript.trim();

          if (
            cleanedTranscript
          ) {
            onResult?.(
              cleanedTranscript
            );
          }
        } catch (error) {
          onError?.(
            error instanceof
              Error
              ? error
              : "Unable to process speech recognition result."
          );
        }
      };

    recognition.start();
  } catch (error) {
    recognitionActive =
      false;

    onError?.(
      error instanceof
        Error
        ? error
        : "Speech recognition failed."
    );
  }
}

export function stopSpeechRecognition() {
  try {
    if (
      recognition
    ) {
      recognition.stop();

      recognition =
        null;
    }

    recognitionActive =
      false;
  } catch (error) {
    console.error(
      "Speech Recognition Stop Error:",
      error
    );
  }
}

export function isSpeechRecognitionSupported() {
  return Boolean(
    getRecognitionClass()
  );
}
