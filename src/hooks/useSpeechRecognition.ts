"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import {
  startSpeechRecognition,
  stopSpeechRecognition,
  isSpeechRecognitionSupported
} from "@/services/speech/speechRecognition";

type UseSpeechRecognitionOptions =
  {
    language?: string;

    continuous?: boolean;
  };

export default function useSpeechRecognition({
  language = "en-US"
}: UseSpeechRecognitionOptions = {}) {
  const [
    transcript,
    setTranscript
  ] = useState("");

  const [
    isListening,
    setIsListening
  ] = useState(false);

  const [error, setError] =
    useState("");

  const mountedRef =
    useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current =
        false;

      stopSpeechRecognition();
    };
  }, []);

  const startListening =
    useCallback(() => {
      if (
        !isSpeechRecognitionSupported()
      ) {
        setError(
          "Speech recognition is not supported on this device."
        );

        return;
      }

      setError("");

      startSpeechRecognition({
        language,

        onStart: () => {
          if (
            !mountedRef.current
          ) {
            return;
          }

          setIsListening(true);
        },

        onEnd: () => {
          if (
            !mountedRef.current
          ) {
            return;
          }

          setIsListening(false);
        },

        onError: (
          recognitionError
        ) => {
          if (
            !mountedRef.current
          ) {
            return;
          }

          setError(
            recognitionError instanceof
              Error
              ? recognitionError.message
              : "Speech recognition error"
          );

          setIsListening(false);
        },

        onResult: (
          resultTranscript
        ) => {
          if (
            !mountedRef.current
          ) {
            return;
          }

          setTranscript(
            resultTranscript
          );
        }
      });
    }, [language]);

  const stopListening =
    useCallback(() => {
      stopSpeechRecognition();

      if (
        mountedRef.current
      ) {
        setIsListening(false);
      }
    }, []);

  const resetTranscript =
    useCallback(() => {
      setTranscript("");
    }, []);

  return {
    transcript,

    isListening,

    error,

    supported:
      isSpeechRecognitionSupported(),

    startListening,

    stopListening,

    resetTranscript
  };
}
