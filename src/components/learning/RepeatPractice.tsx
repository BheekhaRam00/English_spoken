"use client";

import {
  Mic,
  RotateCcw
} from "lucide-react";

import { useState } from "react";

type RepeatPracticeProps = {
  sentence: string;

  onReplay?: () => void;
};

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      transcript: string;
    }[];
  };
}

interface SpeechRecognitionInstance {
  lang: string;

  interimResults: boolean;

  maxAlternatives: number;

  onstart: (() => void) | null;

  onend: (() => void) | null;

  onerror: (() => void) | null;

  onresult:
    | ((
        event: SpeechRecognitionEvent
      ) => void)
    | null;

  start: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

type BrowserWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;

  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export default function RepeatPractice({
  sentence,
  onReplay
}: RepeatPracticeProps) {
  const [isListening, setIsListening] =
    useState(false);

  const [userSpeech, setUserSpeech] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  const startListening = () => {
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
      alert(
        "Speech recognition is not supported on this device."
      );

      return;
    }

    const recognition =
      new SpeechRecognitionAPI();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);

      setFeedback(
        "Could not recognize your voice. Please try again."
      );
    };

    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      const transcript =
        event.results[0][0]
          .transcript;

      setUserSpeech(
        transcript
      );

      generateFeedback(
        transcript
      );
    };

    recognition.start();
  };

  const generateFeedback = (
    transcript: string
  ) => {
    const original =
      sentence.toLowerCase();

    const spoken =
      transcript.toLowerCase();

    if (original === spoken) {
      setFeedback(
        "Excellent pronunciation and sentence clarity."
      );

      return;
    }

    if (
      spoken.length >
      original.length * 0.7
    ) {
      setFeedback(
        "Good attempt. Try speaking slightly more clearly and slowly."
      );

      return;
    }

    setFeedback(
      "Keep practicing. Listen carefully and repeat again."
    );
  };

  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "26px",

        background:
          "linear-gradient(90deg, rgba(147,51,234,0.12), rgba(37,99,235,0.12))"
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: "12px",

          marginBottom: "16px"
        }}
      >
        <RotateCcw size={24} />

        <h3
          style={{
            fontSize: "24px",

            fontWeight: 700
          }}
        >
          Repeat Practice
        </h3>
      </div>

      <p
        style={{
          color:
            "rgba(255,255,255,0.76)",

          lineHeight: 1.8,

          marginBottom: "24px"
        }}
      >
        Speak the sentence loudly and clearly to improve fluency and
        pronunciation.
      </p>

      <div
        className="glass-card"
        style={{
          padding: "20px",

          marginBottom: "22px"
        }}
      >
        <p
          style={{
            fontSize: "18px",

            lineHeight: 1.8,

            color: "#ffffff"
          }}
        >
          {sentence}
        </p>
      </div>

      <div
        style={{
          display: "grid",

          gap: "14px"
        }}
      >
        <button
          onClick={
            startListening
          }
          disabled={
            isListening
          }
          className="primary-button"
          style={{
            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            gap: "10px",

            opacity:
              isListening
                ? 0.7
                : 1
          }}
        >
          <Mic size={20} />

          {isListening
            ? "Listening..."
            : "Start Speaking"}
        </button>

        <button
          onClick={onReplay}
          className="secondary-button"
          style={{
            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            gap: "10px"
          }}
        >
          <RotateCcw size={18} />

          Replay Sentence
        </button>
      </div>

      {userSpeech && (
        <div
          className="glass-card fade-in"
          style={{
            marginTop: "24px",

            padding: "20px"
          }}
        >
          <h4
            style={{
              marginBottom:
                "12px",

              fontSize: "18px"
            }}
          >
            Your Speech
          </h4>

          <p
            style={{
              color:
                "rgba(255,255,255,0.84)",

              lineHeight: 1.8,

              marginBottom:
                "18px"
            }}
          >
            {userSpeech}
          </p>

          <div
            style={{
              padding: "16px",

              borderRadius:
                "18px",

              background:
                "rgba(34,197,94,0.12)",

              border:
                "1px solid rgba(34,197,94,0.18)"
            }}
          >
            <p
              style={{
                color:
                  "#ffffff",

                lineHeight: 1.7
              }}
            >
              {feedback}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
