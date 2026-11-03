"use client";

import React from "react";
import { useTranslations } from "next-intl";
import AppIcon, { APP_TINTS } from "./AppIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";
import { APPS, type AppId } from "../lib/apps";
import { type DesktopState, focusedApp } from "../lib/windows";
import { CV_HREF } from "@/features/portfolio/lib/constants";

/** Apps shown as desktop icons (the terminal joins in a later unit). */
const DESKTOP_APPS = APPS.filter((app) => app.id !== "terminal");

/** Cascade so new windows never open exactly on top of each other. */
const cascade = (app: AppId) => {
  const index = APPS.findIndex((item) => item.id === app);
  return { x: 150 + index * 34, y: 28 + index * 26 };
};

type DesktopProps = {
  visible: boolean;
  desktop: DesktopState;
  contents: Record<AppId, React.ReactNode>;
  onStandUp: () => void;
};

const iconClassName =
  "group flex w-24 flex-col items-center gap-1.5 rounded-xl p-2 text-center text-[13px] leading-tight text-parchment transition-colors hover:bg-white/10 md:w-[5.5rem]";

const Tile = ({ app }: { app: AppId | "cv" }) => (
  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-black/30 md:h-12 md:w-12 md:rounded-xl ${APP_TINTS[app]}`}>
    <AppIcon app={app} className="h-7 w-7 md:h-6 md:w-6" />
  </span>
);

/** LucioOS: wallpaper, app icons, windows and the taskbar. */
const Desktop = ({ visible, desktop, contents, onStandUp }: DesktopProps) => {
  const t = useTranslations("os");
  const focused = focusedApp(desktop);

  return (
    <div id="desktop" data-open={visible} aria-label={t("desktopLabel")} className="os-desktop">
      <nav aria-label={t("iconsLabel")} className="os-icons">
        {DESKTOP_APPS.map(({ id }) => (
          <a key={id} href={`#${id}`} className={iconClassName}>
            <Tile app={id} />
            {t(`apps.${id}`)}
          </a>
        ))}
        <a href={CV_HREF} target="_blank" rel="noreferrer" className={iconClassName}>
          <Tile app="cv" />
          {t("apps.cv")}
        </a>
      </nav>

      {APPS.map(({ id }) => {
        const index = desktop.windows.findIndex((window) => window.app === id);
        const state = desktop.windows[index];
        return (
          <Window
            key={id}
            app={id}
            title={t(`apps.${id}`)}
            open={Boolean(state && !state.minimized)}
            focused={focused === id}
            zIndex={10 + Math.max(index, 0)}
            position={state?.position ?? cascade(id)}
          >
            {contents[id]}
          </Window>
        );
      })}

      <Taskbar desktop={desktop} onStandUp={onStandUp} />
    </div>
  );
};

export default Desktop;
