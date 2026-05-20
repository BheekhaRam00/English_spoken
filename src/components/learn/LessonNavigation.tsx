"use client";

import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

type LessonNavigationProps = {
  currentIndex: number;

  totalLessons: number;

  onPrevious: () => void;

  onNext: () => void;
};

export default function LessonNavigation({
  currentIndex,
  totalLessons,
  onPrevious,
  onNext
}: LessonNavigationProps) {
  const progress =
    ((currentIndex + 1) /
      totalLessons) *
    100;

  return (
    <section
      className="fade-in"
      style={{
        marginTop: "28px"
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "24px",
          marginBottom: "18px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",

            marginBottom: "14px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <CheckCircle2
              size={20}
            />

            <h3
              style={{
                fontSize:
                  "20px"
              }}
            >
              Lesson Progress
            </h3>
          </div>

          <span
            style={{
              color:
                "rgba(255,255,255,0.72)",

              fontWeight: 600
            }}
          >
            {currentIndex + 1}
            {" / "}
            {totalLessons}
          </span>
        </div>

        <div
          style={{
            width: "100%",
            height: "12px",

            borderRadius:
              "999px",

            background:
              "rgba(255,255,255,0.08)",

            overflow:
              "hidden"
          }}
        >
          <div
            style={{
              width: `${progress}%`,

              height: "100%",

              borderRadius:
                "999px",

              background:
                "linear-gradient(90deg, #9333ea, #2563eb)",

              transition:
                "0.3s ease"
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "14px"
        }}
      >
        <button
          className="secondary-button"
          onClick={
            onPrevious
          }
          disabled={
            currentIndex === 0
          }
          style={{
            opacity:
              currentIndex === 0
                ? 0.5
                : 1,

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            gap: "10px"
          }}
        >
          <ChevronLeft
            size={20}
          />

          Previous
        </button>

        <button
          className="primary-button"
          onClick={onNext}
          disabled={
            currentIndex ===
            totalLessons - 1
          }
          style={{
            opacity:
              currentIndex ===
              totalLessons - 1
                ? 0.5
                : 1,

            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            gap: "10px"
          }}
        >
          Next Lesson

          <ChevronRight
            size={20}
          />
        </button>
      </div>
    </section>
  );
}
