import React from "react";
import { useTranslations } from "next-intl";

const Footer = (): React.ReactElement => {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border-soft bg-accent/[0.04]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-5 py-9 md:px-10">
        <span className="font-mono text-[15px] font-semibold text-foreground">
          <span className="text-accent">&lt;</span>Lucio Gastellu
          <span className="text-accent">/&gt;</span>
        </span>
        <span className="font-mono text-xs text-faint">{t("note")}</span>
      </div>
    </footer>
  );
};

export default Footer;
