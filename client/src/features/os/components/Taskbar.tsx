"use client";

import React from "react";
import { useTranslations } from "next-intl";
import AppIcon, { APP_TINTS } from "./AppIcon";
import Clock from "./Clock";
import LanguageToggle from "@/features/portfolio/components/LanguageToggle";
import { dispatchDesktop } from "@/features/experience/store";
import type { DesktopState } from "../lib/windows";
import { focusedApp } from "../lib/windows";

type TaskbarProps = { desktop: DesktopState; onStandUp: () => void };

/** Open windows (toggle focus/minimize), language, Buenos Aires clock, stand up. */
const Taskbar = ({ desktop, onStandUp }: TaskbarProps) => {
  const t = useTranslations("os");
  const focused = focusedApp(desktop);

  return (
    <footer aria-label={t("taskbar.label")} className="os-taskbar">
      <span
        aria-hidden="true"
        className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sun font-display text-[11px] font-semibold text-night"
      >
        LG
      </span>

      <ul aria-label={t("taskbar.openWindows")} className="hidden min-w-0 flex-1 gap-1.5 overflow-x-auto md:flex">
        {desktop.windows.map((window) => (
          <li key={window.app}>
            <button
              type="button"
              onClick={() => dispatchDesktop({ type: "toggle", app: window.app })}
              aria-pressed={focused === window.app}
              className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition-colors ${
                focused === window.app ? "bg-white/15 text-parchment" : "text-haze hover:bg-white/10"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded ${APP_TINTS[window.app]}`}>
                <AppIcon app={window.app} className="h-3.5 w-3.5" />
              </span>
              {t(`apps.${window.app}`)}
            </button>
          </li>
        ))}
      </ul>

      <div className="ml-auto flex items-center gap-2">
        <LanguageToggle />
        <Clock />
        <button type="button" onClick={onStandUp} className="btn min-h-[36px] px-3 text-sm">
          {t("taskbar.standUp")}
        </button>
      </div>
    </footer>
  );
};

export default Taskbar;
