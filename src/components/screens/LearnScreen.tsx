"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Volume2,
  CheckCircle2,
  Sparkles,
  Brain,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

import {
  LearningMode
} from "@/types";

import {
  speakText
} from "@/services/speech/speechSynthesis";

type LearnScreenProps = {
  mode: LearningMode;

  onModeChange: (
    mode: LearningMode
  ) => void;
};

const modes: LearningMode[] = [
  "beginner",
  "daily",
  "office",
  "business",
  "interview",
  "advanced"
];

type VocabularyItem = {
  word: string;

  meaning: string;

  pronunciation: string;
};

type LessonSentence = {
  english: string;

  hindi: string;
};

type LessonData = {
  title?: string;

  category?: string;

  sentences: LessonSentence[];

  vocabulary?: VocabularyItem[];

  pronunciationTip?: string;
};

type DebugInfo = {
  apiStatus?: number;

  success?: boolean;

  source?: string;

  mode?: string;

  model?: string;

  error?: string;

  generatedAt?: number;

  sentenceCount?: number;

  vocabularyCount?: number;
};

export default function LearnScreen({
  mode,
  onModeChange
}: LearnScreenProps) {
  const [lesson, setLesson] =
    useState<LessonData | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [debugInfo,
    setDebugInfo] =
    useState<DebugInfo | null>(
      null
    );

  const [
    currentSentenceIndex,
    setCurrentSentenceIndex
  ] = useState(0);

  const [
    autoPlayedSentence,
    setAutoPlayedSentence
  ] = useState("");

  const autoplayTimeoutRef =
    useRef<NodeJS.Timeout | null>(
      null
    );

  async function fetchLesson() {
    try {
      setLoading(true);

      setError("");

      setCurrentSentenceIndex(
        0
      );

      setAutoPlayedSentence(
        ""
      );

      const response =
        await fetch(
          `/api/lesson?mode=${mode}&t=${Date.now()}`,
          {
            cache:
              "no-store"
          }
        );

      const data =
        await response.json();

      console.log(
        "LESSON API RESPONSE:",
        data
      );

      const lessonData =
        data?.lesson;

      setDebugInfo({
        apiStatus:
          response.status,

        success:
          Boolean(
            data?.success
          ),

        source:
          data?.source ||
          "unknown",

        mode:
          data?.mode,

        model:
          data?.model,

        error:
          data?.error ||
          "",

        generatedAt:
          data?.generatedAt,

        sentenceCount:
          lessonData
            ?.sentences
            ?.length || 0,

        vocabularyCount:
          lessonData
            ?.vocabulary
            ?.length || 0
      });

      if (
        !response.ok ||
        !data?.success ||
        !lessonData
      ) {
        throw new Error(
          data?.message ||
          "Lesson load failed."
        );
      }

      if (
        !Array.isArray(
          lessonData.sentences
        )
      ) {
        throw new Error(
          "Invalid lesson format."
        );
      }

      setLesson(
        lessonData
      );
    } catch (error: any) {
      console.error(
        "Lesson Fetch Error:",
        error
      );

      setError(
        error?.message ||
        "Unable to generate lesson."
      );

      setDebugInfo({
        apiStatus: 500,

        success: false,

        error:
          error?.message ||
          "Unknown frontend error"
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLesson();
  }, [mode]);

  const currentSentence =
    lesson?.sentences?.[
      currentSentenceIndex
    ];

  /*
  AUTO PLAY
  */
  useEffect(() => {
    if (
      !currentSentence
    ) {
      return;
    }

    if (
      autoPlayedSentence ===
      currentSentence.english
    ) {
      return;
    }

    if (
      autoplayTimeoutRef.current
    ) {
      clearTimeout(
        autoplayTimeoutRef.current
      );
    }

    autoplayTimeoutRef.current =
      setTimeout(() => {
        speakText({
          text:
            currentSentence.english
        });

        setAutoPlayedSentence(
          currentSentence.english
        );
      }, 500);

    return () => {
      if (
        autoplayTimeoutRef.current
      ) {
        clearTimeout(
          autoplayTimeoutRef.current
        );
      }
    };
  }, [
    currentSentence,
    autoPlayedSentence
  ]);

  function handleNextSentence() {
    if (
      !lesson
    ) {
      return;
    }

    if (
      currentSentenceIndex <
      lesson.sentences.length -
        1
    ) {
      setCurrentSentenceIndex(
        (
          previous
        ) =>
          previous + 1
      );
    }
  }

  function handlePreviousSentence() {
    if (
      currentSentenceIndex >
      0
    ) {
      setCurrentSentenceIndex(
        (
          previous
        ) =>
          previous - 1
      );
    }
  }

  function handleReplay() {
    if (
      !currentSentence
    ) {
      return;
    }

    speakText({
      text:
        currentSentence.english
    });
  }

  if (
    loading &&
    !lesson
  ) {
    return (
      <main className="min-h-screen bg-[#0f172a] px-4 py-5 text-white">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <Loader2
            size={34}
            className="animate-spin"
          />

          <h2 className="mt-5 text-xl font-semibold">
            Generating Lesson
          </h2>

          <p className="mt-2 text-sm text-white/60">
            Creating spoken English practice...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0f172a] px-3 py-4 text-white">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">

        {/* HEADER */}
        <section className="flex items-center gap-3">
          <Link href="/">
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <ArrowLeft
                size={18}
              />
            </button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              Learn English
            </h1>

            <p className="text-xs text-white/60">
              AI spoken English lessons
            </p>
          </div>
        </section>

        {/* MODES */}
        <section className="flex gap-2 overflow-x-auto pb-1">
          {modes.map(
            (
              learningMode
            ) => (
              <button
                key={
                  learningMode
                }
                onClick={() =>
                  onModeChange(
                    learningMode
                  )
                }
                className={`rounded-2xl px-4 py-2 text-sm font-semibold capitalize whitespace-nowrap transition ${
                  mode ===
                  learningMode
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "border border-white/10 bg-white/5"
                }`}
              >
                {
                  learningMode
                }
              </button>
            )
          )}
        </section>

        {/* ERROR */}
        {error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-red-300"
              />

              <div>
                <h3 className="text-sm font-semibold text-red-200">
                  Error
                </h3>

                <p className="mt-1 text-sm text-red-100">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : null}

              {/* DEBUG PANEL */}
{debugInfo ? (
  <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-4">

    <div className="mb-3 flex items-center gap-2">
      <Brain
        size={16}
        className="text-yellow-300"
      />

      <h3 className="text-sm font-semibold text-yellow-200">
        System Debug
      </h3>
    </div>

    <div className="space-y-2 text-xs">

      <div className="flex items-center justify-between">
        <span className="text-white/60">
          API Status
        </span>

        <span className="font-semibold">
          {debugInfo.apiStatus}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-white/60">
          Request
        </span>

        <span className={`font-semibold ${
          debugInfo.success
            ? "text-green-300"
            : "text-red-300"
        }`}>
          {debugInfo.success
            ? "Success"
            : "Failed"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-white/60">
          Lesson Source
        </span>

        <span className="font-semibold text-yellow-200">
          {debugInfo.source || "unknown"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-white/60">
          AI Model
        </span>

        <span className="max-w-[180px] truncate text-right text-white/90">
          {debugInfo.model || "unknown"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-white/60">
          Sentences
        </span>

        <span className="font-semibold">
          {debugInfo.sentenceCount}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-white/60">
          Vocabulary
        </span>

        <span className="font-semibold">
          {debugInfo.vocabularyCount}
        </span>
      </div>

      {debugInfo.error ? (
        <div className="mt-3 rounded-2xl bg-red-500/10 p-3">
          <p className="text-[11px] leading-5 text-red-200">
            {debugInfo.error}
          </p>
        </div>
      ) : null}

    </div>
  </div>
) : null}
