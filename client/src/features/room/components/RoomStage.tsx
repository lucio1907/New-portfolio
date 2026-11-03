"use client";

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useRender3DStatus } from "../hooks/useCanRender3D";
import { HOTSPOTS, hotspotById } from "../lib/hotspots";
import { dispatchDesktop, dispatchExperience, getSnapshot, setRoomReady, useExperience, useStatsVisible } from "@/features/experience/store";
import StatsOverlay, { type RenderStats } from "./StatsOverlay";
import type { AppId } from "@/features/os/lib/apps";

/** Sit down at the computer, opening an app on arrival when given. */
export const sitDown = (app: AppId | null) => {
  if (app) dispatchDesktop({ type: "open", app });
  dispatchExperience({ type: "sit", animate: true });
};

type Hover = { id: number; x: number; y: number } | null;

// three.js and React Three Fiber live in this lazy chunk only.
const RoomCanvas = dynamic(() => import("./RoomCanvas"), { ssr: false });

/** Lightweight CSS stand-in while the 3D room loads (night window + desk). */
const RoomPoster = () => (
  <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#151D52_0%,#0F1640_70%,#1B1538_100%)]">
    <div className="absolute right-[12%] top-[16%] h-[36%] w-[24%] rounded-sm border-[6px] border-[#CFC6B0]/70 bg-[radial-gradient(1px_1px_at_20%_30%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_70%_20%,#EEE8DA_99%,transparent),radial-gradient(1px_1px_at_45%_60%,#A9AECC_99%,transparent),linear-gradient(180deg,#0B1030,#2A3A80)]" />
    <div className="absolute bottom-[30%] right-[8%] h-[3%] w-[48%] rounded-sm bg-[#A06B45]/80" />
    <div className="absolute bottom-[33%] right-[22%] h-[20%] w-[18%] rounded-md border-[6px] border-[#11152E] bg-[#24306E]" />
  </div>
);

/**
 * The room behind the intro card. The CSS poster renders on the server; the
 * 3D canvas replaces it once the page is idle. Without 3D (no WebGL, reduced
 * motion or data saving) the visitor goes straight to the desktop.
 */
const RoomStage = () => {
  const t = useTranslations("room");
  const status = useRender3DStatus();
  const { experience } = useExperience();
  const [rendered, setRendered] = useState(false);
  const [hover, setHover] = useState<Hover>(null);
  const [focusId, setFocusId] = useState<number | null>(null);
  const statsVisible = useStatsVisible();
  const [stats, setStats] = useState<RenderStats | null>(null);
  const inRoom = experience.mode === "room";

  const onRendered = useCallback(() => {
    setRoomReady(true);
    setRendered(true);
  }, []);

  useEffect(() => () => setRoomReady(false), []);

  const onHover = useCallback((id: number | null, x: number, y: number) => {
    setHover(id === null ? null : { id, x, y });
  }, []);

  const onActivate = useCallback((id: number) => {
    setHover(null);
    sitDown(hotspotById(id)?.app ?? null);
  }, []);

  const highlight = inRoom ? (focusId ?? hover?.id ?? null) : null;
  const hovered = hover && inRoom ? hotspotById(hover.id) : null;

  useEffect(() => {
    if (status === "unavailable" && getSnapshot().experience.mode === "room") {
      dispatchExperience({ type: "sit", animate: false });
    }
  }, [status]);

  return (
    <div className="absolute inset-0">
      <div className={`transition-opacity duration-700 ${rendered ? "opacity-0" : "opacity-100"}`}>
        <RoomPoster />
      </div>
      {status === "ready" && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${rendered ? "opacity-100" : "opacity-0"}`}>
          <RoomCanvas
            onRendered={onRendered}
            highlight={highlight}
            onHover={onHover}
            onActivate={onActivate}
            statsEnabled={statsVisible}
            onStats={setStats}
          />
        </div>
      )}

      {statsVisible && <StatsOverlay stats={status === "ready" ? stats : null} />}

      {hovered && (
        <p
          role="status"
          className="pointer-events-none fixed z-30 rounded-full bg-sun px-3 py-1 text-sm font-medium text-night shadow-lg"
          style={{ left: hover!.x + 14, top: hover!.y + 14 }}
        >
          {t(`hotspots.${hovered.name}`)}
        </p>
      )}

      {/* Keyboard path to every object: focusing one makes it glow. */}
      {status === "ready" && inRoom && (
        <ul aria-label={t("objectsLabel")} className="absolute right-4 top-4 z-30 flex flex-col items-end gap-2">
          {HOTSPOTS.filter((hotspot) => hotspot.name !== "chair").map((hotspot) => (
            <li key={hotspot.name}>
              <button
                type="button"
                onFocus={() => setFocusId(hotspot.id)}
                onBlur={() => setFocusId(null)}
                onClick={() => sitDown(hotspot.app)}
                className="sr-only rounded-full bg-sun px-3 py-1.5 text-sm font-medium text-night focus:not-sr-only"
              >
                {t(`hotspots.${hotspot.name}`)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomStage;
