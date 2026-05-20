"use client";

import { useCallback, useState } from "react";

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

  rate?: number;

  pitch?: number;

  volume?: number;
};

export default function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [error, setError] =
    useState("");

  const speak = useCallback(
    ({
      text,
      voiceType = "female",
      rate = 0.95,
      pitch = 1,
      volume = 1
    }: SpeakOptions) => {
      setError("");

      speakText({
        text,

        voiceType,

        rate,

        pitch,

        volume,

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
