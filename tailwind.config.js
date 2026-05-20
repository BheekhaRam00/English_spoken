/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],

  theme: {
    extend: {
      colors: {
        background: "#020617",
        surface: "#0f172a",
        primary: "#2563eb",
        secondary: "#9333ea",
        text: "#ffffff",
        muted: "rgba(255,255,255,0.7)"
      },

      backgroundImage: {
        "primary-gradient":
          "linear-gradient(90deg, #9333ea 0%, #2563eb 100%)",

        "hero-gradient":
          "linear-gradient(180deg, #020617 0%, #0f172a 100%)"
      },

      borderRadius: {
        xl2: "24px",
        xl3: "32px"
      },

      boxShadow: {
        glow:
          "0 0 40px rgba(147, 51, 234, 0.25), 0 0 80px rgba(37, 99, 235, 0.15)"
      },

      animation: {
        pulseSlow: "pulseSlow 2.5s infinite",
        float: "float 4s ease-in-out infinite"
      },

      keyframes: {
        pulseSlow: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)"
          },

          "50%": {
            opacity: "0.7",
            transform: "scale(1.03)"
          }
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0px)"
          },

          "50%": {
            transform: "translateY(-6px)"
          }
        }
      }
    }
  },

  plugins: []
};
