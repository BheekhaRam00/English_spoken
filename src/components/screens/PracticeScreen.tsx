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
        input.trim();

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

  function handleReplay() {
    engine.replayLastAIMessage();
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <div className="mx-auto w-full max-w-3xl px-3 py-4">
        <section className="mb-4 flex items-center gap-3">
          <Link href="/">
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <ArrowLeft
                size={18}
              />
            </button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              AI Practice
            </h1>

            <p className="text-xs text-white/60">
              Real spoken English practice
            </p>
          </div>
        </section>

        <section className="mb-3 flex gap-2 overflow-x-auto pb-1">
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
                className={`rounded-2xl px-4 py-2 text-xs font-semibold capitalize whitespace-nowrap ${
                  mode ===
                  practiceMode
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                {
                  practiceMode
                }
              </button>
            )
          )}
        </section>

        <section className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {VOICES.map(
            (voice) => (
              <button
                key={voice}
                onClick={() =>
                  onVoiceChange(
                    voice
                  )
                }
                className={`rounded-2xl px-4 py-2 text-xs font-semibold whitespace-nowrap ${
                  voiceType ===
                  voice
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                {voice}
              </button>
            )
          )}
        </section>

        <section className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600">
                <Brain
                  size={20}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  AI Conversation
                </h2>

                <p className="text-xs text-white/60">
                  Practice naturally
                </p>
              </div>
            </div>

            <div
              className={`h-3 w-3 rounded-full ${
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold"
            >
              <Phone
                size={18}
              />

              Start Conversation
            </button>
          ) : (
            <button
              onClick={
                handleEndConversation
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold"
            >
              <PhoneOff
                size={18}
              />

              End Conversation
            </button>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="mb-4 flex h-[300px] flex-col gap-3 overflow-y-auto">
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
                  <div className="max-w-[85%]">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.role ===
                        "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600"
                          : "border border-white/10 bg-white/5"
                      }`}
                    >
                      {message.text}
                    </div>

                    {message.role ===
                      "ai" && (
                      <button
                        onClick={
                          handleReplay
                        }
                        className="mt-1 flex items-center gap-1 text-xs text-white/60"
                      >
                        <Volume2
                          size={14}
                        />

                        Replay
                      </button>
                    )}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Loader2
                  className="animate-spin"
                  size={16}
                />

                AI replying...
              </div>
            )}

            <div
              ref={
                messagesEndRef
              }
            />
          </div>

          {error && (
            <div className="mb-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-2">
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
              placeholder="Type here..."
              className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/40"
            />

            <button
              onClick={
                handleSendMessage
              }
              disabled={
                loading
              }
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 disabled:opacity-50"
            >
              <Send
                size={18}
              />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {!listening ? (
              <button
                onClick={
                  handleStartListening
                }
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold"
              >
                <Mic
                  size={18}
                />

                Mic
              </button>
            ) : (
              <button
                onClick={
                  handleStopListening
                }
                className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold"
              >
                <MicOff
                  size={18}
                />

                Stop
              </button>
            )}

            <button
              onClick={
                handleResetConversation
              }
              className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold"
            >
              <RotateCcw
                size={18}
              />

              Reset
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
