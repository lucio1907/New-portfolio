"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { BUG_IDS } from "../model/bugs";
import { useDebugMe } from "../useDebugMe";
import BugIcon from "./BugIcon";

const BugHud = (): React.ReactElement => {
  const t = useTranslations("debug.hud");
  const { state, fixed, total, deployed, fixAll, reset } = useDebugMe();

  return (
    <aside
      aria-label={t("region")}
      className={`fixed bottom-3 left-3 right-3 z-40 flex items-center gap-3 rounded-card border-3 border-ink px-3 py-3 shadow-brutal sm:bottom-6 sm:left-auto sm:right-6 sm:w-[460px] ${
        deployed ? "bg-green" : "bg-white"
      }`}
    >
      <BugIcon
        className={`h-8 w-8 shrink-0 sm:h-9 sm:w-9 ${deployed ? "text-yellow" : "text-red motion-safe:animate-wiggle"}`}
      />

      <div className="min-w-0 flex-1">
        <p
          role="status"
          aria-atomic="true"
          className="font-mono text-[12px] font-bold leading-snug sm:text-[13px]"
        >
          {deployed ? `✓ ${t("deployed")}` : t("status", { fixed, total })}
        </p>
        <div aria-hidden="true" className="mt-1.5 flex gap-1">
          {BUG_IDS.map((id) => (
            <span
              key={id}
              className={`h-2.5 flex-1 rounded-sm border-2 border-ink transition-colors duration-300 ${
                state[id] ? "bg-ink" : "bg-paper"
              }`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={deployed ? reset : fixAll}
        className={`brutal-btn min-h-[44px] max-w-[48%] px-3 py-1.5 text-[12.5px] leading-tight sm:max-w-none sm:shrink-0 sm:text-[13px] ${
          deployed ? "bg-white" : "bg-yellow"
        }`}
      >
        {deployed ? t("reset") : t("recruiter")}
      </button>
    </aside>
  );
};

export default BugHud;
