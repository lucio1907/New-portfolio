import type { Config } from "tailwindcss";

/** Semantic color tokens; values live in globals.css (light + dark). */
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        surface: token("surface"),
        subtle: token("subtle"),
        line: token("line"),
        fg: token("fg"),
        muted: token("muted"),
        accent: token("accent"),
        "on-accent": token("on-accent"),
        merged: token("merged"),
        danger: token("danger"),
        attention: token("attention"),
        link: token("link"),
        "diff-add": token("diff-add"),
        "diff-add-line": token("diff-add-line"),
        terminal: "#0A0D12",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        box: "8px",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, 0)" },
          "80%": { transform: "translate(1px, 1px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        glitch: "glitch 2.4s steps(1) infinite",
        wiggle: "wiggle 0.9s ease-in-out infinite",
        "spin-slow": "spin 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
