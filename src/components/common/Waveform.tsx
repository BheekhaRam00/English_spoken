"use client";

type WaveformProps = {
  active?: boolean;
  height?: number;
};

export default function Waveform({
  active = true,
  height = 80
}: WaveformProps) {
  const bars = [
    24,
    48,
    36,
    60,
    30,
    52,
    28,
    44
  ];

  return (
    <div
      style={{
        width: "100%",
        height: `${height}px`,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        gap: "6px"
      }}
    >
      {bars.map((barHeight, index) => (
        <div
          key={index}
          style={{
            width: "6px",

            height: `${barHeight}px`,

            borderRadius: "999px",

            background:
              "linear-gradient(180deg, #c084fc, #2563eb)",

            opacity: active ? 1 : 0.35,

            animation: active
              ? `wave-animation 1.2s ${
                  index * 0.1
                }s infinite ease-in-out`
              : "none"
          }}
        />
      ))}
    </div>
  );
}
