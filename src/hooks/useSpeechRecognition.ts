"use client";

import { useCallback, useRef, useState } from "react";

import {
  startSpeechRecognition,
  stopSpeechRecognition,
  isSpeechRecognitionSupported
} from "@/services/speech/speechRecognition";

type UseSpeechRecognitionOptions = {
  language?: string;

  onTranscript?: (
    transcript: string
  ) => void;

  onError?: (
    error: string
  ) => void;
};

export default function useSpeechRecognition({
  language = "en-US",

  onTranscript,

  onError
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] =
    useState(false);

  const [transcript, setTranscript] =
    useState("");

  const [confidence, setConfidence] =
    useState(0);

  const [error, setError] =
    useState("");

  const mountedRef = useRef(true);

  const startListening =
    useCallback(() => {
      if (
        !isSpeechRecognitionSupported()
      ) {
        const message =
          "Speech recognition is not supported on this device.";

        setError(message);

        onError?.(message);

        return;
      }

      setError("");

      startSpeechRecognition({
        language,

        onStart: () => {
          if (!mountedRef.current) {
            return;
          }

          setIsListening(true);
        },

        onEnd: () => {
          if (!mountedRef.current) {
            return;
          }

          setIsListening(false);
        },

        onError: (
          recognitionError
        ) => {
          if (!mountedRef.current) {
            return;
          }

          setError(
            recognitionError
          );

          setIsListening(false);

          onError?.(
            recognitionError
          );
        },

        onResult: (result) => {
          if (!mountedRef.current) {
            return;
          }

          setTranscript(
            result.transcript
          );

          setConfidence(
            result.confidence || 0
          );

          onTranscript?.(
            result.transcript
          );
        }
      });
    }, [
      language,
      onTranscript,
      onError
    ]);

  const stopListening =
    useCallback(() => {
      stopSpeechRecognition();

      setIsListening(false);
    }, []);

  const resetTranscript =
    useCallback(() => {
      setTranscript("");

      setConfidence(0);

      setError("");
    }, []);

  return {
    supported:
      isSpeechRecognitionSupported(),

    isListening,

    transcript,

    confidence,

    error,

    startListening,

    stopListening,

    resetTranscript
  };
}
