"use client";

import { Volume2 } from "lucide-react";

type PronunciationButtonProps = {
  text: string;

  onSpeak?: (text: string) => void;

  label?: string;

  fullWidth?: boolean;
};

export default function PronunciationButton({
  text,
  onSpeak,
  label = "Listen Pronunciation",
  fullWidth = true
}: PronunciationButtonProps) {
  const handleSpeak = () => {
    if (onSpeak) {
      onSpeak(text);

      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      utterance
    );
  };

  return (
    <button
      className="primary-button"
      onClick={handleSpeak}
      style={{
        width: fullWidth
          ? "100%"
          : "auto",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        gap: "10px"
      }}
    >
      <Volume2 size={20} />

      {label}
    </button>
  );
}
