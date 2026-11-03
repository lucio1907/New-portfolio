"use client";

import React, { useCallback, useEffect } from "react";
import Desktop from "./Desktop";
import IntroCard from "./IntroCard";
import type { AppId } from "../lib/apps";
import { appFromHash, hashForApp } from "../lib/hash";
import { focusedApp } from "../lib/windows";
import { dispatchDesktop, dispatchExperience, getSnapshot, isRoomReady, useExperience } from "@/features/experience/store";

type OsShellProps = {
  contents: Record<AppId, React.ReactNode>;
  /** The room (3D or its poster) behind the intro card. */
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

/** Fixed, no-scroll app shell: room + intro card, or the LucioOS desktop. */
const OsShell = ({ contents, backdrop }: OsShellProps) => {
  const { experience, desktop } = useExperience();
  const focused = focusedApp(desktop);
  const onDesktop = experience.mode === "desktop";

  // Before hydration CSS `:target` opens windows; afterwards the store does.
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
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

  // Keyboard focus follows the window that comes to the front.
  useEffect(() => {
    if (focused) document.getElementById(focused)?.focus({ preventScroll: true });
  }, [focused]);

  // Animate only when the 3D room is on screen; otherwise open instantly.
  const sit = useCallback(() => dispatchExperience({ type: "sit", animate: isRoomReady() }), []);

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
      <div aria-hidden={onDesktop} className="absolute inset-0">
        {backdrop}
      </div>
      <IntroCard visible={experience.mode === "room"} onSit={sit} />
      <Desktop visible={onDesktop} desktop={desktop} contents={contents} onStandUp={standUp} />
    </div>
  );
};

export default OsShell;
