"use client";

import {
  useCallback,
  useState
} from "react";

import {
  speakText,
  stopSpeaking,
  pauseSpeaking,
  resumeSpeaking,
  getAvailableVoices
} from "@/services/speech/speechSynthesis";

import { VoiceType } from "@/types";

type SpeakOptions = {
  text: string;

  voiceType?: VoiceType;
};

export default function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [error, setError] =
    useState("");

  const speak = useCallback(
    async ({
      text,
      voiceType = "female"
    }: SpeakOptions) => {
      setError("");

      try {
        await speakText({
          text,

          voiceType,

          onStart: () => {
            setIsSpeaking(true);

            setIsPaused(false);
          },

          onEnd: () => {
            setIsSpeaking(false);

            setIsPaused(false);
          },

          onError: (
            speechError
          ) => {
            setError(
              speechError
            );

            setIsSpeaking(false);

            setIsPaused(false);
          }
        });
      } catch (error) {
        console.error(
          "Speech Hook Error:",
          error
        );

        setError(
          "Voice playback failed."
        );

        setIsSpeaking(false);

        setIsPaused(false);
      }
    },
    []
  );

  const stop = useCallback(() => {
    stopSpeaking();

    setIsSpeaking(false);

    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    pauseSpeaking();

    setIsPaused(true);
  }, []);

  const resume =
    useCallback(() => {
      resumeSpeaking();

      setIsPaused(false);
    }, []);

  const voices =
    getAvailableVoices();

  return {
    isSpeaking,

    isPaused,

    error,

    voices,

    speak,

    stop,

    pause,

    resume
  };
}
