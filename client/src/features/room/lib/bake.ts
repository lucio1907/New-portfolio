import { type BufferGeometry, Color } from "three";
import type { Tuple3 } from "./geometry.ts";

/**
 * Light baking in code: every vertex stores the light that reaches it, computed
 * once when the scene is built. There are no runtime lights and no lightmaps,
 * yet the room gets soft shadows, ambient occlusion and colored light pools.
 * The geometry only needs to be dense enough for the light to show up on it.
 */
export type Occluder = { min: Tuple3; max: Tuple3 };

export type BakeLight = {
  position: Tuple3;
  color: string;
  intensity: number;
  /** Nothing is lit past this distance. */
  radius: number;
  /** Half size of the emitter; bigger means softer shadow edges. */
  size?: number;
};

export type BakeScene = {
  occluders: Occluder[];
  lights: BakeLight[];
  /** Ambient light color from above and from below. */
  sky: string;
  ground: string;
  ambient: number;
  /** Shadow rays per sized light (1 = hard shadows, 4 = soft). */
  softness: number;
};

/** Pushes ray origins off the surface so they do not hit their own box. */
const SURFACE_OFFSET = 0.012;
const OCCLUSION_REACH = 1;
const OCCLUSION_STRENGTH = 1.5;

/**
 * Nearest box entry along a ray before maxT, or the first one found when the
 * caller only asks whether anything is in the way. Origins inside a box do not
 * count, so parts never shadow themselves.
 */
const blocked = (
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  maxT: number,
  occluders: Occluder[],
  anyHit = false,
): number => {
  let nearest = Infinity;
  // Slab test with precomputed inverses: this is the bake's hottest loop.
  const ix = 1 / dx;
  const iy = 1 / dy;
  const iz = 1 / dz;
  for (let i = 0; i < occluders.length; i++) {
    const { min, max } = occluders[i];
    if (ox >= min[0] && ox <= max[0] && oy >= min[1] && oy <= max[1] && oz >= min[2] && oz <= max[2]) continue;
    let near = 0;
    let far = maxT;
    let t1 = (min[0] - ox) * ix;
    let t2 = (max[0] - ox) * ix;
    if (t1 < t2) {
      if (t1 > near) near = t1;
      if (t2 < far) far = t2;
    } else {
      if (t2 > near) near = t2;
      if (t1 < far) far = t1;
    }
    if (near > far) continue;
    t1 = (min[1] - oy) * iy;
    t2 = (max[1] - oy) * iy;
    if (t1 < t2) {
      if (t1 > near) near = t1;
      if (t2 < far) far = t2;
    } else {
      if (t2 > near) near = t2;
      if (t1 < far) far = t1;
    }
    if (near > far) continue;
    t1 = (min[2] - oz) * iz;
    t2 = (max[2] - oz) * iz;
    if (t1 < t2) {
      if (t1 > near) near = t1;
      if (t2 < far) far = t2;
    } else {
      if (t2 > near) near = t2;
      if (t1 < far) far = t1;
    }
    if (near > far || near >= nearest) continue;
    if (anyHit) return near;
    nearest = near;
  }
  return nearest;
};

/** Only the boxes close enough to a point for occlusion rays to reach them. */
const within = (x: number, y: number, z: number, reach: number, occluders: Occluder[]) =>
  occluders.filter(({ min, max }) => {
    const ax = Math.max(min[0] - x, 0, x - max[0]);
    const ay = Math.max(min[1] - y, 0, y - max[1]);
    const az = Math.max(min[2] - z, 0, z - max[2]);
    return ax * ax + ay * ay + az * az < reach * reach;
  });

/** Two rings of directions around the normal, weighted toward it. */
const OCCLUSION_RINGS = [
  { tilt: Math.PI / 6, weight: 1, phase: 0 },
  { tilt: (Math.PI * 7) / 18, weight: 0.5, phase: Math.PI / 4 },
];
const RING_SIZE = 4;
const TOTAL_WEIGHT = OCCLUSION_RINGS.reduce((sum, ring) => sum + ring.weight * RING_SIZE, 0);

/** How much of the sky a point sees: 1 is open space, 0 is fully enclosed. */
export const openness = (position: Tuple3, normal: Tuple3, occluders: Occluder[]): number => {
  const [nx, ny, nz] = normal;
  const [px, py, pz] = position;
  // Any two vectors perpendicular to the normal.
  const useX = Math.abs(nx) < 0.9;
  let tx = useX ? 0 : -nz;
  let ty = useX ? -nz : 0;
  let tz = useX ? ny : nx;
  const length = Math.hypot(tx, ty, tz);
  tx /= length;
  ty /= length;
  tz /= length;
  const bx = ny * tz - nz * ty;
  const by = nz * tx - nx * tz;
  const bz = nx * ty - ny * tx;

  const ox = px + nx * SURFACE_OFFSET;
  const oy = py + ny * SURFACE_OFFSET;
  const oz = pz + nz * SURFACE_OFFSET;
  const close = within(ox, oy, oz, OCCLUSION_REACH, occluders);
  if (close.length === 0) return 1;
  let occlusion = 0;
  for (const { tilt, weight, phase } of OCCLUSION_RINGS) {
    const up = Math.cos(tilt);
    const out = Math.sin(tilt);
    for (let i = 0; i < RING_SIZE; i++) {
      const angle = phase + (i / RING_SIZE) * Math.PI * 2;
      const c = Math.cos(angle) * out;
      const s = Math.sin(angle) * out;
      const t = blocked(
        ox, oy, oz,
        nx * up + tx * c + bx * s,
        ny * up + ty * c + by * s,
        nz * up + tz * c + bz * s,
        OCCLUSION_REACH,
        close,
      );
      if (t < OCCLUSION_REACH) occlusion += weight * (1 - t / OCCLUSION_REACH);
    }
  }
  return Math.max(0, 1 - (OCCLUSION_STRENGTH * occlusion) / TOTAL_WEIGHT);
};

/** Corners of a tetrahedron: shadow rays spread over a sized light. */
const SPREAD: Tuple3[] = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];

const unobstructed = (origin: Tuple3, light: BakeLight, softness: number, occluders: Occluder[]): number => {
  const samples = light.size && softness > 1 ? SPREAD.slice(0, Math.min(softness, SPREAD.length)) : null;
  const size = light.size ?? 0;
  const count = samples?.length ?? 1;
  let free = 0;
  for (let i = 0; i < count; i++) {
    const offset = samples?.[i];
    const dx = light.position[0] + (offset ? offset[0] * size : 0) - origin[0];
    const dy = light.position[1] + (offset ? offset[1] * size : 0) - origin[1];
    const dz = light.position[2] + (offset ? offset[2] * size : 0) - origin[2];
    const distance = Math.hypot(dx, dy, dz);
    const hit = blocked(origin[0], origin[1], origin[2], dx / distance, dy / distance, dz / distance, distance, occluders, true);
    if (hit >= distance) free++;
  }
  return free / count;
};

const parsed = new Map<string, Tuple3>();
const linear = (hex: string): Tuple3 => {
  let color = parsed.get(hex);
  if (!color) {
    const { r, g, b } = new Color(hex);
    color = [r, g, b];
    parsed.set(hex, color);
  }
  return color;
};

/** All the light (linear RGB) reaching a point with this normal. */
export const irradianceAt = (position: Tuple3, normal: Tuple3, scene: BakeScene): Tuple3 => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (scene.ambient > 0) {
    const sky = linear(scene.sky);
    const ground = linear(scene.ground);
    const mix = normal[1] * 0.5 + 0.5;
    const amount = scene.ambient * openness(position, normal, scene.occluders);
    r += (ground[0] + (sky[0] - ground[0]) * mix) * amount;
    g += (ground[1] + (sky[1] - ground[1]) * mix) * amount;
    b += (ground[2] + (sky[2] - ground[2]) * mix) * amount;
  }
  const origin: Tuple3 = [
    position[0] + normal[0] * SURFACE_OFFSET,
    position[1] + normal[1] * SURFACE_OFFSET,
    position[2] + normal[2] * SURFACE_OFFSET,
  ];
  for (const light of scene.lights) {
    const dx = light.position[0] - position[0];
    const dy = light.position[1] - position[1];
    const dz = light.position[2] - position[2];
    const distance = Math.hypot(dx, dy, dz);
    if (distance >= light.radius) continue;
    const facing = (dx * normal[0] + dy * normal[1] + dz * normal[2]) / Math.max(distance, 1e-6);
    if (facing <= 0) continue;
    const free = unobstructed(origin, light, scene.softness, scene.occluders);
    if (free === 0) continue;
    // Inverse square, softened up close and windowed to zero at the radius.
    const ratio = distance / light.radius;
    const fade = (1 - ratio ** 4) ** 2 / (distance * distance + 0.35);
    const amount = light.intensity * facing * fade * free;
    const color = linear(light.color);
    r += color[0] * amount;
    g += color[1] * amount;
    b += color[2] * amount;
  }
  return [r, g, b];
};

/** Keeps colors as they are, then rolls highlights off instead of clipping them. */
const KNEE = 0.8;
const shoulder = (value: number) => (value <= KNEE ? value : KNEE + (1 - KNEE) * (1 - Math.exp(-(value - KNEE) / (1 - KNEE))));

/** Vertices baked between pauses when the bake runs in steps. */
const STEP_SIZE = 256;

/**
 * Bakes the scene's light into the `color` attribute (non-indexed geometry
 * with face normals), leaving parts marked `emissive` untouched. Vertices that
 * share a place and a normal are computed once. Yields regularly, so a caller
 * can spread the work over several tasks and keep the page responsive.
 */
export function* bakeInSteps(geometry: BufferGeometry, scene: BakeScene): Generator<void, void, void> {
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const color = geometry.getAttribute("color");
  const emissive = geometry.getAttribute("emissive");
  const cache = new Map<string, Tuple3>();
  for (let i = 0; i < position.count; i++) {
    if (i % STEP_SIZE === 0) yield;
    if (emissive?.getX(i)) continue;
    const point: Tuple3 = [position.getX(i), position.getY(i), position.getZ(i)];
    const facing: Tuple3 = [normal.getX(i), normal.getY(i), normal.getZ(i)];
    const key = `${Math.round(point[0] * 1000)},${Math.round(point[1] * 1000)},${Math.round(point[2] * 1000)},${Math.round(facing[0] * 50)},${Math.round(facing[1] * 50)},${Math.round(facing[2] * 50)}`;
    let light = cache.get(key);
    if (!light) {
      light = irradianceAt(point, facing, scene);
      cache.set(key, light);
    }
    color.setXYZ(i, shoulder(color.getX(i) * light[0]), shoulder(color.getY(i) * light[1]), shoulder(color.getZ(i) * light[2]));
  }
  color.needsUpdate = true;
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("emissive");
}

/** The whole bake in one go. */
export const bakeLighting = (geometry: BufferGeometry, scene: BakeScene): void => {
  const steps = bakeInSteps(geometry, scene);
  while (!steps.next().done);
};
