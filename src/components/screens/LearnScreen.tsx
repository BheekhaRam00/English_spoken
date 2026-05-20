"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Brain
} from "lucide-react";

import {
  LearningMode
} from "@/types";

import {
  LearningEngine
} from "@/lib/learning-engine";

type LearnScreenProps = {
  mode: LearningMode;

  onModeChange: (
    mode: LearningMode
  ) => void;

  engine: LearningEngine;
};

const modes: LearningMode[] = [
  "beginner",
  "daily",
  "office",
  "business",
  "interview",
  "advanced"
];

export default function LearnScreen({
  mode,
  onModeChange,
  engine
}: LearnScreenProps) {
  const lessons =
    engine.getLessons();

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const lesson = useMemo(
    () =>
      lessons[
        currentIndex
      ],
    [
      lessons,
      currentIndex
    ]
  );

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

    utterance.pitch = 1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      utterance
    );
  };

  const nextLesson = () => {
    if (
      currentIndex <
      lessons.length - 1
    ) {
      setCurrentIndex(
        (prev) =>
          prev + 1
      );
    }
  };

  const previousLesson =
    () => {
      if (
        currentIndex > 0
      ) {
        setCurrentIndex(
          (prev) =>
            prev - 1
        );
      }
    };

  if (!lesson) {
    return (
      <main className="page-container">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            No Lessons Available
          </h2>

          <p className="text-white/70">
            Please select another learning mode.
          </p>
        </div>
      </main>
    );
  }

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
            Learn English
          </h1>

          <p
            style={{
              color:
                "rgba(255,255,255,0.72)"
            }}
          >
            AI-powered spoken English learning.
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
            "24px",
          paddingBottom:
            "6px"
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
              onClick={() => {
                onModeChange(
                  learningMode
                );

                setCurrentIndex(
                  0
                );
              }}
              style={{
                minWidth:
                  "120px",

                height: "48px",

                borderRadius:
                  "16px",

                background:
                  mode ===
                  learningMode
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
                learningMode
              }
            </button>
          )
        )}
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "28px"
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

            gap: "12px",

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

            <span
              style={{
                fontSize:
                  "14px",

                fontWeight:
                  600
              }}
            >
              {
                lesson.category
              }
            </span>
          </div>

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: "8px",

              color:
                "rgba(255,255,255,0.7)"
            }}
          >
            <Brain
              size={18}
            />

            <span
              style={{
                fontSize:
                  "14px"
              }}
            >
              AI Lesson
            </span>
          </div>
        </div>

        <h2
          style={{
            fontSize: "28px",
            lineHeight: 1.6,
            marginBottom:
              "24px"
          }}
        >
          {lesson.english ||
            lesson.sentence}
        </h2>

        <button
          className="primary-button"
          onClick={() =>
            speakText(
              lesson.english ||
                lesson.sentence ||
                ""
            )
          }
          style={{
            marginBottom:
              "28px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap: "10px"
          }}
        >
          <Volume2
            size={20}
          />

          Listen Pronunciation
        </button>

        <div
          style={{
            padding: "22px",

            borderRadius:
              "24px",

            background:
              "rgba(255,255,255,0.05)",

            marginBottom:
              "28px"
          }}
        >
          <h3
            style={{
              marginBottom:
                "14px",

              fontSize:
                "18px"
            }}
          >
            Hindi Translation
          </h3>

          <p
            style={{
              color:
                "rgba(255,255,255,0.84)",

              lineHeight:
                1.9,

              fontSize:
                "18px"
            }}
          >
            {lesson.hindi ||
              lesson.translation}
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
                "18px",

              fontSize:
                "22px"
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
                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      gap: "12px",

                      marginBottom:
                        "12px"
                    }}
                  >
                    <h4
                      style={{
                        fontSize:
                          "20px"
                      }}
                    >
                      {
                        item.word
                      }
                    </h4>

                    <button
                      onClick={() =>
                        speakText(
                          item.word
                        )
                      }
                      style={{
                        width:
                          "42px",

                        height:
                          "42px",

                        borderRadius:
                          "14px",

                        background:
                          "rgba(255,255,255,0.06)",

                        color:
                          "#ffffff",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center"
                      }}
                    >
                      <Volume2
                        size={
                          18
                        }
                      />
                    </button>
                  </div>

                  <p
                    style={{
                      marginBottom:
                        "10px",

                      color:
                        "rgba(255,255,255,0.86)"
                    }}
                  >
                    Meaning:
                    {" "}
                    {
                      item.meaning
                    }
                  </p>

                  <p
                    style={{
                      color:
                        "rgba(255,255,255,0.68)"
                    }}
                  >
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
            padding: "24px",

            marginBottom:
              "30px",

            background:
              "linear-gradient(90deg, rgba(147,51,234,0.12), rgba(37,99,235,0.12))"
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap: "12px",

              marginBottom:
                "14px"
            }}
          >
            <RotateCcw
              size={22}
            />

            <h3
              style={{
                fontSize:
                  "22px"
              }}
            >
              Repeat Practice
            </h3>
          </div>

          <p
            style={{
              color:
                "rgba(255,255,255,0.75)",

              lineHeight:
                1.8,

              marginBottom:
                "20px"
            }}
          >
            Listen carefully and repeat the
            sentence loudly to improve fluency
            and confidence.
          </p>

          <button
            className="secondary-button"
            onClick={() =>
              speakText(
                lesson.english ||
                  lesson.sentence ||
                  ""
              )
            }
          >
            Repeat Sentence
          </button>
        </div>

        <div
          className="glass-card"
          style={{
            padding: "22px",

            background:
              "rgba(34,197,94,0.12)",

            border:
              "1px solid rgba(34,197,94,0.18)"
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
            <CheckCircle2
              size={24}
            />

            <div>
              <h3
                style={{
                  marginBottom:
                    "4px"
                }}
              >
                Practice Tip
              </h3>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.72)",

                  lineHeight:
                    1.7
                }}
              >
                Speak slowly and clearly
                instead of speaking fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="fade-in"
        style={{
          marginTop: "28px",

          display: "grid",

          gridTemplateColumns:
            "1fr 1fr",

          gap: "14px"
        }}
      >
        <button
          className="secondary-button"
          onClick={
            previousLesson
          }
          disabled={
            currentIndex ===
            0
          }
          style={{
            opacity:
              currentIndex ===
              0
                ? 0.5
                : 1
          }}
        >
          Previous
        </button>

        <button
          className="primary-button"
          onClick={
            nextLesson
          }
          disabled={
            currentIndex ===
            lessons.length -
              1
          }
          style={{
            opacity:
              currentIndex ===
              lessons.length -
                1
                ? 0.5
                : 1
          }}
        >
          Next Lesson
        </button>
      </section>

      <section
        className="glass-card fade-in"
        style={{
          padding: "24px",

          marginTop: "28px",

          background:
            "linear-gradient(90deg, rgba(147,51,234,0.14), rgba(37,99,235,0.14))"
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: "12px",

            marginBottom:
              "14px"
          }}
        >
          <Sparkles
            size={22}
          />

          <h2
            style={{
              fontSize:
                "24px"
            }}
          >
            AI Learning
          </h2>
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,0.76)",

            lineHeight: 1.8
          }}
        >
          FluentPro AI dynamically adapts
          lessons for daily communication,
          office English, interviews, and
          professional speaking confidence.
        </p>
      </section>
    </main>
  );
        }
