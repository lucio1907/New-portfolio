"use client";

import React, { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import Desktop from "./Desktop";
import type { AppId } from "../lib/apps";
import { appFromHash, hashForApp } from "../lib/hash";
import { focusedApp } from "../lib/windows";
import { dispatchDesktop, dispatchExperience, getSnapshot, toggleStats, useExperience } from "@/features/experience/store";
import { OWNER_NAME } from "@/features/portfolio/lib/constants";

type OsShellProps = {
  contents: Record<AppId, React.ReactNode>;
  /** The room (3D or its poster) the visitor sits down in. */
  backdrop?: React.ReactNode;
};

const DESKTOP_HASH = "#desktop";
const pathWithHash = (hash: string) => `${window.location.pathname}${window.location.search}${hash}`;

/**
 * `#<app>` sits the visitor down and opens that app. `#desktop` sits them
 * down; when already on the desktop (Back, or the mobile back arrow) it
 * closes the window in front.
 */
const syncFromHash = () => {
  const { hash } = window.location;
  const app = appFromHash(hash);
  if (hash !== DESKTOP_HASH && !app) return;
  const { experience, desktop } = getSnapshot();
  if (experience.mode === "room") dispatchExperience({ type: "sit", animate: false });
  if (app) dispatchDesktop({ type: "open", app });
  else if (experience.mode === "desktop") {
    const front = focusedApp(desktop);
    if (front) dispatchDesktop({ type: "close", app: front });
  }
};

/** Fixed, no-scroll app shell: the room, or the LucioOS desktop on top of it. */
const OsShell = ({ contents, backdrop }: OsShellProps) => {
  const t = useTranslations("os.identity");
  const { experience, desktop } = useExperience();
  const focused = focusedApp(desktop);
  const onDesktop = experience.mode === "desktop";

  // Before hydration CSS `:target` opens windows; afterwards the store does.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);

  // A hello for developers who open the console.
  useEffect(() => {
    console.info(
      "%c  .--------.\n  | LucioOS |  Built with Next.js + Three.js. No models downloaded.\n  '--------'  Press ` for live render stats, or open the Terminal app.",
      "color:#FFC94A;font-family:monospace",
    );
  }, []);

  // ` toggles the developer stats overlay (not while typing).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement | null)?.closest("input, textarea");
      if (event.key === "`" && !typing) toggleStats();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Deep links (`/es#projects`) and Back/Forward between windows.
  useEffect(() => {
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  // The URL follows the focused window, so any view is shareable.
  useEffect(() => {
    if (!onDesktop) return;
    const hash = hashForApp(focused) || DESKTOP_HASH;
    if (hash !== window.location.hash) window.history.replaceState(null, "", pathWithHash(hash));
  }, [onDesktop, focused]);

  // Keyboard focus follows the window that comes to the front (or the
  // control inside it marked data-autofocus, like the terminal prompt).
  useEffect(() => {
    if (!focused) return;
    const frame = document.getElementById(focused);
    const target = frame?.querySelector<HTMLElement>("[data-autofocus]") ?? frame;
    target?.focus({ preventScroll: true });
  }, [focused]);

  // Safety net: if the camera flight never reports back, open the desktop anyway.
  useEffect(() => {
    if (experience.mode !== "sitting") return;
    const timer = setTimeout(() => dispatchExperience({ type: "arrived" }), 2500);
    return () => clearTimeout(timer);
  }, [experience.mode]);

  const standUp = useCallback(() => {
    dispatchDesktop({ type: "closeAll" });
    dispatchExperience({ type: "stand" });
    window.history.replaceState(null, "", pathWithHash(""));
  }, []);

  // Esc closes the focused window; on an empty desktop it stands you up.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || getSnapshot().experience.mode !== "desktop") return;
      const app = focusedApp(getSnapshot().desktop);
      if (app) dispatchDesktop({ type: "close", app });
      else standUp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [standUp]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* The room shows no text, but the page still says whose it is. */}
      <h1 className="sr-only">
        {OWNER_NAME}, {t("role")}
      </h1>
      <div aria-hidden={onDesktop} className="absolute inset-0">
        {backdrop}
      </div>
      <Desktop visible={onDesktop} desktop={desktop} contents={contents} onStandUp={standUp} />
    </div>
  );
};

export default OsShell;
