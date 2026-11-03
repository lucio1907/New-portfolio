/** Rendering quality tiers; the scene starts at one and can only step down. */
export type Tier = "high" | "medium" | "low";

export type QualitySettings = {
  planetDetail: number;
  oceanDetail: number;
  stars: number;
  maxDpr: number;
};

export const QUALITY: Record<Tier, QualitySettings> = {
  high: { planetDetail: 30, oceanDetail: 14, stars: 1500, maxDpr: 1.5 },
  medium: { planetDetail: 20, oceanDetail: 10, stars: 900, maxDpr: 1.25 },
  low: { planetDetail: 14, oceanDetail: 7, stars: 500, maxDpr: 1.25 },
};

export const initialTier = ({ mobile, cores }: { mobile: boolean; cores: number }): Tier => {
  if (mobile) return "low";
  return cores >= 4 ? "high" : "medium";
};

export const lowerTier = (tier: Tier): Tier =>
  tier === "high" ? "medium" : "low";
