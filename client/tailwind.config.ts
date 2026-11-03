import type { Config } from "tailwindcss";

/**
 * Star-chart palette: night-sky indigo instead of black, parchment text,
 * a solar yellow for actions and an atmosphere blue for links.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#0F1640",
        deep: "#161F52",
        orbit: "#2C3770",
        parchment: "#EEE8DA",
        haze: "#A9AECC",
        sun: "#FFC94A",
        sky: "#8CCBFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "34rem",
      },
    },
  },
  plugins: [],
};
export default config;
