"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import RoomScene from "./RoomScene";
import { QUALITY, type Tier, initialTier } from "../lib/quality";

const detectTier = (): Tier =>
  initialTier({
    mobile: window.matchMedia("(max-width: 767px), (pointer: coarse)").matches,
    cores: navigator.hardwareConcurrency ?? 4,
  });

type RoomCanvasProps = {
  /** Called once the first frame is on screen, to cross-fade from the poster. */
  onRendered: () => void;
  highlight: number | null;
  onHover: (id: number | null, x: number, y: number) => void;
  onActivate: (id: number) => void;
};

const RoomCanvas = ({ onRendered, highlight, onHover, onActivate }: RoomCanvasProps) => {
  const [tier] = useState<Tier>(detectTier);
  const settings = QUALITY[tier];

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, settings.maxDpr]}
      camera={{ fov: 40, near: 0.05, far: 30 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onRendered)}
    >
      <RoomScene settings={settings} highlight={highlight} onHover={onHover} onActivate={onActivate} />
    </Canvas>
  );
};

export default RoomCanvas;
