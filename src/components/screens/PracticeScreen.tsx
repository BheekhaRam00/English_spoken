"use client";

import {
  useEffect,
  useMemo,
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

  const messagesContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  /*
  SAFE AUTO SCROLL
  */
  useEffect(() => {
    if (
      messagesContainerRef.current
    ) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current
          .scrollHeight;
    }
  }, [messages, loading]);

  /*
  PREVENT DUPLICATE MESSAGE INSERT
  */
  function appendMessage(
    message: ConversationMessage
  ) {
    setMessages(
      (previous) => {
        const alreadyExists =
          previous.some(
            (
              item
            ) =>
              item.id ===
              message.id
          );

        if (
          alreadyExists
        ) {
          return previous;
        }

        return [
          ...previous,
          message
        ];
      }
    );
  }

  /*
  START CONVERSATION
  */
  async function handleStartConversation() {
    try {
      if (
        connected
      ) {
        return;
      }

      setError("");

      setMessages([]);

      const aiMessage =
        await engine.connect(
          (
            message
          ) => {
            appendMessage(
              message
            );
          }
        );

      setMessages([
        aiMessage
      ]);

      setConnected(true);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
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

  /*
  END CONVERSATION
  */
  function handleEndConversation() {
    try {
      engine.disconnect();

      setConnected(false);

      setListening(false);

      setLoading(false);
    } catch (error) {
      console.error(
        "Conversation End Error:",
        error
      );
    }
  }

  /*
  SEND MESSAGE
  */
  async function handleSendMessage() {
    try {
      const cleanedInput =
        input.trim();

      if (
        !cleanedInput ||
        loading ||
        !connected
      ) {
        return;
      }

      setError("");

      setLoading(true);

      setInput("");

      await engine.sendTextMessage(
        cleanedInput,
        (
          message
        ) => {
          appendMessage(
            message
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

  /*
  START MIC
  */
  function handleStartListening() {
    try {
      if (
        listening ||
        !connected
      ) {
        return;
      }

      setError("");

      setListening(true);

      engine.startVoiceListening(
        undefined,
        (
          message
        ) => {
          appendMessage(
            message
          );
        },
        (
          errorMessage
        ) => {
          setListening(
            false
          );

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

  /*
  STOP MIC
  */
  function handleStopListening() {
    try {
      engine.stopVoiceListening();

      setListening(false);
    } catch (error) {
      console.error(
        "Stop Listening Error:",
        error
      );
    }
  }

  /*
  RESET CHAT
  */
  function handleResetConversation() {
    try {
      engine.clearConversation();

      setMessages([]);

      setError("");

      setLoading(false);

      setListening(false);
    } catch (error) {
      console.error(
        "Reset Conversation Error:",
        error
      );
    }
  }

  /*
  REPLAY
  */
  function handleReplay() {
    try {
      engine.replayLastAIMessage();
    } catch (error) {
      console.error(
        "Replay Error:",
        error
      );
    }
  }

  /*
  EMPTY STATE
  */
  const showEmptyState =
    useMemo(() => {
      return (
        connected &&
        messages.length === 0
      );
    }, [
      connected,
      messages
    ]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#0f172a] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-3 py-4">
        {/* HEADER */}
        <section className="mb-4 flex items-center gap-3">
          <Link href="/">
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10 active:scale-95">
              <ArrowLeft
                size={18}
              />
            </button>
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold">
              AI Practice
            </h1>

            <p className="text-xs text-white/60">
              Real spoken English practice
            </p>
          </div>
        </section>

        {/* MODE SELECT */}
        <section className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-semibold capitalize transition active:scale-95 ${
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

        {/* VOICES */}
        <section className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {VOICES.map(
            (voice) => (
              <button
                key={voice}
                onClick={() =>
                  onVoiceChange(
                    voice
                  )
                }
                className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-semibold capitalize transition active:scale-95 ${
                  voiceType ===
                  voice
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {voice}
              </button>
            )
          )}
        </section>

        {/* CONTROL CARD */}
        <section className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600">
                <Brain
                  size={20}
                />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">
                  AI Conversation
                </h2>

                <p className="text-xs text-white/60">
                  Practice naturally
                </p>
              </div>
            </div>

            <div
              className={`h-3 w-3 shrink-0 rounded-full ${
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold transition hover:opacity-90 active:scale-[0.99]"
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold transition hover:bg-white/10 active:scale-[0.99]"
            >
              <PhoneOff
                size={18}
              />

              End Conversation
            </button>
          )}
        </section>

        {/* CHAT */}
        <section className="flex min-h-0 flex-1 flex-col rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          {/* MESSAGE AREA */}
          <div
            ref={
              messagesContainerRef
            }
            className="flex h-[340px] flex-col gap-3 overflow-y-auto pr-1"
          >
            {showEmptyState ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="max-w-[260px] text-center">
                  <Brain
                    size={32}
                    className="mx-auto mb-3 text-white/50"
                  />

                  <p className="text-sm text-white/60">
                    Start speaking or type a message to practice English.
                  </p>
                </div>
              </div>
            ) : null}

            {messages.map(
              (
                message
              ) => (
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
                      className={`break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
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
                        onClick={
                          handleReplay
                        }
                        className="mt-1 flex items-center gap-1 text-xs text-white/60 transition hover:text-white"
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
          </div>

          {/* ERROR */}
          {error ? (
            <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          ) : null}

          {/* INPUT */}
          <div className="mt-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(
                event
              ) =>
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
              disabled={
                !connected
              }
              placeholder={
                connected
                  ? "Type here..."
                  : "Start conversation first..."
              }
              className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-purple-500/40 disabled:opacity-50"
            />

            <button
              onClick={
                handleSendMessage
              }
              disabled={
                loading ||
                !connected
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 transition hover:opacity-90 disabled:opacity-50 active:scale-95"
            >
              <Send
                size={18}
              />
            </button>
          </div>

          {/* ACTIONS */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {!listening ? (
              <button
                onClick={
                  handleStartListening
                }
                disabled={
                  !connected
                }
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50 active:scale-[0.99]"
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
                className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold transition hover:bg-white/10 active:scale-[0.99]"
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
              className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold transition hover:bg-white/10 active:scale-[0.99]"
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
