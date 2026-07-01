"use client";

import React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LanguageToggle = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const nextLocale = locale === "es" ? "en" : "es";
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${hash}`, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label="Toggle language"
      className="flex items-center gap-1.5 rounded-full border border-white/[0.14] px-3 py-[7px] font-mono text-xs font-medium text-foreground transition-colors duration-200 hover:border-accent/60 hover:bg-accent/[0.08]"
    >
      <span className="text-accent">◐</span>
      {locale === "es" ? "ES / EN" : "EN / ES"}
    </button>
  );
};

export default LanguageToggle;
