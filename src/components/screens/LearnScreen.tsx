"use client";

import {
  useEffect,
  useMemo,
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
  RefreshCw
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

type LessonData = {
  title?: string;

  category?: string;

  english: string;

  hindi: string;

  vocabulary?: VocabularyItem[];

  pronunciationTip?: string;
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

  const [playingFullLesson,
    setPlayingFullLesson] =
    useState(false);

  async function fetchLesson() {
    try {
      setLoading(true);

      setError("");

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

      if (
        !response.ok ||
        !data?.success ||
        !data?.lesson
      ) {
        throw new Error(
          "Lesson load failed."
        );
      }

      setLesson(
        data.lesson
      );
    } catch (error) {
      console.error(
        "Lesson Fetch Error:",
        error
      );

      setError(
        "Unable to generate lesson."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLesson();
  }, [mode]);

  /*
  CLEAN SENTENCE SPLIT
  */
  const lessonSentences =
    useMemo(() => {
      if (
        !lesson?.english
      ) {
        return [];
      }

      return lesson.english
        .split(
          /\n|[.!?]+/
        )
        .map((item) =>
          item.trim()
        )
        .filter(
          (item) =>
            item.length > 2
        )
        .slice(0, 5);
    }, [lesson]);

  /*
  PLAY FULL LESSON
  */
  async function playFullLesson() {
    try {
      if (
        playingFullLesson ||
        !lessonSentences.length
      ) {
        return;
      }

      setPlayingFullLesson(
        true
      );

      for (const sentence of lessonSentences) {
        await speakText({
          text:
            sentence
        });

        /*
        NATURAL PAUSE
        */
        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500
            )
        );
      }
    } catch (error) {
      console.error(
        "Full Lesson Play Error:",
        error
      );
    } finally {
      setPlayingFullLesson(
        false
      );
    }
  }

  /*
  COMPACT MOBILE LOADER
  */
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
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-center">
            <p className="text-sm text-red-200">
              {error}
            </p>

            <button
              onClick={
                fetchLesson
              }
              className="mt-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 text-sm font-semibold"
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* MAIN CARD */}
        {lesson ? (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            {/* TOP */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-3 py-2 text-xs font-semibold">
                <BookOpen
                  size={14}
                />

                <span>
                  {lesson.title ||
                    lesson.category ||
                    "AI Lesson"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-white/70">
                <Brain
                  size={14}
                />

                <span>
                  Live AI
                </span>
              </div>
            </div>

            {/* ENGLISH */}
            <div className="space-y-3">
              {lessonSentences.map(
                (
                  sentence,
                  index
                ) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/5 bg-white/5 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-bold">
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <p className="text-[15px] leading-7 text-white">
                          {sentence}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          speakText(
                            {
                              text:
                                sentence
                            }
                          )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10"
                      >
                        <Volume2
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* FULL AUDIO */}
            <button
              onClick={
                playFullLesson
              }
              disabled={
                playingFullLesson
              }
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold disabled:opacity-60"
            >
              {playingFullLesson ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Playing Lesson...
                </>
              ) : (
                <>
                  <Volume2
                    size={18}
                  />

                  Listen Full Lesson
                </>
              )}
            </button>

            {/* HINDI */}
            <div className="mt-4 rounded-2xl border border-white/5 bg-white/5 p-4">
              <h3 className="mb-2 text-sm font-semibold text-white">
                Hindi Meaning
              </h3>

              <p className="text-sm leading-7 text-white/75">
                {lesson.hindi}
              </p>
            </div>

            {/* VOCAB */}
            {lesson.vocabulary
              ?.length ? (
              <div className="mt-4">
                <h3 className="mb-3 text-sm font-semibold">
                  Vocabulary
                </h3>

                <div className="space-y-3">
                  {lesson.vocabulary
                    .slice(0, 3)
                    .map(
                      (
                        item
                      ) => (
                        <div
                          key={
                            item.word
                          }
                          className="rounded-2xl border border-white/5 bg-white/5 p-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h4 className="text-sm font-semibold">
                                {
                                  item.word
                                }
                              </h4>

                              <p className="mt-1 text-xs text-white/70">
                                {
                                  item.meaning
                                }
                              </p>

                              <p className="mt-1 text-[11px] text-white/45">
                                {
                                  item.pronunciation
                                }
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                speakText(
                                  {
                                    text:
                                      item.word
                                  }
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"
                            >
                              <Volume2
                                size={
                                  15
                                }
                              />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>
            ) : null}

            {/* TIP */}
            <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <h3 className="text-sm font-semibold">
                    Practice Tip
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-white/75">
                    {lesson.pronunciationTip ||
                      "Speak slowly and confidently."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* GENERATE */}
        <button
          onClick={
            fetchLesson
          }
          disabled={loading}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Generating...
            </>
          ) : (
            <>
              <RefreshCw
                size={18}
              />

              New AI Lesson
            </>
          )}
        </button>

        {/* FOOTER */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-600/10 to-blue-600/10 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles
              size={16}
            />

            <h2 className="text-sm font-semibold">
              AI Learning
            </h2>
          </div>

          <p className="text-xs leading-6 text-white/70">
            Practice short real-life English conversations with pronunciation help and vocabulary support.
          </p>
        </section>
      </div>
    </main>
  );
}
