"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion/Reveal";
import IncidentBanner from "@/features/debug-me/components/IncidentBanner";
import TechMarquee from "./TechMarquee";

const socials = [
  { label: "GitHub", href: "https://github.com/lucio1907" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/luciogastellu/" },
  { label: "X / Twitter", href: "https://x.com/Lu_Gastellu" },
] as const;

const HomeView = (): React.ReactElement => {
  const t = useTranslations("hero");

  const passRows = [
    { label: t("card.name"), value: "Lucio Gastellu Arrieta" },
    { label: t("card.role"), value: t("card.roleValue") },
    { label: t("card.base"), value: t("card.baseValue") },
    { label: t("card.langs"), value: t("card.langsValue") },
  ];

  return (
    <header id="top" className="pt-28 md:pt-32">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-5 pb-20 md:px-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10 lg:pb-24">
        <div>
          <IncidentBanner />

          <FadeIn delay={0}>
            <span className="sticker mb-6 -rotate-2 bg-blue text-white">
              {t("label")}
            </span>
          </FadeIn>

          <FadeIn delay={0.06}>
            <h1 className="mb-7 text-hero text-ink">
              <span className="mb-3 block text-[0.3em] font-bold tracking-[-0.01em] text-ink-soft">
                {t("greeting")}
              </span>
              <span className="block">Lucio</span>
              <span className="marker block w-fit pr-2">
                Gastellu<span className="text-pink">.</span>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.12}>
            <p className="mb-6 max-w-[560px] text-lg font-medium leading-[1.6] text-ink-soft md:text-xl">
              {t("tagline")}
            </p>
            <p className="brutal-chip mb-9 bg-green">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-white motion-safe:animate-pulse"
              />
              {t("availability")}
            </p>
          </FadeIn>

          <FadeIn delay={0.18}>
            <div className="mb-9 flex flex-wrap gap-4">
              <a href="#contacto" className="brutal-btn bg-pink text-lg">
                {t("ctaContact")}
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="/CV-LucioGastellu.pdf"
                target="_blank"
                rel="noreferrer"
                className="brutal-btn bg-white text-lg"
              >
                {t("ctaDownloadCV")}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-bold text-ink-soft">
                {t("findMe")}:
              </span>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="brutal-chip bg-white transition-colors duration-150 hover:bg-yellow"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="relative mx-auto w-full max-w-[400px] pb-6 pt-12">
          <motion.div
            initial={{ rotate: 2 }}
            animate={{ rotate: 2 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="brutal-card overflow-hidden shadow-brutal-lg"
          >
            <div className="flex items-center justify-between border-b-3 border-ink bg-pink px-5 py-3">
              <span className="font-mono text-sm font-bold tracking-[0.12em]">
                {t("card.title")}
              </span>
              <span className="font-mono text-sm font-bold">#0413</span>
            </div>
            <dl className="flex flex-col gap-3.5 px-5 py-5">
              {passRows.map((row) => (
                <div key={row.label} className="flex flex-col">
                  <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                    {row.label}
                  </dt>
                  <dd className="text-lg font-bold leading-tight">{row.value}</dd>
                </div>
              ))}
              <div className="flex flex-col">
                <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                  {t("card.status")}
                </dt>
                <dd className="mt-1">
                  <span className="brutal-chip bg-green">
                    ✓ {t("card.statusValue")}
                  </span>
                </dd>
              </div>
            </dl>
            <div aria-hidden="true" className="barcode mx-5 mb-5 h-10" />
          </motion.div>

          <span className="sticker absolute left-2 top-0 -rotate-6 bg-yellow">
            {t("stickers.friday")}
          </span>
          <span className="sticker absolute -right-2 top-1/2 rotate-6 bg-lilac md:-right-6">
            {t("stickers.ai")} ✦
          </span>
          <span className="sticker absolute -bottom-2 left-6 -rotate-3 bg-white">
            {t("stickers.coffee")}
          </span>
        </FadeIn>
      </div>

      <TechMarquee />
    </header>
  );
};

export default HomeView;
