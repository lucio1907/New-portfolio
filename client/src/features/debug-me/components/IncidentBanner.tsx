"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDebugMe } from "../useDebugMe";

const IncidentBanner = (): React.ReactElement => {
  const t = useTranslations("debug.incident");
  const { fixed, total, deployed } = useDebugMe();

  if (deployed) {
    return (
      <p className="sticker mb-7 rotate-1 bg-green">✓ {t("resolved")}</p>
    );
  }

  return (
    <div className="mb-7 flex max-w-[560px] overflow-hidden rounded-card border-3 border-ink bg-white shadow-brutal -rotate-1">
      <span aria-hidden="true" className="hazard-tape w-4 shrink-0 border-r-3 border-ink" />
      <p className="px-4 py-3 text-[15px] font-medium leading-[1.5]">
        <span className="mr-2 inline-block rounded-md border-2 border-ink bg-red px-1.5 font-mono text-xs font-bold text-ink">
          {t("label")}
        </span>
        {t("broken", { remaining: total - fixed })}
      </p>
    </div>
  );
};

export default IncidentBanner;
