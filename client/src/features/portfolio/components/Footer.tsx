import React from "react";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="border-t border-orbit/60">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-haze md:px-10 lg:pl-16">
        <p>{t("footer.note")}</p>
        <p>{t("site.footer.built")}</p>
      </div>
    </footer>
  );
};

export default Footer;
