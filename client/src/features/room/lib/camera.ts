import type { Tuple3 } from "./geometry.ts";
import { ROOM_BOUNDS, SCREEN } from "./furniture.ts";

export type Framing = { position: Tuple3; target: Tuple3; fov: number };

/** Angles (radians) added to the resting view by the pointer or a drag. */
export type Orbit = { yaw: number; pitch: number };

const DEGREE = Math.PI / 180;

export const ORBIT_LIMITS: Orbit = { yaw: 25 * DEGREE, pitch: 10 * DEGREE };

/** The resting view: elevated, three quarters, from the open corner. */
const REST: Orbit = { yaw: 38 * DEGREE, pitch: 30 * DEGREE };
const TARGET: Tuple3 = [
  (ROOM_BOUNDS.min[0] + ROOM_BOUNDS.max[0]) / 2,
  (ROOM_BOUNDS.min[1] + ROOM_BOUNDS.max[1]) / 2 - 0.1,
  (ROOM_BOUNDS.min[2] + ROOM_BOUNDS.max[2]) / 2,
];

/** Slope of the resting view direction (x/z, y/z), for the window's parallax. */
export const REST_VIEW_SLOPE: [number, number] = [-Math.tan(REST.yaw), -Math.tan(REST.pitch) / Math.cos(REST.yaw)];

const tanHalf = (fov: number) => Math.tan(((fov / 2) * Math.PI) / 180);

const direction = (yaw: number, pitch: number): Tuple3 => [
  Math.sin(yaw) * Math.cos(pitch),
  Math.sin(pitch),
  Math.cos(yaw) * Math.cos(pitch),
];

const CORNERS: Tuple3[] = [ROOM_BOUNDS.min[0], ROOM_BOUNDS.max[0]].flatMap((x) =>
  [ROOM_BOUNDS.min[1], ROOM_BOUNDS.max[1]].flatMap((y) =>
    [ROOM_BOUNDS.min[2], ROOM_BOUNDS.max[2]].map((z): Tuple3 => [x - TARGET[0], y - TARGET[1], z - TARGET[2]]),
  ),
);

/** Smallest distance at which every corner of the room fits from this angle. */
const distanceToFit = (yaw: number, pitch: number, fov: number, aspect: number): number => {
  const back = direction(yaw, pitch);
  // Camera axes: right and up, with `back` pointing from the target to the eye.
  const rightLength = Math.hypot(back[0], back[2]);
  const right: Tuple3 = [back[2] / rightLength, 0, -back[0] / rightLength];
  const up: Tuple3 = [
    back[1] * right[2],
    back[2] * right[0] - back[0] * right[2],
    -back[1] * right[0],
  ];
  const dot = (a: Tuple3, b: Tuple3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const vertical = tanHalf(fov);
  const horizontal = vertical * aspect;
  let distance = 0;
  for (const corner of CORNERS) {
    const towardsEye = dot(corner, back);
    distance = Math.max(
      distance,
      Math.abs(dot(corner, right)) / horizontal + towardsEye,
      Math.abs(dot(corner, up)) / vertical + towardsEye,
    );
  }
  return distance;
};

const LANDSCAPE_FOV = 30;
const PORTRAIT_FOV = 38;
const MARGIN = 1.01;

/**
 * Frames the diorama for a viewport aspect ratio. The distance is the one that
 * keeps the room on screen at every orbit extreme, so dragging never clips it
 * and never zooms.
 */
export const roomFraming = (aspect: number, orbit: Orbit = { yaw: 0, pitch: 0 }): Framing => {
  const fov = aspect < 1 ? PORTRAIT_FOV : LANDSCAPE_FOV;
  let distance = 0;
  for (const yaw of [-ORBIT_LIMITS.yaw, 0, ORBIT_LIMITS.yaw]) {
    for (const pitch of [-ORBIT_LIMITS.pitch, 0, ORBIT_LIMITS.pitch]) {
      distance = Math.max(distance, distanceToFit(REST.yaw + yaw, REST.pitch + pitch, fov, aspect));
    }
  }
  const back = direction(REST.yaw + orbit.yaw, REST.pitch + orbit.pitch);
  return {
    position: [
      TARGET[0] + back[0] * distance * MARGIN,
      TARGET[1] + back[1] * distance * MARGIN,
      TARGET[2] + back[2] * distance * MARGIN,
    ],
    target: TARGET,
    fov,
  };
};

const clamp = (value: number, limit: number) => Math.min(limit, Math.max(-limit, value));

export const clampOrbit = ({ yaw, pitch }: Orbit): Orbit => ({
  yaw: clamp(yaw, ORBIT_LIMITS.yaw),
  pitch: clamp(pitch, ORBIT_LIMITS.pitch),
});

/**
 * The orbit a drag is asking for right now, or null when nobody is dragging.
 * The pointer handlers write it and the camera rig reads it on each frame.
 */
export const createDragOrbit = () => {
  let current: Orbit | null = null;
  return {
    get: () => current,
    set: (orbit: Orbit | null) => {
      current = orbit;
    },
  };
};
export type DragOrbit = ReturnType<typeof createDragOrbit>;

/** Radians of orbit per CSS pixel dragged. */
const DRAG_SPEED = 0.005;

/** A drag in CSS pixels as an orbit: the room follows the pointer. */
export const dragToOrbit = (dx: number, dy: number): Orbit =>
  clampOrbit({ yaw: dx === 0 ? 0 : -dx * DRAG_SPEED, pitch: dy === 0 ? 0 : dy * DRAG_SPEED });

const SIT_FOV = 40;

/**
 * Sitting at the computer: the camera faces the screen close enough that the
 * screen covers the whole viewport, so LucioOS can take over seamlessly.
 */
export const sitPose = (aspect: number): Framing => {
  const toFillHeight = SCREEN.height / 2 / tanHalf(SIT_FOV);
  const toFillWidth = SCREEN.width / 2 / (tanHalf(SIT_FOV) * aspect);
  const distance = Math.min(toFillHeight, toFillWidth);
  const [x, y, z] = SCREEN.center;
  return { position: [x, y, z + distance], target: [x, y, z], fov: SIT_FOV };
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
});
