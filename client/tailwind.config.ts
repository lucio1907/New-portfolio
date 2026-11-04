import type { Config } from "tailwindcss";

/** Thermal receipt paper, the blue-black of its print and one saturated cobalt. */
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
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
