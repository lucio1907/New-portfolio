import React from "react";
import { useTranslations } from "next-intl";
import LanguageToggle from "./LanguageToggle";
import SmoothLink from "./SmoothLink";
import { CV_HREF, OWNER_NAME } from "../lib/constants";

const SECTIONS = ["work", "trajectory", "contact"] as const;

/** The hero's name lands here as the page scrolls. */
const Nav = () => {
  const t = useTranslations("nav");

  return (
    <header className="site-nav">
      <SmoothLink href="#top" aria-label={t("home")} data-nav-name className="nav-name">
        {OWNER_NAME}
      </SmoothLink>
      <nav className="flex items-center gap-3 md:gap-6">
        {SECTIONS.map((id) => (
          <SmoothLink key={id} href={`#${id}`} className="nav-link hidden md:inline-flex">
            {t(id)}
          </SmoothLink>
        ))}
        <a href={CV_HREF} target="_blank" rel="noreferrer" className="nav-link">
          {t("cv")}
        </a>
        <LanguageToggle />
      </nav>
    </header>
  );
};

export default Nav;
