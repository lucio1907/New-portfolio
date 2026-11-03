import React from "react";
import { useTranslations } from "next-intl";

const Footer = (): React.ReactElement => {
  const t = useTranslations("footer");

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted md:px-6">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-md bg-fg font-mono text-[10px] font-bold text-canvas"
          >
            LG
          </span>
          Lucio Gastellu
        </span>
        <span>{t("note")}</span>
      </div>
    </footer>
  );
};

export default Footer;
