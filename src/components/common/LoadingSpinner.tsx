"use client";

type LoadingSpinnerProps = {
  size?: number;
  text?: string;
};

export default function LoadingSpinner({
  size = 56,
  text = "Loading..."
}: LoadingSpinnerProps) {
  return (
    <div
      style={{
        width: "100%",

        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        justifyContent: "center",

        gap: "18px",

        padding: "32px 20px"
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,

          borderRadius: "50%",

          border:
            "4px solid rgba(255,255,255,0.12)",

          borderTop:
            "4px solid #9333ea",

          borderRight:
            "4px solid #2563eb",

          animation:
            "loading-spinner 0.8s linear infinite"
        }}
      />

      <p
        style={{
          color: "rgba(255,255,255,0.72)",

          fontSize: "15px",
          fontWeight: 500
        }}
      >
        {text}
      </p>

      <style jsx>{`
        @keyframes loading-spinner {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
