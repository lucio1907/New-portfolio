import {
  type BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  LatheGeometry,
  PlaneGeometry,
  Vector2,
} from "three";
import { type Tuple3, box, merge, shape, tag } from "./geometry.ts";
import { createRandom } from "./random.ts";
import { DECOR, HOTSPOT_IDS, type HotspotName } from "./hotspotMap.ts";
import type { QualitySettings } from "./quality.ts";

/**
 * The desk room, built in code. Units are roughly meters: y is up, the floor
 * is y = 0, the back wall is at z ≈ -1.25 and the camera looks in from +z.
 */

/** Interactive objects (ids live in the `objectId` vertex attribute). */
export { DECOR, HOTSPOT_IDS, type HotspotName };

/** Outer limits of the room (with a little slack for float32 rounding). */
export const ROOM_BOUNDS = { min: [-2.06, -0.06, -1.32] as Tuple3, max: [2.06, 2.62, 1.63] as Tuple3 };

/** Where the monitor's screen sits (its own glowing mesh). */
export const SCREEN = { center: [-0.1, 1.12, -0.908] as Tuple3, width: 0.72, height: 0.41 };
/** The desk lamp's bulb, for the warm point light. */
export const LAMP_BULB: Tuple3 = [-0.6, 1.12, -0.86];
/** Window opening in the back wall (x from, x to, y from, y to). */
export const WINDOW = { x0: 0.55, x1: 1.65, y0: 1.0, y1: 2.1, z: -1.25 };

const WALL = "#232C66";
const SIDE_WALL = "#1D2559";
const FLOOR = "#2B2448";
const WOOD = "#A06B45";
const DARK_WOOD = "#7A4E33";
const FRAME = "#CFC6B0";
const INK = "#11152E";
const DESK_TOP = 0.775;

const cylinder = (radiusTop: number, radiusBottom: number, height: number, segments: number, hex: string, position: Tuple3, rotation: Tuple3 = [0, 0, 0]) =>
  shape(new CylinderGeometry(radiusTop, radiusBottom, height, segments), hex, position, rotation);

const room = (): BufferGeometry[] => {
  const { x0, x1, y0, y1, z } = WINDOW;
  const back = z - 0.025;
  return [
    box(4.1, 0.05, 2.9, FLOOR, [0, -0.025, 0.17]),
    // Back wall around the window opening.
    box(x0 + 2.05, 2.6, 0.05, WALL, [(x0 - 2.05) / 2, 1.3, back]),
    box(2.05 - x1, 2.6, 0.05, WALL, [(x1 + 2.05) / 2, 1.3, back]),
    box(x1 - x0, y0, 0.05, WALL, [(x0 + x1) / 2, y0 / 2, back]),
    box(x1 - x0, 2.6 - y1, 0.05, WALL, [(x0 + x1) / 2, (y1 + 2.6) / 2, back]),
    // Window frame, mullions and sill.
    box(x1 - x0 + 0.06, 0.05, 0.08, FRAME, [(x0 + x1) / 2, y0, back + 0.02]),
    box(x1 - x0 + 0.06, 0.05, 0.08, FRAME, [(x0 + x1) / 2, y1, back + 0.02]),
    box(0.05, y1 - y0, 0.08, FRAME, [x0, (y0 + y1) / 2, back + 0.02]),
    box(0.05, y1 - y0, 0.08, FRAME, [x1, (y0 + y1) / 2, back + 0.02]),
    box(0.03, y1 - y0, 0.04, FRAME, [(x0 + x1) / 2, (y0 + y1) / 2, back + 0.01]),
    box(x1 - x0, 0.03, 0.04, FRAME, [(x0 + x1) / 2, (y0 + y1) / 2 + 0.1, back + 0.01]),
    box(x1 - x0 + 0.16, 0.04, 0.16, FRAME, [(x0 + x1) / 2, y0 - 0.02, back + 0.08]),
    // Left wall and a skirting board.
    box(0.05, 2.6, 2.9, SIDE_WALL, [-2.035, 1.3, 0.17]),
    box(4.1, 0.08, 0.02, "#1A2150", [0, 0.04, back + 0.035]),
  ];
};

const rug = (segments: number) => [shape(new CylinderGeometry(1.05, 1.05, 0.012, segments * 2), "#3B2F63", [0.05, 0.006, 0.25])];

const desk = (): BufferGeometry[] => {
  const legs: Tuple3[] = [[-0.85, 0.375, -1.12], [0.75, 0.375, -1.12], [-0.85, 0.375, -0.52], [0.75, 0.375, -0.52]];
  return [
    box(1.75, 0.05, 0.72, WOOD, [-0.05, DESK_TOP - 0.025, -0.82]),
    ...legs.map((position) => box(0.05, 0.75, 0.05, DARK_WOOD, position)),
    box(0.42, 0.55, 0.6, DARK_WOOD, [0.5, 0.42, -0.86]),
    box(0.36, 0.006, 0.02, FRAME, [0.5, 0.56, -0.555]),
  ];
};

const monitor = (): BufferGeometry[] => [
  box(0.26, 0.016, 0.18, INK, [-0.1, DESK_TOP + 0.008, -0.95]),
  box(0.045, 0.24, 0.035, INK, [-0.1, DESK_TOP + 0.12, -0.97]),
  box(0.78, 0.47, 0.035, INK, [SCREEN.center[0], SCREEN.center[1], SCREEN.center[2] - 0.02]),
];

const keyboard = (): BufferGeometry[] => [
  box(0.46, 0.022, 0.15, "#2E3566", [-0.1, DESK_TOP + 0.011, -0.62]),
  box(0.43, 0.008, 0.12, "#D9D3C3", [-0.1, DESK_TOP + 0.026, -0.62]),
  box(0.06, 0.022, 0.1, "#D9D3C3", [0.24, DESK_TOP + 0.011, -0.6]),
];

/** Office chair, pulled back and turned as if someone just stood up. */
const chair = (segments: number): BufferGeometry[] => {
  const center: Tuple3 = [0.25, 0, 0.12];
  const turn = 0.55;
  const legs = Array.from({ length: 5 }, (_, index) => {
    const angle = (index / 5) * Math.PI * 2;
    return box(0.3, 0.035, 0.05, INK, [center[0] + Math.cos(angle) * 0.15, 0.06, center[2] + Math.sin(angle) * 0.15], [0, -angle, 0]);
  });
  return [
    ...legs,
    cylinder(0.025, 0.03, 0.38, segments, "#3A4170", [center[0], 0.26, center[2]]),
    box(0.52, 0.07, 0.5, "#3D4A8C", [center[0], 0.48, center[2]], [0, turn, 0]),
    box(0.5, 0.55, 0.06, "#3D4A8C", [center[0] + Math.sin(turn) * 0.24, 0.82, center[2] + Math.cos(turn) * 0.24], [-0.12, turn, 0]),
  ];
};

const lamp = (segments: number): BufferGeometry[] => [
  cylinder(0.08, 0.09, 0.025, segments, INK, [-0.78, DESK_TOP + 0.012, -1.02]),
  box(0.02, 0.42, 0.02, "#3A4170", [-0.76, DESK_TOP + 0.21, -1.0], [0.25, 0, -0.25]),
  shape(new ConeGeometry(0.1, 0.13, segments, 1, true), "#EEE8DA", [LAMP_BULB[0], LAMP_BULB[1] + 0.05, LAMP_BULB[2]], [0, 0, -0.35]),
];

const mate = (segments: number): BufferGeometry[] => {
  const base: Tuple3 = [-0.52, DESK_TOP, -0.6];
  const gourd = [[0, 0], [0.035, 0], [0.05, 0.03], [0.052, 0.06], [0.042, 0.09], [0.038, 0.105], [0, 0.105]].map(([x, y]) => new Vector2(x, y));
  return [
    shape(new LatheGeometry(gourd, segments), "#8B5A2B", base),
    cylinder(0.036, 0.036, 0.004, segments, "#6E8B3D", [base[0], base[1] + 0.104, base[2]]),
    cylinder(0.004, 0.004, 0.14, 6, "#C9CCDA", [base[0] + 0.012, base[1] + 0.15, base[2]], [0, 0, -0.25]),
    // Termo next to the mate.
    cylinder(0.045, 0.045, 0.3, segments, "#4E8C57", [base[0] - 0.17, base[1] + 0.15, base[2] - 0.08]),
    cylinder(0.03, 0.04, 0.05, segments, "#2F5A3A", [base[0] - 0.17, base[1] + 0.325, base[2] - 0.08]),
  ];
};

const books = (): BufferGeometry[] => {
  const random = createRandom(41);
  const spines = ["#F28C8C", "#8CCBFF", "#FFC94A", "#7DDBA0", "#C3A6FF", "#EEE8DA", "#E8A33D", "#5B6BBF"];
  const shelfY = 1.6;
  const parts = [box(0.95, 0.03, 0.22, DARK_WOOD, [-1.38, shelfY, -1.14])];
  let x = -1.8;
  spines.forEach((hex, index) => {
    const width = 0.045 + random() * 0.03;
    const height = 0.18 + random() * 0.1;
    const lean = index === spines.length - 1 ? 0.35 : 0;
    parts.push(box(width, height, 0.17, hex, [x + width / 2, shelfY + 0.015 + height / 2, -1.14], [0, 0, lean]));
    x += width + 0.008;
  });
  return parts;
};

const notes = (): BufferGeometry[] => {
  const random = createRandom(7);
  const tints = ["#FFC94A", "#8CCBFF", "#7DDBA0", "#F28C8C", "#C3A6FF", "#EEE8DA"];
  const board: Tuple3 = [-1.28, 1.12, -1.235];
  return [
    box(0.72, 0.46, 0.02, "#B98B5A", board),
    ...tints.map((hex, index) =>
      box(0.1, 0.1, 0.006, hex, [board[0] - 0.24 + (index % 3) * 0.24, board[1] + (index < 3 ? 0.1 : -0.1), board[2] + 0.014], [0, 0, (random() - 0.5) * 0.3]),
    ),
  ];
};

/** A cabinet with six small "product boxes", one per project. */
const productBoxes = (): BufferGeometry[] => {
  const tints = ["#C3A6FF", "#8CCBFF", "#FFC94A", "#7DDBA0", "#F28C8C", "#EEE8DA"];
  const cabinet: Tuple3 = [1.5, 0.27, -1.02];
  const parts = [box(0.85, 0.54, 0.4, DARK_WOOD, cabinet)];
  tints.forEach((hex, index) => {
    const row = index < 4 ? 0 : 1;
    const column = row === 0 ? index : index - 4 + 0.5;
    const size = 0.13;
    parts.push(box(size, size, size, hex, [cabinet[0] - 0.3 + column * 0.2, 0.54 + size / 2 + row * size, cabinet[2] + 0.02], [0, (index * 0.37) % 0.4 - 0.2, 0]));
  });
  return parts;
};

const phone = (): BufferGeometry[] => [
  box(0.075, 0.012, 0.15, INK, [0.42, DESK_TOP + 0.006, -0.66], [0, 0.3, 0]),
  box(0.065, 0.003, 0.13, "#8CCBFF", [0.42, DESK_TOP + 0.013, -0.66], [0, 0.3, 0]),
];

const plant = (segments: number): BufferGeometry[] => {
  const pot: Tuple3 = [0.66, DESK_TOP + 0.06, -1.05];
  return [
    cylinder(0.07, 0.055, 0.12, segments, "#C8553D", pot),
    ...[0, 1, 2, 3, 4].map((leaf) =>
      shape(new ConeGeometry(0.035, 0.22, 5), leaf % 2 ? "#4E8C57" : "#6FAF6B", [pot[0] + Math.cos(leaf * 1.3) * 0.03, pot[1] + 0.15, pot[2] + Math.sin(leaf * 1.3) * 0.03], [Math.cos(leaf * 1.3) * 0.35, 0, Math.sin(leaf * 1.3) * 0.35]),
    ),
  ];
};

/** The whole room in one geometry (one draw call), tagged per object. */
export const buildRoomGeometry = (settings: QualitySettings): BufferGeometry => {
  const segments = settings.curveSegments;
  const groups: Array<[number, BufferGeometry[]]> = [
    [DECOR, [...room(), ...rug(segments), ...desk(), ...keyboard(), ...lamp(segments), ...plant(segments)]],
    [HOTSPOT_IDS.monitor, monitor()],
    [HOTSPOT_IDS.chair, chair(segments)],
    [HOTSPOT_IDS.mate, mate(segments)],
    [HOTSPOT_IDS.books, books()],
    [HOTSPOT_IDS.notes, notes()],
    [HOTSPOT_IDS.boxes, productBoxes()],
    [HOTSPOT_IDS.phone, phone()],
  ];
  const parts = groups.flatMap(([id, geometries]) => geometries.map((geometry) => tag(geometry, id)));
  const merged = merge(parts);
  merged.computeVertexNormals();
  merged.computeBoundingSphere();
  return merged;
};

/**
 * Buenos Aires at night behind the window: towers with lit windows and the
 * Obelisco in the middle. Deterministic for a seed.
 */
export const buildSkylineGeometry = (seed: number): BufferGeometry => {
  const random = createRandom(seed);
  const parts: BufferGeometry[] = [];
  const z = -4.2;
  for (let i = 0; i < 24; i++) {
    const width = 0.25 + random() * 0.35;
    const height = 0.4 + random() * 1.6;
    const x = -2.2 + i * 0.32 + random() * 0.1;
    const depth = 0.3;
    const zi = z - random() * 0.8;
    parts.push(box(width, height, depth, i % 2 ? "#141A44" : "#18204F", [x, height / 2 + 0.2, zi]));
    // Lit windows on the facade that faces the room.
    for (let row = 0; row < Math.floor(height / 0.16); row++) {
      for (let column = 0; column < Math.floor(width / 0.1); column++) {
        if (random() > 0.32) continue;
        const pane = shape(new PlaneGeometry(0.04, 0.05), random() > 0.5 ? "#FFC94A" : "#FFE6A0");
        pane.translate(x - width / 2 + 0.06 + column * 0.1, 0.32 + row * 0.16, zi + depth / 2 + 0.002);
        parts.push(pane);
      }
    }
  }
  // The Obelisco: a tall, slightly tapered shaft with a pyramid tip, placed
  // where the camera sees through the window.
  parts.push(shape(new CylinderGeometry(0.06, 0.09, 1.6, 4), "#D9D3C3", [-0.12, 1.0, z + 0.4], [0, Math.PI / 4, 0]));
  parts.push(shape(new ConeGeometry(0.06, 0.14, 4), "#D9D3C3", [-0.12, 1.87, z + 0.4], [0, Math.PI / 4, 0]));
  const merged = merge(parts);
  merged.computeVertexNormals();
  return merged;
};
