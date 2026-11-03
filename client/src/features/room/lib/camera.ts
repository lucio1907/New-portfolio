import type { Tuple3 } from "./geometry.ts";

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
