"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

/** Names the other language in that language, so its speakers can find it. */
const LanguageToggle = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale = locale === "es" ? "en" : "es";

  const toggleLocale = () => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${hash}`, { locale: nextLocale });
  };

  return (
    <button type="button" lang={nextLocale} onClick={toggleLocale} className="nav-link">
      {nextLocale === "en" ? "English" : "Español"}
    </button>
  );
};

export default LanguageToggle;
