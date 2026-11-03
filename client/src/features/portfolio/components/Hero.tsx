import React from "react";
import { useTranslations } from "next-intl";
import { CV_HREF, EMAIL, OWNER_NAME } from "../lib/constants";
import { SECTIONS, formatCoordinate } from "../lib/sections";

const home = SECTIONS[0];

/** First screen: who, what, availability and the three actions a recruiter needs. */
const Hero = () => {
  const t = useTranslations("site");

  return (
    <section
      id="home"
      data-section="home"
      aria-labelledby="home-title"
      className="flex min-h-[calc(100svh-4rem)] flex-col justify-center py-16"
    >
      <p className="coordinate mb-6">
        <span className="sr-only">{t("coordinateLabel")}: </span>
        {formatCoordinate(home.lat, home.lon)}
      </p>
      <h1
        id="home-title"
        className="text-[clamp(3rem,9vw,6.75rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
      >
        {OWNER_NAME}
      </h1>
      <p className="mt-6 font-display text-[22px] font-light md:text-[26px]">{t("hero.role")}</p>
      <p className="mt-5 max-w-prose text-haze">{t("hero.intro")}</p>

      <p className="mt-6 flex items-center gap-3">
        <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-sun/60 motion-safe:animate-ping" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-sun" />
        </span>
        <span>
          <span className="font-medium">{t("hero.available")}</span>
          <span className="block text-sm text-haze sm:ml-2 sm:inline">{t("hero.location")}</span>
        </span>
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <a href={`mailto:${EMAIL}`} className="btn btn-sun">
          {t("hero.email")}
        </a>
        <a href={CV_HREF} target="_blank" rel="noreferrer" className="btn">
          {t("hero.cv")}
        </a>
        <a href="#projects" className="link ml-2">
          {t("hero.projects")}
        </a>
      </div>
    </section>
  );
};

export default Hero;
