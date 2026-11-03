import type { Tuple3 } from "./geometry.ts";
import { SCREEN } from "./furniture.ts";

/**
 * How the camera frames the room for a viewport aspect ratio. `offset` is a
 * fraction of the viewport used with `camera.setViewOffset`, so the room can
 * sit beside (landscape) or above (portrait) the intro card.
 */
export type Framing = {
  position: Tuple3;
  target: Tuple3;
  fov: number;
  offset: { x: number; y: number };
};

const LANDSCAPE: Framing = {
  position: [2.35, 1.75, 2.55],
  target: [0.05, 0.95, -0.8],
  fov: 40,
  offset: { x: -0.16, y: 0 },
};

const PORTRAIT: Framing = {
  position: [1.9, 2.0, 3.3],
  target: [0.05, 1.0, -0.85],
  fov: 58,
  offset: { x: 0, y: 0.17 },
};

export const roomFraming = (aspect: number): Framing => (aspect < 1 ? PORTRAIT : LANDSCAPE);

const SIT_FOV = 40;
const tanHalf = (fov: number) => Math.tan(((fov / 2) * Math.PI) / 180);

/**
 * Sitting at the computer: the camera faces the screen close enough that the
 * screen covers the whole viewport, so LucioOS can take over seamlessly.
 */
export const sitPose = (aspect: number): Framing => {
  const toFillHeight = SCREEN.height / 2 / tanHalf(SIT_FOV);
  const toFillWidth = SCREEN.width / 2 / (tanHalf(SIT_FOV) * aspect);
  const distance = Math.min(toFillHeight, toFillWidth);
  const [x, y, z] = SCREEN.center;
  return { position: [x, y, z + distance], target: [x, y, z], fov: SIT_FOV, offset: { x: 0, y: 0 } };
};

export const easeInOutCubic = (t: number): number => {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
};

const mix = (a: number, b: number, t: number) => a * (1 - t) + b * t;
const mix3 = (a: Tuple3, b: Tuple3, t: number): Tuple3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

/** Pose between two framings; exact at t = 0 and t = 1. */
export const lerpPose = (from: Framing, to: Framing, t: number): Framing => ({
  position: mix3(from.position, to.position, t),
  target: mix3(from.target, to.target, t),
  fov: mix(from.fov, to.fov, t),
  offset: { x: mix(from.offset.x, to.offset.x, t), y: mix(from.offset.y, to.offset.y, t) },
});
