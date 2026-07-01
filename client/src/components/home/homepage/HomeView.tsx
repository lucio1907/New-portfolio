"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion/Reveal";

const HomeView = (): React.ReactElement => {
  const t = useTranslations("hero");

  return (
    <header
      id="top"
      className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-5 pb-24 pt-32 md:px-10 md:pb-28 md:pt-40 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-32 lg:pt-44"
    >
      <div>
        <FadeIn delay={0}>
          <p className="mb-7 font-mono text-[13px] tracking-[0.16em] text-accent">
            {t("label")}
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <h1 className="mb-7 text-hero text-foreground">
            <span className="mb-2.5 block text-[0.5em] font-medium tracking-[-0.01em] text-faint-2">
              {t("greeting")}
            </span>
            <span className="block">
              Lucio
              <br />
              Gastellu<span className="text-accent">.</span>
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.16}>
          <p className="mb-10 max-w-[440px] text-[19px] leading-[1.6] text-muted">
            {t("tagline")}
          </p>
        </FadeIn>

        <FadeIn delay={0.24}>
          <div className="mb-11 flex flex-wrap gap-3.5">
            <motion.a
              href="#contacto"
              whileHover={{
                y: -2,
                transition: { type: "spring", stiffness: 300, damping: 18 },
              }}
              whileTap={{ scale: 0.97 }}
              className="rounded-btn bg-accent px-6 py-3.5 font-mono text-sm font-medium text-background transition-shadow duration-200 hover:shadow-cta"
            >
              {t("ctaContact")}
            </motion.a>
            <motion.a
              href="/CV-LucioGastellu.pdf"
              target="_blank"
              whileTap={{ scale: 0.97 }}
              className="rounded-btn border border-white/[0.16] px-6 py-3.5 font-mono text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent/60 hover:bg-accent/[0.08]"
            >
              {t("ctaDownloadCV")}
            </motion.a>
          </div>
        </FadeIn>

        <FadeIn delay={0.32}>
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs text-faint">FIND ME —</span>
            <a
              href="https://github.com/lucio1907"
              target="_blank"
              className="font-mono text-[13px] text-dim transition-colors duration-200 hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://x.com/Lu_Gastellu"
              target="_blank"
              className="font-mono text-[13px] text-dim transition-colors duration-200 hover:text-foreground"
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/luciogastellu/"
              target="_blank"
              className="font-mono text-[13px] text-dim transition-colors duration-200 hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.4}>
        <motion.div
          animate={{ y: [0, -9, 0, 6, 0], rotate: [0, 0.6, 0, -0.5, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.3, 0.55, 0.8, 1],
          }}
          className="overflow-hidden rounded-card border border-border bg-terminal shadow-terminal"
        >
          <div className="flex items-center gap-2 border-b border-border-soft bg-white/[0.02] px-4 py-3.5">
            <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[11px] text-faint">
              developer.ts
            </span>
          </div>
          <pre className="overflow-x-auto px-5 py-[22px] font-mono text-[13px] leading-[1.9] text-[#c9c9d1]">
            <span className="text-syntax-keyword">const</span>{" "}
            <span className="text-syntax-var">dev</span>{" "}
            <span className="text-dim">=</span> {"{"}
            {"\n"}  <span className="text-syntax-prop">name</span>:{" "}
            <span className="text-syntax-string">&quot;Lucio Gastellu Arrieta&quot;</span>,
            {"\n"}  <span className="text-syntax-prop">role</span>:{" "}
            <span className="text-syntax-string">&quot;Full Stack Developer & AI&quot;</span>,
            {"\n"}  <span className="text-syntax-prop">location</span>:{" "}
            <span className="text-syntax-string">&quot;Argentina&quot;</span>,
            {"\n"}  <span className="text-syntax-prop">languages</span>: {"{ "}
            <span className="text-syntax-prop">english</span>:{" "}
            <span className="text-syntax-string">&quot;B2&quot;</span>,{" "}
            <span className="text-syntax-prop">spanish</span>:{" "}
            <span className="text-syntax-string">&quot;Native&quot;</span>
            {" },"}
            {"\n"}  <span className="text-syntax-prop">focus</span>: [
            <span className="text-syntax-string">&quot;Systems Development&quot;</span>,{" "}
            <span className="text-syntax-string">&quot;AI&quot;</span>],
            {"\n"}  <span className="text-syntax-prop">available</span>:{" "}
            <span className="text-syntax-bool">true</span>
            <span className="animate-blink text-accent">_</span>
            {"\n"}
            {"}"}
          </pre>
        </motion.div>
      </FadeIn>
    </header>
  );
};

export default HomeView;
