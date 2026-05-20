"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Send,
  Volume2,
  Bot,
  User,
  Sparkles
} from "lucide-react";

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
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

export default function PracticePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text: "Hello! Tell me about your work or daily routine."
    }
  ]);

  const [input, setInput] = useState("");

  const [isListening, setIsListening] = useState(false);

  const [selectedVoice, setSelectedVoice] =
    useState("Female Voice");

  const recognitionRef = useRef<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    speakText(
      "Hello! Tell me about your work or daily routine."
    );
  }, []);

  const speakText = (text: string) => {
    if (typeof window === "undefined") {
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch =
      selectedVoice === "Female Voice"
        ? 1.1
        : 0.95;

    const voices =
      window.speechSynthesis.getVoices();

    const selected =
      selectedVoice === "Female Voice"
        ? voices.find((voice) =>
            voice.name.toLowerCase().includes("female")
          )
        : voices.find((voice) =>
            voice.name.toLowerCase().includes("male")
          );

    if (selected) {
      utterance.voice = selected;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const generateAIReply = (
    userMessage: string
  ): string => {
    const lower = userMessage.toLowerCase();

    if (
      lower.includes("job") ||
      lower.includes("work")
    ) {
      return "That sounds interesting. What are your main responsibilities at work?";
    }

    if (
      lower.includes("english")
    ) {
      return "Your English is improving well. Keep speaking confidently every day.";
    }

    if (
      lower.includes("business")
    ) {
      return "Business communication becomes stronger with regular practice and clear speaking.";
    }

    return "That's great. Can you explain a little more in English?";
  };

  const sendMessage = (
    customMessage?: string
  ) => {
    const finalMessage =
      customMessage || input.trim();

    if (!finalMessage) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: finalMessage
    };

    const aiReply = generateAIReply(
      finalMessage
    );

    const aiMessage: Message = {
      id: Date.now() + 1,
      role: "ai",
      text: aiReply
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      aiMessage
    ]);

    speakText(aiReply);

    setInput("");
  };

  const startListening = () => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

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
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      sendMessage(transcript);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();

    setIsListening(false);
  };

  return (
    <main className="page-container">
      <section
        className="fade-in"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "24px"
        }}
      >
        <Link href="/">
          <button
            className="secondary-button"
            style={{
              width: "54px",
              height: "54px",
              padding: 0,
              borderRadius: "18px"
            }}
          >
            <ArrowLeft size={22} />
          </button>
        </Link>

        <div>
          <h1
            className="page-title"
            style={{
              marginBottom: "4px",
              fontSize: "34px"
            }}
          >
            Practice Conversation
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.72)"
            }}
          >
            Speak or type naturally with AI.
          </p>
        </div>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "24px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          {[
            "Female Voice",
            "Male Voice",
            "Professional Voice"
          ].map((voice) => (
            <button
              key={voice}
              onClick={() =>
                setSelectedVoice(voice)
              }
              style={{
                padding: "12px 18px",

                borderRadius: "16px",

                background:
                  selectedVoice === voice
                    ? "linear-gradient(90deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.06)",

                color: "#ffffff",

                fontWeight: 600,

                transition: "0.2s ease"
              }}
            >
              {voice}
            </button>
          ))}
        </div>
      </section>

      <section
        className="glass-card fade-in hide-scrollbar"
        style={{
          padding: "24px",

          minHeight: "420px",

          display: "flex",
          flexDirection: "column",

          gap: "18px",

          overflowY: "auto",

          marginBottom: "24px"
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",

              justifyContent:
                message.role === "user"
                  ? "flex-end"
                  : "flex-start"
            }}
          >
            <div
              style={{
                maxWidth: "85%",

                padding: "16px",

                borderRadius: "22px",

                background:
                  message.role === "user"
                    ? "linear-gradient(90deg, rgba(147,51,234,0.22), rgba(37,99,235,0.22))"
                    : "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.06)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",

                  marginBottom: "10px"
                }}
              >
                {message.role === "ai" ? (
                  <Bot size={18} />
                ) : (
                  <User size={18} />
                )}

                <span
                  style={{
                    fontWeight: 600
                  }}
                >
                  {message.role === "ai"
                    ? "AI"
                    : "You"}
                </span>
              </div>

              <p
                style={{
                  lineHeight: 1.8,
                  color:
                    message.role === "ai"
                      ? "rgba(255,255,255,0.82)"
                      : "#ffffff"
                }}
              >
                {message.text}
              </p>

              {message.role === "ai" && (
                <button
                  onClick={() =>
                    speakText(message.text)
                  }
                  style={{
                    marginTop: "14px",

                    width: "42px",
                    height: "42px",

                    borderRadius: "14px",

                    background:
                      "rgba(255,255,255,0.06)",

                    color: "#ffffff",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Volume2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "24px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            marginBottom: "24px"
          }}
        >
          <div className="waveform">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <button
            onClick={
              isListening
                ? stopListening
                : startListening
            }
            style={{
              width: "88px",
              height: "88px",

              borderRadius: "999px",

              background: isListening
                ? "linear-gradient(90deg, #ef4444, #dc2626)"
                : "linear-gradient(90deg, #9333ea, #2563eb)",

              color: "#ffffff",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              boxShadow:
                "0 0 40px rgba(147, 51, 234, 0.25)"
            }}
          >
            {isListening ? (
              <MicOff size={34} />
            ) : (
              <Mic size={34} />
            )}
          </button>
        </div>

        <p
          style={{
            textAlign: "center",

            marginTop: "18px",

            color: "rgba(255,255,255,0.72)",

            lineHeight: 1.7
          }}
        >
          {isListening
            ? "Listening... Speak in English."
            : "Tap the microphone and start speaking."}
        </p>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "20px"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center"
          }}
        >
          <input
            type="text"
            placeholder="Type your message in English..."
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            style={{
              flex: 1,

              height: "58px",

              borderRadius: "18px",

              padding: "0 18px",

              background:
                "rgba(255,255,255,0.05)",

              color: "#ffffff",

              fontSize: "15px"
            }}
          />

          <button
            onClick={() => sendMessage()}
            style={{
              width: "58px",
              height: "58px",

              borderRadius: "18px",

              background:
                "linear-gradient(90deg, #9333ea, #2563eb)",

              color: "#ffffff",

              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Send size={22} />
          </button>
        </div>
      </section>

      <section
        className="fade-in"
        style={{
          marginTop: "24px"
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "22px",

            background:
              "linear-gradient(90deg, rgba(147,51,234,0.12), rgba(37,99,235,0.12))"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",

              marginBottom: "12px"
            }}
          >
            <Sparkles size={22} />

            <h3
              style={{
                fontSize: "22px"
              }}
            >
              Practice Tip
            </h3>
          </div>

          <p
            style={{
              color: "rgba(255,255,255,0.76)",
              lineHeight: 1.8
            }}
          >
            Do not worry about mistakes. Speak slowly and confidently
            every day to improve fluency naturally.
          </p>
        </div>
      </section>
    </main>
  );
            }
