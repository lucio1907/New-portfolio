/** Rendering quality tiers; the scene starts at one and can only step down. */
export type Tier = "high" | "medium" | "low";

export type QualitySettings = {
  /** Radial segments for cylinders, lathes and cones. */
  curveSegments: number;
  /** Stars visible through the window. */
  stars: number;
  maxDpr: number;
};

export const QUALITY: Record<Tier, QualitySettings> = {
  high: { curveSegments: 16, stars: 600, maxDpr: 1.5 },
  medium: { curveSegments: 12, stars: 400, maxDpr: 1.25 },
  low: { curveSegments: 8, stars: 220, maxDpr: 1.25 },
};

export const initialTier = ({ mobile, cores }: { mobile: boolean; cores: number }): Tier => {
  if (mobile) return "low";
  return cores >= 4 ? "high" : "medium";
};

export const lowerTier = (tier: Tier): Tier =>
  tier === "high" ? "medium" : "low";
