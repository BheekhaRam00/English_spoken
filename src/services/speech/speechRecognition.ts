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

let manuallyStopped =
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

function cleanupRecognition() {
  if (recognition) {
    recognition.onstart =
      null;

    recognition.onend =
      null;

    recognition.onerror =
      null;

    recognition.onresult =
      null;
  }
}

export function startSpeechRecognition({
  language =
    "en-US",

  continuous =
    false,

  interimResults =
    false,

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
        "Speech recognition is not supported on this device."
      );

      return;
    }

    /*
    PREVENT DUPLICATE INSTANCES
    */
    if (
      recognitionActive &&
      recognition
    ) {
      try {
        manuallyStopped =
          true;

        recognition.stop();
      } catch {}

      cleanupRecognition();

      recognition =
        null;

      recognitionActive =
        false;
    }

    manuallyStopped =
      false;

    recognition =
      new Recognition();

    recognition.lang =
      language;

    /*
    MOBILE STABLE SETTINGS
    */
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

        cleanupRecognition();

        recognition =
          null;

        /*
        IGNORE MANUAL STOP
        */
        if (
          manuallyStopped
        ) {
          manuallyStopped =
            false;

          return;
        }

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

        /*
        IGNORE SAFE ERRORS
        */
        if (
          errorMessage ===
            "aborted" ||
          errorMessage ===
            "no-speech"
        ) {
          return;
        }

        onError?.(
          errorMessage
        );
      };

    recognition.onresult =
      (
        event: any
      ) => {
        try {
          let transcript =
            "";

          /*
          ONLY PROCESS NEW RESULTS
          */
          for (
            let i =
              event.resultIndex;
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
              transcript +=
                result[0]
                  .transcript;
            }
          }

          const cleanedTranscript =
            transcript
              .replace(
                /\s+/g,
                " "
              )
              .trim();

          /*
          FILTER VERY SHORT NOISE
          */
          if (
            cleanedTranscript &&
            cleanedTranscript
              .length > 1
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
              : "Unable to process speech result."
          );
        }
      };

    recognition.start();
  } catch (error) {
    recognitionActive =
      false;

    cleanupRecognition();

    recognition =
      null;

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
    manuallyStopped =
      true;

    if (
      recognition
    ) {
      recognition.stop();

      cleanupRecognition();

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
