import type { Config } from "tailwindcss";

/**
 * Thermal receipt paper, the blue-black of its print and one saturated cobalt.
 * The last group only keeps the old section bodies readable until they are
 * rebuilt on these tokens.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F3F4F1",
        ink: "#101322",
        muted: "#585D6E",
        cobalt: "#1B2BD6",
        mist: "#D5D9FC",
        receipt: "#FCFCF8",

        night: "#101322",
        deep: "#E6E8E2",
        orbit: "#C8CBD2",
        parchment: "#101322",
        haze: "#585D6E",
        sun: "#1B2BD6",
        sky: "#1B2BD6",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        prose: "34rem",
      },
    },
  },
  plugins: [],
};
export default config;
