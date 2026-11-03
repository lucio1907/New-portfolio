"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { CV_HREF, OWNER_NAME } from "@/features/portfolio/lib/constants";

type IntroCardProps = { visible: boolean; onSit: () => void };

/**
 * First screen: who Lucio is and the two ways in. Sitting down is the
 * playful path; "go straight to the desktop" is the recruiter's shortcut.
 */
const IntroCard = ({ visible, onSit }: IntroCardProps) => {
  const t = useTranslations("os.intro");

  return (
    <section data-open={visible} aria-labelledby="intro-title" className="os-intro">
      <p className="text-sm text-haze">{t("greeting")}</p>
      <h1 id="intro-title" className="mt-1 text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
        {OWNER_NAME}
      </h1>
      <p className="mt-3 font-display text-lg font-light md:text-xl">{t("role")}</p>
      <p className="mt-3 max-w-[34ch] text-[15.5px] text-haze">{t("tagline")}</p>
      <p className="mt-4 flex items-center gap-2.5 text-sm">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sun" />
        <span>
          <span className="font-medium">{t("available")}</span>{" "}
          <span className="text-haze">{t("location")}</span>
        </span>
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={onSit} className="btn btn-sun">
          {t("sit")}
        </button>
        <a href={CV_HREF} target="_blank" rel="noreferrer" className="btn">
          {t("cv")}
        </a>
      </div>
      <a href="#desktop" onClick={onSit} className="link mt-4 inline-block text-sm">
        {t("direct")}
      </a>
    </section>
  );
};

export default IntroCard;
