"use client";

import {
  useEffect,
  useState
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Brain,
  Loader2
} from "lucide-react";

import {
  LearningMode
} from "@/types";

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

type LessonData = {
  title?: string;

  category?: string;

  english: string;

  hindi: string;

  vocabulary?: {
    word: string;

    meaning: string;

    pronunciation: string;
  }[];

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

  const fetchLesson =
    async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            `/api/lesson?mode=${mode}`,
            {
              cache: "no-store"
            }
          );

        const data =
          await response.json();

        if (
          data?.success &&
          data?.lesson
        ) {
          setLesson(
            data.lesson
          );
        }
      } catch (error) {
        console.error(
          "Lesson fetch error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchLesson();
  }, [mode]);

  const speakText = (
    text: string
  ) => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      "en-US";

    utterance.rate =
      0.92;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      utterance
    );
  };

  if (
    loading ||
    !lesson
  ) {
    return (
      <main className="page-container">
        <div
          className="glass-card"
          style={{
            padding: "60px",
            textAlign: "center"
          }}
        >
          <Loader2
            size={42}
            className="animate-spin"
          />

          <h2
            style={{
              marginTop: "20px"
            }}
          >
            Generating AI Lesson...
          </h2>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section
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
            Learn English
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.72)"
            }}
          >
            Real AI-generated spoken English lessons.
          </p>
        </div>
      </section>

      <section
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          marginBottom:
            "24px"
        }}
      >
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
              style={{
                minWidth:
                  "120px",

                height: "48px",

                borderRadius:
                  "16px",

                background:
                  mode ===
                  learningMode
                    ? "linear-gradient(90deg,#9333ea,#2563eb)"
                    : "rgba(255,255,255,0.05)",

                color:
                  "#fff",

                fontWeight:
                  600,

                textTransform:
                  "capitalize"
              }}
            >
              {
                learningMode
              }
            </button>
          )
        )}
      </section>

      <section
        className="glass-card"
        style={{
          padding: "28px"
        }}
      >
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            marginBottom:
              "24px"
          }}
        >
          <div
            style={{
              display:
                "inline-flex",

              alignItems:
                "center",

              gap: "8px",

              padding:
                "10px 16px",

              borderRadius:
                "999px",

              background:
                "linear-gradient(90deg, rgba(147,51,234,0.18), rgba(37,99,235,0.18))"
            }}
          >
            <BookOpen
              size={18}
            />

            <span>
              {lesson.title ||
                lesson.category ||
                "AI Lesson"}
            </span>
          </div>

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: "8px"
            }}
          >
            <Brain
              size={18}
            />

            <span>
              Live AI
            </span>
          </div>
        </div>

        <h2
          style={{
            fontSize: "30px",
            lineHeight: 1.7,
            marginBottom:
              "24px"
          }}
        >
          {
            lesson.english
          }
        </h2>

        <button
          className="primary-button"
          onClick={() =>
            speakText(
              lesson.english
            )
          }
          style={{
            marginBottom:
              "24px"
          }}
        >
          <Volume2
            size={20}
          />

          Listen Pronunciation
        </button>

        <div
          className="glass-card"
          style={{
            padding: "22px",
            marginBottom:
              "28px"
          }}
        >
          <h3
            style={{
              marginBottom:
                "14px"
            }}
          >
            Hindi Translation
          </h3>

          <p
            style={{
              lineHeight: 1.8
            }}
          >
            {lesson.hindi}
          </p>
        </div>

        <div
          style={{
            marginBottom:
              "30px"
          }}
        >
          <h3
            style={{
              marginBottom:
                "18px"
            }}
          >
            Vocabulary
          </h3>

          <div
            style={{
              display:
                "grid",
              gap: "16px"
            }}
          >
            {lesson.vocabulary?.map(
              (
                item
              ) => (
                <div
                  key={
                    item.word
                  }
                  className="glass-card"
                  style={{
                    padding:
                      "20px"
                  }}
                >
                  <h4
                    style={{
                      marginBottom:
                        "10px"
                    }}
                  >
                    {
                      item.word
                    }
                  </h4>

                  <p>
                    Meaning:
                    {" "}
                    {
                      item.meaning
                    }
                  </p>

                  <p>
                    Pronunciation:
                    {" "}
                    {
                      item.pronunciation
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: "22px",
            background:
              "rgba(34,197,94,0.12)"
          }}
        >
          <div
            style={{
              display:
                "flex",
              gap: "12px"
            }}
          >
            <CheckCircle2
              size={22}
            />

            <div>
              <h3>
                Practice Tip
              </h3>

              <p>
                {lesson.pronunciationTip ||
                  "Speak naturally and confidently."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          marginTop: "28px"
        }}
      >
        <button
          className="primary-button"
          onClick={
            fetchLesson
          }
          style={{
            width: "100%"
          }}
        >
          <Sparkles
            size={20}
          />

          Generate New AI Lesson
        </button>
      </section>
    </main>
  );
}
