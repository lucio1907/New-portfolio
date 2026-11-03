import React from "react";
import { useTranslations } from "next-intl";
import LanguageToggle from "./LanguageToggle";
import { DownloadIcon } from "./Icons";

export const AUTHOR = "lucio1907";
export const CV_HREF = "/CV-LucioGastellu.pdf";

/** Repository bar: owner / repo breadcrumb, language switch and CV download. */
const TopBar = (): React.ReactElement => {
  const t = useTranslations("pr.topbar");

  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3 md:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-2.5 text-[15px]">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-box bg-fg font-mono text-xs font-bold text-canvas"
          >
            LG
          </span>
          <span className="truncate">
            <span className="text-link">{AUTHOR}</span>
            <span className="mx-1 text-muted">/</span>
            <span className="font-semibold text-link">portfolio</span>
          </span>
          <span className="label-chip hidden border-line text-muted sm:inline-flex">
            {t("visibility")}
          </span>
        </a>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <a
            href={CV_HREF}
            target="_blank"
            rel="noreferrer"
            aria-label={t("cv")}
            className="btn min-h-[36px] px-3"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">{t("cv")}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
