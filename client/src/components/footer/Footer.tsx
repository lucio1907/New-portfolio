import React from "react";
import { useTranslations } from "next-intl";

const Footer = (): React.ReactElement => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 px-5 py-9 md:px-10">
        <span className="flex items-center gap-3 font-mono text-base font-bold">
          <span className="flex h-9 w-9 -rotate-6 items-center justify-center rounded-btn border-3 border-paper bg-yellow text-sm text-ink">
            LG
          </span>
          Lucio Gastellu
        </span>
        <span className="font-mono text-xs font-medium">{t("note")}</span>
      </div>
    </footer>
  );
};

export default Footer;
