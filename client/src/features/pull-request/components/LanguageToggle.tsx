"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

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
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={nextLocale === "en" ? "Switch to English" : "Cambiar a español"}
      className="btn min-h-[36px] px-3 font-mono text-xs"
    >
      {locale.toUpperCase()}
      <span aria-hidden="true">→</span>
      {nextLocale.toUpperCase()}
    </button>
  );
};

export default LanguageToggle;
