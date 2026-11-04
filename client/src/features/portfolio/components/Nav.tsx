import React from "react";
import { useTranslations } from "next-intl";
import LanguageToggle from "./LanguageToggle";
import { CV_HREF, OWNER_NAME } from "../lib/constants";

/** The hero's name lands here as the page scrolls. */
const Nav = () => {
  const t = useTranslations("nav");

  return (
    <header className="site-nav">
      <a href="#top" aria-label={t("home")} data-nav-name className="nav-name">
        {OWNER_NAME}
      </a>
      <nav className="flex items-center gap-5">
        <a href={CV_HREF} target="_blank" rel="noreferrer" className="nav-link">
          {t("cv")}
        </a>
        <LanguageToggle />
      </nav>
    </header>
  );
};

export default Nav;
