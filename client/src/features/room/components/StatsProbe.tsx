"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { RenderStats } from "./StatsOverlay";
import { getSnapshot } from "@/features/experience/store";

type StatsProbeProps = { enabled: boolean; tier: string; onStats: (stats: RenderStats) => void };

/** Samples renderer.info twice a second while the stats overlay is open. */
const StatsProbe = ({ enabled, tier, onStats }: StatsProbeProps) => {
  const get = useThree((state) => state.get);

  useEffect(() => {
    if (!enabled) return;
    const { gl } = get();
    let lastFrame = gl.info.render.frame;
    let lastTime = performance.now();
    const sample = () => {
      const now = performance.now();
      const frames = gl.info.render.frame - lastFrame;
      const elapsed = now - lastTime;
      // The first sample has no elapsed time yet: report 0 instead of NaN.
      const fps = elapsed > 0 ? Math.round((frames * 1000) / elapsed) : 0;
      lastFrame = gl.info.render.frame;
      lastTime = now;
      onStats({
        fps,
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        programs: gl.info.programs?.length ?? 0,
        dpr: gl.getPixelRatio(),
        tier,
        paused: getSnapshot().experience.mode === "desktop",
      });
    };
    sample();
    const timer = setInterval(sample, 500);
    return () => clearInterval(timer);
  }, [enabled, get, tier, onStats]);

  return null;
};

export default StatsProbe;
