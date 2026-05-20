"use client";

type TranslationCardProps = {
  translation: string;
};

export default function TranslationCard({
  translation
}: TranslationCardProps) {
  return (
    <section
      className="glass-card fade-in"
      style={{
        padding: "24px",

        background:
          "rgba(255,255,255,0.05)"
      }}
    >
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 700,

          marginBottom: "16px"
        }}
      >
        Hindi Translation
      </h3>

      <p
        style={{
          color: "rgba(255,255,255,0.84)",

          lineHeight: 1.9,

          fontSize: "18px"
        }}
      >
        {translation}
      </p>
    </section>
  );
}
