import React from "react";

/**
 * Lightweight stand-in for the 3D planet: pure CSS, no image request.
 * Shown before WebGL loads and kept when WebGL is unavailable.
 */
const PlanetPoster = () => (
  <div aria-hidden="true" className="relative aspect-square w-[min(78%,520px)]">
    {/* Atmosphere glow */}
    <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,rgba(140,203,255,0.22)_55%,transparent_70%)]" />
    {/* Planet body: lit from the upper left */}
    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,#F4DDA6_0%,#9CCB7E_22%,#4F9A72_40%,#2C6E8F_62%,#1A2C66_86%,#121A48_100%)] shadow-[inset_-28px_-36px_60px_rgba(8,10,40,0.65)]" />
    {/* Moon */}
    <div className="absolute -right-[6%] top-[8%] h-[9%] w-[9%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#F1EEE6,#9BA0B8)]" />
  </div>
);

export default PlanetPoster;
