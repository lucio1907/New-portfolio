/** Rendering quality tiers; the scene starts at one and can only step down. */
export type Tier = "high" | "medium" | "low";

export type QualitySettings = {
  /** Radial segments for cylinders, lathes and cones. */
  curveSegments: number;
  /** Size in meters of the cells that hold baked light on big surfaces. */
  bakeCell: number;
  /** Shadow rays per light in the light bake (1 = hard shadows). */
  bakeSamples: number;
  maxDpr: number;
};

export const QUALITY: Record<Tier, QualitySettings> = {
  high: { curveSegments: 16, bakeCell: 0.12, bakeSamples: 4, maxDpr: 1.5 },
  medium: { curveSegments: 12, bakeCell: 0.15, bakeSamples: 2, maxDpr: 1.25 },
  low: { curveSegments: 8, bakeCell: 0.2, bakeSamples: 1, maxDpr: 1.25 },
};

export const initialTier = ({ mobile, cores }: { mobile: boolean; cores: number }): Tier => {
  if (mobile) return "low";
  return cores >= 4 ? "high" : "medium";
};

export const lowerTier = (tier: Tier): Tier =>
  tier === "high" ? "medium" : "low";
