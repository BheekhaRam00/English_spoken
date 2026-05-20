"use client";

type LessonProgressProps = {
  currentLesson: number;

  totalLessons: number;

  completed?: boolean;
};

export default function LessonProgress({
  currentLesson,
  totalLessons,
  completed = false
}: LessonProgressProps) {
  const progress =
    (currentLesson / totalLessons) * 100;

  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "22px"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          marginBottom: "16px",

          gap: "12px"
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 700,

              marginBottom: "6px"
            }}
          >
            Lesson Progress
          </h3>

          <p
            style={{
              color: "rgba(255,255,255,0.68)",

              fontSize: "14px"
            }}
          >
            Lesson {currentLesson} of{" "}
            {totalLessons}
          </p>
        </div>

        <div
          style={{
            minWidth: "72px",

            height: "42px",

            borderRadius: "14px",

            background: completed
              ? "rgba(34,197,94,0.16)"
              : "rgba(255,255,255,0.06)",

            border: completed
              ? "1px solid rgba(34,197,94,0.22)"
              : "1px solid rgba(255,255,255,0.08)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            color: "#ffffff",

            fontSize: "14px",
            fontWeight: 700
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "12px",

          borderRadius: "999px",

          background:
            "rgba(255,255,255,0.08)",

          overflow: "hidden",

          marginBottom: "14px"
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",

            borderRadius: "999px",

            background:
              "linear-gradient(90deg, #9333ea, #2563eb)",

            transition:
              "width 0.3s ease"
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",

          gap: "10px",

          flexWrap: "wrap"
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.72)",

            fontSize: "14px",

            lineHeight: 1.7
          }}
        >
          Keep practicing daily to improve fluency faster.
        </p>

        {completed && (
          <div
            style={{
              padding: "8px 14px",

              borderRadius: "999px",

              background:
                "rgba(34,197,94,0.16)",

              border:
                "1px solid rgba(34,197,94,0.22)",

              color: "#ffffff",

              fontSize: "13px",
              fontWeight: 700
            }}
          >
            Completed
          </div>
        )}
      </div>
    </section>
  );
}
