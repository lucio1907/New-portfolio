import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFF4E0",
        ink: "#141414",
        "ink-soft": "#3D3D3D",
        yellow: "#FFD23F",
        pink: "#FF6B9E",
        blue: "#4361EE",
        green: "#2BC48A",
        red: "#FF4F4F",
        lilac: "#C3B1FF",
        terminal: "#16161A",
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
          "clamp(56px, 9vw, 128px)",
          { lineHeight: "0.9", letterSpacing: "-0.04em", fontWeight: "700" },
        ],
        h2: [
          "clamp(34px, 4.6vw, 60px)",
          { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
      },
      boxShadow: {
        "brutal-sm": "2px 2px 0 0 #141414",
        brutal: "4px 4px 0 0 #141414",
        "brutal-lg": "7px 7px 0 0 #141414",
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        btn: "10px",
        card: "16px",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, 0)" },
          "80%": { transform: "translate(1px, 1px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        stripes: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "40px 0" },
        },
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        glitch: "glitch 2.4s steps(1) infinite",
        marquee: "marquee 32s linear infinite",
        wiggle: "wiggle 0.9s ease-in-out infinite",
        stripes: "stripes 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
