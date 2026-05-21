"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Brain,
  Loader2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RotateCcw,
  Send,
  Volume2
} from "lucide-react";

import {
  AIConversationMode,
  ConversationMessage,
  VoiceType
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

const MODES: AIConversationMode[] =
  [
    "daily",
    "business",
    "interview",
    "advanced"
  ];

const VOICES: VoiceType[] =
  [
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
    loading,
    setLoading
  ] = useState(false);

  const [
    input,
    setInput
  ] = useState("");

  const [
    messages,
    setMessages
  ] = useState<
    ConversationMessage[]
  >([]);

  const [
    error,
    setError
  ] = useState("");

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

  async function handleStartConversation() {
    try {
      setError("");

      const aiMessage =
        await engine.connect(
          (message) => {
            setMessages(
              (
                previous
              ) => [
                ...previous,
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
        "Conversation Start Error:",
        error
      );

      setError(
        "Unable to start conversation."
      );
    }
  }

  function handleEndConversation() {
    engine.disconnect();

    setConnected(false);

    setListening(false);
  }

  async function handleSendMessage() {
    try {
      if (
        !input.trim()
      ) {
        return;
      }

      setError("");

      setLoading(true);

      const currentInput =
        input;

      setInput("");

      await engine.sendTextMessage(
        currentInput,
        (message) => {
          setMessages(
            (
              previous
            ) => [
              ...previous,
              message
            ]
          );
        }
      );
    } catch (error) {
      console.error(
        "Send Message Error:",
        error
      );

      setError(
        "Unable to send message."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleStartListening() {
    try {
      setError("");

      setListening(true);

      engine.startVoiceListening(
        undefined,
        (message) => {
          setMessages(
            (
              previous
            ) => [
              ...previous,
              message
            ]
          );
        },
        (errorMessage) => {
          setListening(false);

          setError(
            errorMessage
          );
        }
      );
    } catch (error) {
      console.error(
        "Voice Listening Error:",
        error
      );

      setListening(false);

      setError(
        "Unable to start microphone."
      );
    }
  }

  function handleStopListening() {
    engine.stopVoiceListening();

    setListening(false);
  }

  function handleResetConversation() {
    engine.clearConversation();

    setMessages([]);

    setError("");
  }

  function handleReplay(
    text: string
  ) {
    engine.replayLastAIMessage();

    console.log(
      "Replay:",
      text
    );
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-6">
        <section className="flex items-center gap-4">
          <Link href="/">
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10">
              <ArrowLeft
                size={20}
              />
            </button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold">
              AI Practice
            </h1>

            <p className="mt-1 text-sm text-white/70">
              Practice spoken English naturally with AI.
            </p>
          </div>
        </section>

        <section className="flex flex-wrap gap-3">
          {MODES.map(
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
                className={`rounded-2xl px-5 py-3 text-sm font-semibold capitalize transition ${
                  mode ===
                  practiceMode
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {
                  practiceMode
                }
              </button>
            )
          )}
        </section>

        <section className="flex flex-wrap gap-3">
          {VOICES.map(
            (voice) => (
              <button
                key={voice}
                onClick={() =>
                  onVoiceChange(
                    voice
                  )
                }
                className={`rounded-2xl px-5 py-3 text-sm font-semibold capitalize transition ${
                  voiceType ===
                  voice
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {voice} Voice
              </button>
            )
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600">
                <Brain
                  size={24}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  AI Conversation
                </h2>

                <p className="text-sm text-white/70">
                  Real-time English speaking practice
                </p>
              </div>
            </div>

            <div
              className={`h-4 w-4 rounded-full ${
                connected
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
          </div>

          {!connected ? (
            <button
              onClick={
                handleStartConversation
              }
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold transition hover:opacity-90"
            >
              <Phone
                size={20}
              />

              Start Conversation
            </button>
          ) : (
            <button
              onClick={
                handleEndConversation
              }
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 font-semibold transition hover:bg-white/10"
            >
              <PhoneOff
                size={20}
              />

              End Conversation
            </button>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex max-h-[520px] min-h-[420px] flex-col gap-4 overflow-y-auto pr-1">
            {messages.map(
              (message) => (
                <div
                  key={
                    message.id
                  }
                  className={`flex ${
                    message.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="max-w-[88%]">
                    <div
                      className={`rounded-3xl px-5 py-4 text-[15px] leading-7 ${
                        message.role ===
                        "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600"
                          : "border border-white/10 bg-white/5"
                      }`}
                    >
                      {
                        message.text
                      }
                    </div>

                    {message.role ===
                      "ai" && (
                      <button
                        onClick={() =>
                          handleReplay(
                            message.text
                          )
                        }
                        className="mt-2 flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
                      >
                        <Volume2
                          size={16}
                        />

                        Replay
                      </button>
                    )}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="flex items-center gap-3 text-white/70">
                <Loader2
                  className="animate-spin"
                  size={18}
                />

                AI is replying...
              </div>
            )}

            <div
              ref={
                messagesEndRef
              }
            />
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(event) =>
                setInput(
                  event.target
                    .value
                )
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                    "Enter" &&
                  !loading
                ) {
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/40"
            />

            <button
              onClick={
                handleSendMessage
              }
              disabled={
                loading
              }
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 transition hover:opacity-90 disabled:opacity-50"
            >
              <Send
                size={20}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {!listening ? (
              <button
                onClick={
                  handleStartListening
                }
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold transition hover:opacity-90"
              >
                <Mic
                  size={20}
                />

                Start Mic
              </button>
            ) : (
              <button
                onClick={
                  handleStopListening
                }
                className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 font-semibold transition hover:bg-white/10"
              >
                <MicOff
                  size={20}
                />

                Stop Mic
              </button>
            )}

            <button
              onClick={
                handleResetConversation
              }
              className="flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 font-semibold transition hover:bg-white/10"
            >
              <RotateCcw
                size={20}
              />

              Reset Chat
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
