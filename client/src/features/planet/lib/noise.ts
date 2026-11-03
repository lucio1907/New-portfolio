import type { Random } from "./random.ts";

/**
 * 3D simplex noise (after Stefan Gustavson's reference implementation) with a
 * seeded permutation table, plus fractal Brownian motion on top of it.
 */
export type Noise3D = (x: number, y: number, z: number) => number;

const GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
] as const;

const F3 = 1 / 3;
const G3 = 1 / 6;

export const createNoise3D = (random: Random): Noise3D => {
  const base = Array.from({ length: 256 }, (_, index) => index);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = base[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  const corner = (gi: number, x: number, y: number, z: number) => {
    const t = 0.6 - x * x - y * y - z * z;
    if (t < 0) return 0;
    const g = GRAD3[gi];
    return t * t * t * t * (g[0] * x + g[1] * y + g[2] * z);
  };

  return (xin, yin, zin) => {
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const z0 = zin - (k - t);

    let i1: number, j1: number, k1: number, i2: number, j2: number, k2: number;
    if (x0 >= y0) {
      if (y0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
      else if (x0 >= z0) [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
      else [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
    } else if (y0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
    else if (x0 < z0) [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
    else [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;
    const n0 = corner(permMod12[ii + perm[jj + perm[kk]]], x0, y0, z0);
    const n1 = corner(
      permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]],
      x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3,
    );
    const n2 = corner(
      permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]],
      x0 - i2 + 2 * G3, y0 - j2 + 2 * G3, z0 - k2 + 2 * G3,
    );
    const n3 = corner(
      permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]],
      x0 - 1 + 3 * G3, y0 - 1 + 3 * G3, z0 - 1 + 3 * G3,
    );
    // Scaled to roughly [-1, 1]; clamp guards the rare overshoot.
    return Math.max(-1, Math.min(1, 32 * (n0 + n1 + n2 + n3)));
  };
};

/** Fractal Brownian motion, normalised to [-1, 1]. */
export const fbm3 = (
  noise: Noise3D,
  x: number,
  y: number,
  z: number,
  octaves = 5,
  lacunarity = 2,
  gain = 0.5,
): number => {
  let amplitude = 1;
  let frequency = 1;
  let sum = 0;
  let norm = 0;
  for (let octave = 0; octave < octaves; octave++) {
    sum += amplitude * noise(x * frequency, y * frequency, z * frequency);
    norm += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return sum / norm;
};
