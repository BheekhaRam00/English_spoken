"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  Phone,
  PhoneOff,
  Brain,
  Send,
  RotateCcw
} from "lucide-react";

import {
  AIConversationMode,
  VoiceType,
  ConversationMessage
} from "@/types";

import {
  AudioCallEngine
} from "@/lib/audio-call-engine";

type PracticeScreenProps = {
  engine: AudioCallEngine;

  mode: AIConversationMode;

  voiceType: VoiceType;

  onModeChange: (
    mode: AIConversationMode
  ) => void;

  onVoiceChange: (
    voice: VoiceType
  ) => void;
};

const modes: AIConversationMode[] = [
  "daily",
  "business",
  "interview",
  "advanced"
];

const voices: VoiceType[] = [
  "female",
  "male",
  "professional"
];

export default function PracticeScreen({
  engine,
  mode,
  voiceType,
  onModeChange,
  onVoiceChange
}: PracticeScreenProps) {
  const [
    connected,
    setConnected
  ] = useState(false);

  const [
    listening,
    setListening
  ] = useState(false);

  const [
    messages,
    setMessages
  ] = useState<
    ConversationMessage[]
  >([]);

  const [
    input,
    setInput
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth"
      }
    );
  }, [messages]);

  const startConversation =
    async () => {
      try {
        const aiMessage =
          await engine.connect(
            (message) => {
              setMessages(
                (
                  prev
                ) => [
                  ...prev,
                  message
                ]
              );
            }
          );

        setMessages([
          aiMessage
        ]);

        setConnected(true);
      } catch (error) {
        console.error(
          "Start conversation error:",
          error
        );
      }
    };

  const endConversation =
    () => {
      engine.disconnect();

      setConnected(false);

      setListening(false);
    };

  const sendMessage =
    async () => {
      if (
        !input.trim()
      ) {
        return;
      }

      try {
        setLoading(true);

        await engine.sendTextMessage(
          input,
          (message) => {
            setMessages(
              (
                prev
              ) => [
                ...prev,
                message
              ]
            );
          }
        );

        setInput("");
      } catch (error) {
        console.error(
          "Send message error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  const startListening =
    () => {
      setListening(true);

      engine.startVoiceListening(
        undefined,
        (message) => {
          setMessages(
            (
              prev
            ) => [
              ...prev,
              message
            ]
          );
        },
        () => {
          setListening(false);
        }
      );
    };

  const stopListening =
    () => {
      engine.stopVoiceListening();

      setListening(false);
    };

  const clearConversation =
    () => {
      engine.clearConversation();

      setMessages([]);
    };

  return (
    <main className="page-container">
      <section
        className="fade-in"
        style={{
          display: "flex",
          alignItems:
            "center",
          gap: "14px",
          marginBottom:
            "24px"
        }}
      >
        <Link href="/">
          <button
            className="secondary-button"
            style={{
              width: "54px",
              height: "54px",
              padding: 0,
              borderRadius:
                "18px"
            }}
          >
            <ArrowLeft
              size={22}
            />
          </button>
        </Link>

        <div>
          <h1
            className="page-title"
            style={{
              marginBottom:
                "4px",
              fontSize:
                "34px"
            }}
          >
            AI Practice
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.72)"
            }}
          >
            Practice spoken English naturally.
          </p>
        </div>
      </section>

      <section
        className="fade-in"
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          marginBottom:
            "18px"
        }}
      >
        {modes.map(
          (
            practiceMode
          ) => (
            <button
              key={
                practiceMode
              }
              onClick={() =>
                onModeChange(
                  practiceMode
                )
              }
              style={{
                minWidth:
                  "120px",

                height: "48px",

                borderRadius:
                  "16px",

                background:
                  mode ===
                  practiceMode
                    ? "linear-gradient(90deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.05)",

                color:
                  "#ffffff",

                fontWeight:
                  600,

                textTransform:
                  "capitalize"
              }}
            >
              {
                practiceMode
              }
            </button>
          )
        )}
      </section>

      <section
        className="fade-in"
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          marginBottom:
            "24px"
        }}
      >
        {voices.map(
          (voice) => (
            <button
              key={voice}
              onClick={() =>
                onVoiceChange(
                  voice
                )
              }
              style={{
                minWidth:
                  "140px",

                height: "48px",

                borderRadius:
                  "16px",

                background:
                  voiceType ===
                  voice
                    ? "linear-gradient(90deg, #9333ea, #2563eb)"
                    : "rgba(255,255,255,0.05)",

                color:
                  "#ffffff",

                fontWeight:
                  600,

                textTransform:
                  "capitalize"
              }}
            >
              {voice}
              {" "}
              voice
            </button>
          )
        )}
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "24px",
          marginBottom:
            "24px"
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: "14px",

            marginBottom:
              "20px"
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: "12px"
            }}
          >
            <Brain
              size={24}
            />

            <div>
              <h2
                style={{
                  fontSize:
                    "24px"
                }}
              >
                AI Conversation
              </h2>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.68)"
                }}
              >
                Real-time spoken English practice
              </p>
            </div>
          </div>

          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius:
                "50%",
              background:
                connected
                  ? "#22c55e"
                  : "#ef4444"
            }}
          />
        </div>

        {!connected ? (
          <button
            className="primary-button"
            onClick={
              startConversation
            }
            style={{
              width: "100%",
              height: "60px",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              gap: "12px"
            }}
          >
            <Phone
              size={22}
            />

            Start Conversation
          </button>
        ) : (
          <button
            className="secondary-button"
            onClick={
              endConversation
            }
            style={{
              width: "100%",
              height: "60px",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              gap: "12px"
            }}
          >
            <PhoneOff
              size={22}
            />

            End Conversation
          </button>
        )}
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "24px",

          minHeight:
            "420px",

          marginBottom:
            "24px"
        }}
      >
        <div
          style={{
            display:
              "flex",

            flexDirection:
              "column",

            gap: "16px"
          }}
        >
          {messages.map(
            (message) => (
              <div
                key={
                  message.id
                }
                style={{
                  alignSelf:
                    message.role ===
                    "user"
                      ? "flex-end"
                      : "flex-start",

                  maxWidth:
                    "88%"
                }}
              >
                <div
                  style={{
                    padding:
                      "18px",

                    borderRadius:
                      "22px",

                    background:
                      message.role ===
                      "user"
                        ? "linear-gradient(90deg, #9333ea, #2563eb)"
                        : "rgba(255,255,255,0.06)"
                  }}
                >
                  <p
                    style={{
                      lineHeight:
                        1.8,

                      color:
                        "#ffffff"
                    }}
                  >
                    {
                      message.text
                    }
                  </p>
                </div>

                {message.role ===
                  "ai" && (
                  <button
                    onClick={() =>
                      engine.replayLastAIMessage()
                    }
                    style={{
                      marginTop:
                        "8px",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: "8px",

                      color:
                        "rgba(255,255,255,0.7)"
                    }}
                  >
                    <Volume2
                      size={16}
                    />

                    Replay
                  </button>
                )}
              </div>
            )
          )}

          <div
            ref={
              messagesEndRef
            }
          />
        </div>
      </section>

      <section
        className="fade-in"
        style={{
          display: "grid",
          gap: "16px"
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "18px",

            display: "flex",

            gap: "12px"
          }}
        >
          <input
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            placeholder="Type your message..."
            style={{
              flex: 1,

              height: "54px",

              borderRadius:
                "18px",

              background:
                "rgba(255,255,255,0.05)",

              color:
                "#ffffff",

              padding:
                "0 18px",

              border:
                "1px solid rgba(255,255,255,0.08)"
            }}
          />

          <button
            onClick={
              sendMessage
            }
            disabled={
              loading
            }
            className="primary-button"
            style={{
              width: "58px",
              height: "54px",

              padding: 0,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center"
            }}
          >
            <Send
              size={20}
            />
          </button>
        </div>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "1fr 1fr",

            gap: "14px"
          }}
        >
          {!listening ? (
            <button
              className="primary-button"
              onClick={
                startListening
              }
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap: "10px"
              }}
            >
              <Mic
                size={20}
              />

              Start Mic
            </button>
          ) : (
            <button
              className="secondary-button"
              onClick={
                stopListening
              }
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap: "10px"
              }}
            >
              <MicOff
                size={20}
              />

              Stop Mic
            </button>
          )}

          <button
            className="secondary-button"
            onClick={
              clearConversation
            }
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              gap: "10px"
            }}
          >
            <RotateCcw
              size={20}
            />

            Reset Chat
          </button>
        </div>
      </section>
    </main>
  );
              }
