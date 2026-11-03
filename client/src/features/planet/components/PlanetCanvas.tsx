"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { QUALITY, type Tier, initialTier } from "../lib/quality";

const detectTier = (): Tier =>
  initialTier({
    mobile: window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches,
    cores: navigator.hardwareConcurrency ?? 4,
  });

type PlanetCanvasProps = {
  /** Called once the first frame is on screen, to cross-fade from the poster. */
  onRendered: () => void;
};

const PlanetCanvas = ({ onRendered }: PlanetCanvasProps) => {
  const [tier] = useState<Tier>(detectTier);
  const settings = QUALITY[tier];

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, settings.maxDpr]}
      camera={{ position: [0, 0, 10.5], fov: 32, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => requestAnimationFrame(onRendered)}
      style={{ pointerEvents: "none" }}
    >
      <Scene settings={settings} />
    </Canvas>
  );
};

export default PlanetCanvas;
