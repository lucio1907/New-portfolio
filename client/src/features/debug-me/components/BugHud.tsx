"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDebugMe } from "../useDebugMe";
import BugIcon from "./BugIcon";

const BugHud = (): React.ReactElement => {
  const t = useTranslations("debug.hud");
  const { fixed, total, deployed, fixAll, reset } = useDebugMe();
  const percent = Math.round((fixed / total) * 100);

  return (
    <aside
      aria-label={t("region")}
      className="glass fixed bottom-3 left-3 right-3 z-40 flex items-center gap-3 rounded-card border border-border px-4 py-3 shadow-terminal sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px]"
    >
      <BugIcon
        className={`h-5 w-5 shrink-0 ${deployed ? "text-success" : "text-error"}`}
      />

      <div className="min-w-0 flex-1">
        <p
          role="status"
          aria-atomic="true"
          className="truncate font-mono text-[12.5px] text-foreground"
        >
          {deployed ? `✓ ${t("deployed")}` : t("status", { fixed, total })}
        </p>
        <div
          aria-hidden="true"
          className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-500 ease-out ${
              deployed ? "bg-success" : "bg-accent"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={deployed ? reset : fixAll}
        className="min-h-[44px] shrink-0 rounded-btn border border-white/[0.16] px-3 font-mono text-[11.5px] font-medium text-foreground transition-colors duration-200 hover:border-accent/60 hover:bg-accent/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {deployed ? t("reset") : t("recruiter")}
      </button>
    </aside>
  );
};

export default BugHud;
