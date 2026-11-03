import { createRandom } from "./random.ts";
import { createNoise3D, fbm3 } from "./noise.ts";
import { type Vec3, angleBetween } from "./sphere.ts";

/** Planet radius in world units; the ocean surface sits exactly here. */
export const PLANET_RADIUS = 2;
/** Terrain never rises or sinks further than this from the ocean surface. */
export const MAX_HEIGHT = 0.17;
/** Flat plateau height under every landmark (dry land, above the ocean). */
export const LANDMARK_HEIGHT = 0.06;

const AMPLITUDE = 0.2;
const FREQUENCY = 0.85;
/** Bias that turns roughly 60% of the surface into land. */
const LAND_BIAS = 0.16;
/** Landmarks get a flat plaza within INNER and blend back by OUTER (radians). */
const FLATTEN_INNER = 0.2;
const FLATTEN_OUTER = 0.36;

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export type Terrain = { heightAt: (direction: Vec3) => number };

type TerrainOptions = { seed: number; landmarks: readonly Vec3[] };

export const createTerrain = ({ seed, landmarks }: TerrainOptions): Terrain => {
  const noise = createNoise3D(createRandom(seed));

  const rawHeight = ([x, y, z]: Vec3) => {
    const length = Math.hypot(x, y, z);
    const value = fbm3(noise, (x / length) * FREQUENCY, (y / length) * FREQUENCY, (z / length) * FREQUENCY, 4);
    const biased = value + LAND_BIAS;
    // Push mountains up a little more than valleys go down.
    const shaped = biased > 0 ? biased ** 1.25 : biased;
    return Math.max(-MAX_HEIGHT, Math.min(MAX_HEIGHT, shaped * AMPLITUDE * 1.15));
  };

  return {
    heightAt(direction) {
      const height = rawHeight(direction);
      let blend = 1;
      for (const landmark of landmarks) {
        blend = Math.min(blend, smoothstep(FLATTEN_INNER, FLATTEN_OUTER, angleBetween(direction, landmark)));
      }
      if (blend >= 1) return height;
      return LANDMARK_HEIGHT + (height - LANDMARK_HEIGHT) * blend;
    },
  };
};

/** Biome colors (sRGB hex) by height above the ocean surface. */
export const biomeColor = (height: number): string => {
  if (height < -0.02) return "#24456E";
  if (height < 0.018) return "#E8CF96";
  if (height < 0.07) return "#82B95F";
  if (height < 0.105) return "#4E8C57";
  if (height < 0.135) return "#8A8175";
  return "#F2EEE4";
};
