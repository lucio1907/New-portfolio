import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0b",
        surface: "#0f0f11",
        "surface-2": "#141416",
        "surface-3": "#0e0e10",
        border: "rgba(255,255,255,0.08)",
        "border-soft": "rgba(255,255,255,0.06)",
        "border-hover": "rgba(79,140,255,0.4)",
        accent: "#4f8cff",
        foreground: "#ededed",
        muted: "#a1a1aa",
        dim: "#8a8a90",
        faint: "#52525b",
        "faint-2": "#71717a",
        syntax: {
          keyword: "#c586c0",
          var: "#4fc1ff",
          prop: "#9cdcfe",
          string: "#7ec699",
          bool: "#569cd6",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        hero: [
          "clamp(40px, 5.4vw, 76px)",
          { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        h2: [
          "clamp(28px, 3.4vw, 44px)",
          { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        "contact-h2": [
          "clamp(36px, 5vw, 68px)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        "email-link": ["clamp(16px, 2.2vw, 24px)", { lineHeight: "1.3" }],
      },
      boxShadow: {
        card: "0 30px 60px -30px rgba(0,0,0,0.9)",
        terminal: "0 40px 80px -30px rgba(0,0,0,0.8)",
        cta: "0 14px 30px -8px rgba(79,140,255,0.5)",
      },
      borderRadius: {
        btn: "8px",
        card: "14px",
        panel: "12px",
        row: "10px",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [],
};
export default config;
