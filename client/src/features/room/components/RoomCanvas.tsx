"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import RoomScene from "./RoomScene";
import StatsProbe from "./StatsProbe";
import type { RenderStats } from "./StatsOverlay";
import { QUALITY, type Tier, initialTier } from "../lib/quality";

const detectTier = (): Tier =>
  initialTier({
    mobile: window.matchMedia("(max-width: 767px), (pointer: coarse)").matches,
    cores: navigator.hardwareConcurrency ?? 4,
  });

type RoomCanvasProps = {
  /** Called once the finished room is on screen, to cross-fade from the poster. */
  onRendered: () => void;
  highlight: boolean;
  onScreenMove: (x: number, y: number) => void;
  onHover: (hovering: boolean) => void;
  onActivate: () => void;
  statsEnabled: boolean;
  onStats: (stats: RenderStats) => void;
};

const RoomCanvas = ({ onRendered, highlight, onScreenMove, onHover, onActivate, statsEnabled, onStats }: RoomCanvasProps) => {
  const [tier] = useState<Tier>(detectTier);
  const settings = QUALITY[tier];

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, settings.maxDpr]}
      camera={{ fov: 30, near: 0.05, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <RoomScene settings={settings} onReady={onRendered} highlight={highlight} onScreenMove={onScreenMove} onHover={onHover} onActivate={onActivate} />
      <StatsProbe enabled={statsEnabled} tier={tier} onStats={onStats} />
    </Canvas>
  );
};

export default RoomCanvas;
