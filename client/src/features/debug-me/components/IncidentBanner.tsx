"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDebugMe } from "../useDebugMe";

const IncidentBanner = (): React.ReactElement => {
  const t = useTranslations("debug.incident");
  const { fixed, total, deployed } = useDebugMe();

  return (
    <div
      className={`mb-8 inline-flex max-w-full items-start gap-3 rounded-row border px-4 py-3 font-mono text-[12.5px] leading-[1.6] ${
        deployed
          ? "border-success/30 bg-success/[0.06] text-success"
          : "border-error/30 bg-error/[0.06] text-error"
      }`}
    >
      <span
        aria-hidden="true"
        className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${
          deployed ? "bg-success" : "bg-error motion-safe:animate-pulse"
        }`}
      />
      <span>
        {!deployed && (
          <span className="mr-2 font-medium tracking-[0.08em]">
            {t("label")}
          </span>
        )}
        <span className={deployed ? undefined : "text-foreground/85"}>
          {deployed ? t("resolved") : t("broken", { remaining: total - fixed })}
        </span>
      </span>
    </div>
  );
};

export default IncidentBanner;
