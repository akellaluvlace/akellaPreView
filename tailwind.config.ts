import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F1EA",
        ink: "#0F0F0F",
        coral: "#FF4D2E",
        muted: "#8C847A",
        soft: "#EDE6D9",
        card: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-instrument)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3rem, 8vw, 7rem)",
          { lineHeight: "0.95", letterSpacing: "-0.03em" },
        ],
        "display-lg": [
          "clamp(2.25rem, 5vw, 4rem)",
          { lineHeight: "1", letterSpacing: "-0.025em" },
        ],
      },
    },
  },
  plugins: [],
};

export default config;
