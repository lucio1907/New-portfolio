"use client";

import React from "react";

export type RenderStats = {
  fps: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  dpr: number;
  tier: string;
  paused: boolean;
};

/** Live numbers from renderer.info, for developers (toggle with `). */
const StatsOverlay = ({ stats }: { stats: RenderStats | null }) => (
  <aside
    aria-label="Rendering stats"
    className="pointer-events-none fixed right-4 top-4 z-[80] w-72 rounded-xl border border-orbit bg-[#0A0E26]/90 p-3 font-mono text-[12px] leading-5 text-parchment shadow-xl backdrop-blur"
  >
    <p className="mb-1 text-sun">LucioOS · renderer</p>
    {stats ? (
      <dl className="grid grid-cols-[1fr_auto] gap-x-3">
        <dt className="text-haze">fps</dt>
        <dd>{stats.paused ? "paused (desktop)" : stats.fps === 0 ? "0 · idle, on demand" : stats.fps}</dd>
        <dt className="text-haze">draw calls</dt>
        <dd>{stats.drawCalls}</dd>
        <dt className="text-haze">triangles</dt>
        <dd>{stats.triangles.toLocaleString("en")}</dd>
        <dt className="text-haze">geometries</dt>
        <dd>{stats.geometries}</dd>
        <dt className="text-haze">textures</dt>
        <dd>{stats.textures}</dd>
        <dt className="text-haze">shader programs</dt>
        <dd>{stats.programs}</dd>
        <dt className="text-haze">pixel ratio</dt>
        <dd>
          {stats.dpr.toFixed(2)} · {stats.tier}
        </dd>
      </dl>
    ) : (
      <p className="text-haze">3D room not loaded (no WebGL or reduced motion).</p>
    )}
    <p className="mt-2 text-haze">0 models downloaded · procedural geometry</p>
  </aside>
);

export default StatsOverlay;
