import React from "react";
import { useTranslations } from "next-intl";
import LanguageToggle from "./LanguageToggle";
import { CV_HREF } from "../lib/constants";

const NAV = ["about", "experience", "stack", "projects", "contact"] as const;

/** Slim sticky header: home mark, section links (desktop), language and CV. */
const SiteHeader = () => {
  const t = useTranslations("site");

  return (
    <header className="sticky top-0 z-40 border-b border-orbit/60 bg-night/80 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-sun focus:px-4 focus:py-2 focus:text-night"
      >
        {t("skip")}
      </a>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 md:px-10 lg:pl-16">
        <a href="#home" aria-label={t("header.home")} className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative flex h-8 w-8 items-center justify-center rounded-full bg-sun font-display text-[11px] font-semibold text-night"
          >
            LG
            <span className="absolute -inset-x-2 inset-y-2.5 -rotate-[20deg] rounded-[50%] border border-sky/70" />
          </span>
        </a>

        <nav aria-label={t("nav.label")} className="hidden lg:block">
          <ul className="flex gap-6 text-[15px] text-haze">
            {NAV.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="transition-colors hover:text-parchment">
                  {t(`nav.${id}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a
            href={CV_HREF}
            target="_blank"
            rel="noreferrer"
            aria-label={t("header.cvLabel")}
            className="btn min-h-[36px] px-4 text-sm"
          >
            {t("header.cv")}
          </a>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
