import type { Config } from "tailwindcss";

/** Semantic color tokens; values live in globals.css (dark + light). */
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token("canvas"),
        subtle: token("subtle"),
        inset: token("inset"),
        line: token("line"),
        "line-muted": token("line-muted"),
        fg: token("fg"),
        muted: token("muted"),
        link: token("link"),
        success: token("success"),
        "success-fg": token("success-fg"),
        done: token("done"),
        "done-fg": token("done-fg"),
        danger: token("danger"),
        attention: token("attention"),
        btn: token("btn"),
        "btn-hover": token("btn-hover"),
        "diff-add": token("diff-add"),
        "diff-add-num": token("diff-add-num"),
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Noto Sans"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          '"SF Mono"',
          "Menlo",
          "Consolas",
          '"Liberation Mono"',
          "monospace",
        ],
      },
      borderRadius: {
        box: "6px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 160ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
