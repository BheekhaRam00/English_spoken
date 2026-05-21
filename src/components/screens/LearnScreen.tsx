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
  CheckCircle2,
  Sparkles,
  Brain,
  Loader2,
  RefreshCw
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

  const fetchLesson =
    async () => {
      try {
        setLoading(true);

        setError("");

        const response =
          await fetch(
            `/api/lesson?mode=${mode}`,
            {
              cache:
                "no-store"
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
        } else {
          setError(
            "Unable to load lesson."
          );
        }
      } catch (error) {
        console.error(
          "Lesson fetch error:",
          error
        );

        setError(
          "Something went wrong."
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
      0.9;

    utterance.pitch =
      1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      utterance
    );
  };

  const lessonSentences =
    lesson?.english
      ?.split(/[.!?]/)
      .map((item) =>
        item.trim()
      )
      .filter(Boolean) || [];

  if (
    loading &&
    !lesson
  ) {
    return (
      <main className="page-container">
        <div
          className="glass-card"
          style={{
            padding: "70px 24px",
            textAlign:
              "center"
          }}
        >
          <Loader2
            size={48}
            className="animate-spin"
          />

          <h2
            style={{
              marginTop:
                "24px",
              fontSize:
                "28px"
            }}
          >
            Generating AI Lesson...
          </h2>

          <p
            style={{
              marginTop:
                "10px",
              color:
                "rgba(255,255,255,0.65)"
            }}
          >
            Creating spoken English practice.
          </p>
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
          overflowX:
            "auto",
          marginBottom:
            "24px",
          paddingBottom:
            "4px"
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

                height:
                  "48px",

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
                  "capitalize",

                border:
                  "none"
              }}
            >
              {
                learningMode
              }
            </button>
          )
        )}
      </section>

      {error ? (
        <div
          className="glass-card"
          style={{
            padding: "40px",
            textAlign:
              "center"
          }}
        >
          <h2>
            {error}
          </h2>

          <button
            className="primary-button"
            onClick={
              fetchLesson
            }
            style={{
              marginTop:
                "20px"
            }}
          >
            Retry
          </button>
        </div>
      ) : null}

      {lesson ? (
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

              alignItems:
                "center",

              gap: "16px",

              marginBottom:
                "26px"
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

                gap: "8px",

                color:
                  "#fff"
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

          <div
            style={{
              display:
                "grid",
              gap: "16px",
              marginBottom:
                "28px"
            }}
          >
            {lessonSentences.map(
              (
                sentence,
                index
              ) => (
                <div
                  key={index}
                  style={{
                    padding:
                      "22px",

                    borderRadius:
                      "22px",

                    background:
                      "rgba(255,255,255,0.05)",

                    border:
                      "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "flex-start",

                      gap: "14px"
                    }}
                  >
                    <p
                      style={{
                        fontSize:
                          "28px",

                        lineHeight:
                          1.8,

                        flex: 1
                      }}
                    >
                      {sentence}.
                    </p>

                    <button
                      onClick={() =>
                        speakText(
                          sentence
                        )
                      }
                      style={{
                        minWidth:
                          "46px",

                        height:
                          "46px",

                        borderRadius:
                          "14px",

                        border:
                          "none",

                        background:
                          "linear-gradient(90deg,#9333ea,#2563eb)",

                        color:
                          "#fff",

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
                          20
                        }
                      />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <button
            className="primary-button"
            onClick={() =>
              speakText(
                lesson.english
              )
            }
            style={{
              marginBottom:
                "26px",
              width: "100%"
            }}
          >
            <Volume2
              size={20}
            />

            Listen Full Lesson
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
                  "14px",
                fontSize:
                  "22px"
              }}
            >
              Hindi Translation
            </h3>

            <p
              style={{
                lineHeight:
                  2,

                color:
                  "rgba(255,255,255,0.82)",

                fontSize:
                  "18px"
              }}
            >
              {lesson.hindi}
            </p>
          </div>

          {lesson.vocabulary
            ?.length ? (
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
                    "24px"
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
                {lesson.vocabulary.map(
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

                          marginBottom:
                            "14px"
                        }}
                      >
                        <h4
                          style={{
                            fontSize:
                              "24px"
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
                              "12px",

                            border:
                              "none",

                            background:
                              "rgba(255,255,255,0.06)",

                            color:
                              "#fff"
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
                            "8px",

                          color:
                            "rgba(255,255,255,0.85)"
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
          ) : null}

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
                gap: "12px"
              }}
            >
              <CheckCircle2
                size={22}
              />

              <div>
                <h3
                  style={{
                    marginBottom:
                      "6px"
                  }}
                >
                  Practice Tip
                </h3>

                <p
                  style={{
                    lineHeight:
                      1.7,
                    color:
                      "rgba(255,255,255,0.76)"
                  }}
                >
                  {lesson.pronunciationTip ||
                    "Speak naturally and confidently."}
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

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
          disabled={loading}
          style={{
            width: "100%",
            opacity:
              loading
                ? 0.7
                : 1
          }}
        >
          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw
                size={20}
              />
              Generate New AI Lesson
            </>
          )}
        </button>
      </section>

      <section
        className="glass-card"
        style={{
          marginTop: "28px",
          padding: "24px",
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

            lineHeight:
              1.9
          }}
        >
          Practice real spoken English with
          short AI-generated conversations,
          pronunciation help, vocabulary,
          and natural daily communication.
        </p>
      </section>
    </main>
  );
}
