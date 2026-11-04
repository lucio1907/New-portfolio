"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useRender3DStatus } from "../hooks/useCanRender3D";
import { dispatchExperience, getSnapshot, isRoomReady, setRoomReady, useExperience, useStatsVisible } from "@/features/experience/store";
import StatsOverlay, { type RenderStats } from "./StatsOverlay";

const sitDown = () => dispatchExperience({ type: "sit", animate: isRoomReady() });

// three.js and React Three Fiber live in this lazy chunk only. If it fails to
// load, the poster and the ring stay: the visitor can still sit down.
const RoomCanvas = dynamic(() => import("./RoomCanvas").catch(() => ({ default: () => null })), { ssr: false });

/** Lightweight stand-in while the 3D room loads: the diorama's silhouette. */
const RoomPoster = () => (
  <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
    <polygon points="350,590 840,845 840,862 350,607" fill="#14112A" />
    <polygon points="840,845 1095,605 1095,622 840,862" fill="#100E22" />
    <polygon points="630,385 1095,605 840,845 350,590" fill="#3A2738" />
    <polygon points="300,243 630,113 630,385 350,590" fill="#46396E" />
    <polygon points="630,113 1140,250 1095,605 630,385" fill="#3B3A85" />
    <polygon points="765,345 857,372 857,430 765,405" fill="#2C4AB0" />
  </svg>
);

/**
 * The room, and nothing else on screen: no card, no text. The poster renders on
 * the server and the 3D canvas replaces it once the page is idle. The ring on
 * the monitor is a real link, so it works before the canvas loads, without
 * JavaScript and from the keyboard. Without 3D (no WebGL, reduced motion or
 * data saving) the visitor goes straight to the desktop.
 */
const RoomStage = () => {
  const t = useTranslations("room");
  const status = useRender3DStatus();
  const { experience } = useExperience();
  const ring = useRef<HTMLAnchorElement>(null);
  const [rendered, setRendered] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [ringActive, setRingActive] = useState(false);
  const statsVisible = useStatsVisible();
  const [stats, setStats] = useState<RenderStats | null>(null);
  const inRoom = experience.mode === "room";

  const onRendered = useCallback(() => {
    setRoomReady(true);
    setRendered(true);
  }, []);

  useEffect(() => () => setRoomReady(false), []);

  // The camera moves the ring directly: no React render per frame.
  const onScreenMove = useCallback((x: number, y: number) => {
    ring.current?.style.setProperty("--ring-x", `${x}px`);
    ring.current?.style.setProperty("--ring-y", `${y}px`);
  }, []);

  const onActivate = useCallback(() => {
    setHovering(false);
    sitDown();
  }, []);

  useEffect(() => {
    if (status === "unavailable" && getSnapshot().experience.mode === "room") {
      dispatchExperience({ type: "sit", animate: false });
    }
  }, [status]);

  // Standing up brings keyboard focus back to the way in.
  const previousMode = useRef(experience.mode);
  useEffect(() => {
    if (experience.mode === "room" && previousMode.current !== "room") ring.current?.focus({ preventScroll: true });
    previousMode.current = experience.mode;
  }, [experience.mode]);

  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,#14173A_0%,#07091A_70%)]">
      <div className={`transition-opacity duration-700 ${rendered ? "opacity-0" : "opacity-100"}`}>
        <RoomPoster />
      </div>
      {status === "ready" && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${rendered ? "opacity-100" : "opacity-0"}`}>
          <RoomCanvas
            onRendered={onRendered}
            highlight={inRoom && (hovering || ringActive)}
            onScreenMove={onScreenMove}
            onHover={setHovering}
            onActivate={onActivate}
            statsEnabled={statsVisible}
            onStats={setStats}
          />
        </div>
      )}

      {statsVisible && <StatsOverlay stats={status === "ready" ? stats : null} />}

      <a
        ref={ring}
        href="#desktop"
        aria-label={t("sit")}
        data-visible={inRoom}
        className="room-ring"
        onClick={(event) => {
          event.preventDefault();
          onActivate();
        }}
        onPointerEnter={() => setRingActive(true)}
        onPointerLeave={() => setRingActive(false)}
        onFocus={() => setRingActive(true)}
        onBlur={() => setRingActive(false)}
      >
        <span aria-hidden="true" className="room-ring-dot" />
      </a>
    </div>
  );
};

export default RoomStage;
