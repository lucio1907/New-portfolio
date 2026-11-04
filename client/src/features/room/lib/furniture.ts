import {
  Box3,
  type BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  LatheGeometry,
  RingGeometry,
  TorusGeometry,
  Vector2,
} from "three";
import { type BakeLight, type BakeScene, type Occluder, bakeInSteps } from "./bake.ts";
import { type Tuple3, box, merge, panel, shape, tag } from "./geometry.ts";
import { createRandom } from "./random.ts";
import type { QualitySettings } from "./quality.ts";

/**
 * The room, built in code: a cut-away diorama (floor slab plus two thick walls)
 * floating in the dark. Units are roughly meters: y is up, the floor is y = 0,
 * the open sides face +x and +z, where the camera is.
 */

/** Interactive objects: the computer. Everything else is decor. */
export const HOTSPOT_IDS = { monitor: 0, chair: 1 } as const;
export const DECOR = -1;

const INNER_LEFT = -2.01;
const OUTER_LEFT = -2.19;
const RIGHT = 2.05;
const INNER_BACK = -1.25;
const OUTER_BACK = -1.43;
const FRONT = 1.75;
const WALL_HEIGHT = 2.6;
const SLAB = 0.16;
const THICKNESS = INNER_LEFT - OUTER_LEFT;

/** Outer limits of the diorama (with a little slack for float32 rounding). */
export const ROOM_BOUNDS = {
  min: [OUTER_LEFT - 0.01, -SLAB - 0.01, OUTER_BACK - 0.01] as Tuple3,
  max: [RIGHT + 0.02, WALL_HEIGHT + 0.03, FRONT + 0.02] as Tuple3,
};

/** Where the monitor's screen sits (its own glowing mesh). */
export const SCREEN = { center: [-0.1, 1.12, -0.908] as Tuple3, width: 0.72, height: 0.41 };
/** The desk lamp's bulb. */
const LAMP_BULB: Tuple3 = [-0.6, 1.12, -0.86];
/** Window opening in the back wall; `z` is the sky plane, deep in the wall. */
export const WINDOW = { x0: 0.55, x1: 1.65, y0: 1.0, y1: 2.1, z: -1.39 };

const FLOOR_LAMP = { x: -1.8, z: 1.56, height: 1.52 };
const DESK_SHELF = { x: -0.15, y: 1.66, z: -1.13, width: 1.2 };
const BOOKCASE = { x: -1.86, z: 0.15, width: 1.4, height: 2.02, depth: 0.3 };
const ARMCHAIR = { x: -1.02, z: 1.02, turn: 0.82 };

/** Decor spots, used to prove that clicking them does nothing. */
export const DECOR_SPOTS: Record<string, Tuple3> = {
  bookcase: [BOOKCASE.x + 0.15, 1.3, BOOKCASE.z],
  cabinet: [1.5, 0.3, -0.82],
  armchair: [ARMCHAIR.x, 0.42, ARMCHAIR.z],
  poster: [INNER_LEFT, 1.86, 1.27],
  floor: [1.2, 0, 1.2],
};

const WALL = "#C9C6E2";
const CUT = "#8E8BB8";
const SLAB_SIDE = "#2A2440";
const WOODS = ["#B57B4C", "#A96F43", "#BD8455", "#A3693F"];
const WOOD = "#B88150";
const DARK_WOOD = "#7A4E33";
const PALE = "#E4DFD2";
const INK = "#171B38";
const LEAF = "#4E8C57";
const LEAF_LIGHT = "#6FAF6B";
const DESK_TOP = 0.775;

const BOOK_SPINES = ["#E46A6A", "#5FA8E8", "#F2B632", "#5EC48A", "#A682E8", "#EEE8DA", "#E8843D", "#4C5FBF", "#D65C9B"];

const cylinder = (radiusTop: number, radiusBottom: number, height: number, segments: number, hex: string, position: Tuple3, rotation: Tuple3 = [0, 0, 0]) =>
  shape(new CylinderGeometry(radiusTop, radiusBottom, height, segments), hex, position, rotation);

/** The floor slab, the planks, and both walls around the window opening. */
const shell = (cell: number): BufferGeometry[] => {
  const { x0, x1, y0, y1 } = WINDOW;
  const backZ = (INNER_BACK + OUTER_BACK) / 2;
  const leftX = (INNER_LEFT + OUTER_LEFT) / 2;
  const depth = FRONT - OUTER_BACK;
  const centerZ = (FRONT + OUTER_BACK) / 2;
  const width = RIGHT - OUTER_LEFT;
  const centerX = (RIGHT + OUTER_LEFT) / 2;
  const random = createRandom(12);
  const plankCount = 12;
  const plankDepth = (FRONT - INNER_BACK) / plankCount;
  const planks = Array.from({ length: plankCount }, (_, index) =>
    panel(
      cell,
      RIGHT - INNER_LEFT,
      0.012,
      plankDepth - 0.006,
      WOODS[Math.floor(random() * WOODS.length)],
      [(RIGHT + INNER_LEFT) / 2, -0.006, INNER_BACK + plankDepth * (index + 0.5)],
    ),
  );
  return [
    box(width, SLAB - 0.012, depth, SLAB_SIDE, [centerX, -(SLAB + 0.012) / 2, centerZ]),
    ...planks,
    // Back wall around the window.
    panel(cell, x0 - OUTER_LEFT, WALL_HEIGHT, THICKNESS, WALL, [(x0 + OUTER_LEFT) / 2, WALL_HEIGHT / 2, backZ]),
    panel(cell, RIGHT - x1, WALL_HEIGHT, THICKNESS, WALL, [(x1 + RIGHT) / 2, WALL_HEIGHT / 2, backZ]),
    panel(cell, x1 - x0, y0, THICKNESS, WALL, [(x0 + x1) / 2, y0 / 2, backZ]),
    panel(cell, x1 - x0, WALL_HEIGHT - y1, THICKNESS, WALL, [(x0 + x1) / 2, (y1 + WALL_HEIGHT) / 2, backZ]),
    // Left wall.
    panel(cell, THICKNESS, WALL_HEIGHT, FRONT - INNER_BACK, WALL, [leftX, WALL_HEIGHT / 2, (FRONT + INNER_BACK) / 2]),
    // Skirting boards.
    panel(cell, RIGHT - INNER_LEFT, 0.1, 0.02, PALE, [(RIGHT + INNER_LEFT) / 2, 0.05, INNER_BACK + 0.01]),
    panel(cell, 0.02, 0.1, FRONT - INNER_BACK, PALE, [INNER_LEFT + 0.01, 0.05, (FRONT + INNER_BACK) / 2]),
  ];
};

/** The cut: pale caps on the walls' top and open ends, self-lit so they read as a section line. */
const cutCaps = (): BufferGeometry[] => {
  const backZ = (INNER_BACK + OUTER_BACK) / 2;
  const leftX = (INNER_LEFT + OUTER_LEFT) / 2;
  const depth = FRONT - OUTER_BACK;
  const width = RIGHT - OUTER_LEFT;
  return [
    box(width + 0.01, 0.014, THICKNESS + 0.01, CUT, [(RIGHT + OUTER_LEFT) / 2, WALL_HEIGHT + 0.007, backZ]),
    box(THICKNESS + 0.01, 0.014, depth + 0.01, CUT, [leftX, WALL_HEIGHT + 0.007, (FRONT + OUTER_BACK) / 2]),
    box(0.012, WALL_HEIGHT, THICKNESS + 0.01, CUT, [RIGHT + 0.006, WALL_HEIGHT / 2, backZ]),
    box(THICKNESS + 0.01, WALL_HEIGHT, 0.012, CUT, [leftX, WALL_HEIGHT / 2, FRONT + 0.006]),
  ];
};

const windowFrame = (): BufferGeometry[] => {
  const { x0, x1, y0, y1 } = WINDOW;
  const middleX = (x0 + x1) / 2;
  const middleY = (y0 + y1) / 2;
  const z = (INNER_BACK + OUTER_BACK) / 2 + 0.005;
  return [
    box(x1 - x0 + 0.08, 0.05, THICKNESS + 0.02, PALE, [middleX, y1, z]),
    box(0.05, y1 - y0, THICKNESS + 0.02, PALE, [x0, middleY, z]),
    box(0.05, y1 - y0, THICKNESS + 0.02, PALE, [x1, middleY, z]),
    box(0.03, y1 - y0, 0.03, PALE, [middleX, middleY, WINDOW.z + 0.03]),
    box(x1 - x0, 0.03, 0.03, PALE, [middleX, middleY + 0.1, WINDOW.z + 0.03]),
    box(x1 - x0 + 0.2, 0.04, THICKNESS + 0.12, PALE, [middleX, y0 - 0.01, z + 0.05]),
  ];
};

const curtains = (): BufferGeometry[] => {
  const { x0, x1, y0, y1 } = WINDOW;
  const top = y1 + 0.16;
  const bottom = y0 - 0.14;
  const fold = (x: number, index: number) =>
    box(0.052, top - bottom, 0.03, index % 2 ? "#A85F86" : "#BC7298", [x, (top + bottom) / 2, INNER_BACK + 0.05 + (index % 2) * 0.016]);
  return [
    box(x1 - x0 + 0.62, 0.025, 0.025, INK, [(x0 + x1) / 2, top + 0.01, INNER_BACK + 0.06]),
    ...[0, 1, 2, 3].map((index) => fold(x0 - 0.21 + index * 0.05, index)),
    ...[0, 1, 2, 3].map((index) => fold(x1 + 0.06 + index * 0.05, index)),
  ];
};

const rug = (segments: number): BufferGeometry[] => {
  const rings: Array<[number, number, string]> = [[0, 0.42, "#5A3F92"], [0.42, 0.58, "#E8A33D"], [0.58, 1.02, "#46307A"], [1.02, 1.08, "#E8A33D"]];
  return rings.map(([inner, outer, hex]) =>
    shape(new RingGeometry(inner, outer, segments * 2, 3), hex, [0.15, 0.006, 0.32], [-Math.PI / 2, 0, 0]),
  );
};

const desk = (cell: number): BufferGeometry[] => {
  const legs: Tuple3[] = [[-0.85, 0.375, -1.12], [0.75, 0.375, -1.12], [-0.85, 0.375, -0.52], [0.75, 0.375, -0.52]];
  return [
    panel(cell, 1.75, 0.05, 0.72, WOOD, [-0.05, DESK_TOP - 0.025, -0.82]),
    ...legs.map((position) => box(0.05, 0.75, 0.05, PALE, position)),
    panel(cell, 0.42, 0.55, 0.6, PALE, [0.5, 0.42, -0.86]),
    box(0.36, 0.006, 0.02, INK, [0.5, 0.56, -0.555]),
    box(0.36, 0.006, 0.02, INK, [0.5, 0.38, -0.555]),
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

const deskThings = (segments: number): BufferGeometry[] => {
  const headphones: Tuple3 = [-0.42, DESK_TOP + 0.13, -1.02];
  return [
    // Mug.
    cylinder(0.04, 0.036, 0.09, segments, "#D65C9B", [0.2, DESK_TOP + 0.045, -0.98]),
    // Phone.
    box(0.075, 0.012, 0.15, INK, [0.42, DESK_TOP + 0.006, -0.62], [0, 0.3, 0]),
    // Laptop, closed on the right side of the desk.
    box(0.34, 0.018, 0.24, "#9BA3C4", [0.55, DESK_TOP + 0.009, -0.95], [0, -0.2, 0]),
    // Headphones resting on a small stand.
    box(0.09, 0.012, 0.09, INK, [headphones[0], DESK_TOP + 0.006, headphones[2]]),
    box(0.012, 0.13, 0.012, INK, [headphones[0], DESK_TOP + 0.07, headphones[2]]),
    shape(new TorusGeometry(0.075, 0.009, 6, segments, Math.PI), "#2E3566", [headphones[0], headphones[1] + 0.01, headphones[2]]),
    cylinder(0.035, 0.035, 0.025, segments, "#D65C9B", [headphones[0] - 0.075, headphones[1], headphones[2]], [0, 0, Math.PI / 2]),
    cylinder(0.035, 0.035, 0.025, segments, "#D65C9B", [headphones[0] + 0.075, headphones[1], headphones[2]], [0, 0, Math.PI / 2]),
  ];
};

/** Office chair, pulled back and turned as if someone just stood up. */
const chair = (segments: number): BufferGeometry[] => {
  const center: Tuple3 = [0.25, 0, 0.12];
  const turn = 0.55;
  const legs = Array.from({ length: 5 }, (_, index) => {
    const angle = (index / 5) * Math.PI * 2;
    return box(0.3, 0.035, 0.05, INK, [center[0] + Math.cos(angle) * 0.15, 0.06, center[2] + Math.sin(angle) * 0.15], [0, -angle, 0]);
  });
  const side = (sign: number): Tuple3 => [center[0] + Math.cos(turn) * sign * 0.28, 0.66, center[2] - Math.sin(turn) * sign * 0.28];
  return [
    ...legs,
    cylinder(0.025, 0.03, 0.38, segments, "#3A4170", [center[0], 0.26, center[2]]),
    box(0.52, 0.07, 0.5, "#5F82E0", [center[0], 0.48, center[2]], [0, turn, 0]),
    box(0.5, 0.55, 0.06, "#5F82E0", [center[0] + Math.sin(turn) * 0.24, 0.82, center[2] + Math.cos(turn) * 0.24], [-0.12, turn, 0]),
    box(0.04, 0.03, 0.34, INK, side(1), [0, turn, 0]),
    box(0.04, 0.03, 0.34, INK, side(-1), [0, turn, 0]),
  ];
};

const deskLamp = (segments: number): BufferGeometry[] => [
  cylinder(0.08, 0.09, 0.025, segments, INK, [-0.78, DESK_TOP + 0.012, -1.02]),
  box(0.02, 0.42, 0.02, "#3A4170", [-0.76, DESK_TOP + 0.21, -1.0], [0.25, 0, -0.25]),
];

const glowingShades = (segments: number): BufferGeometry[] => [
  shape(new ConeGeometry(0.1, 0.13, segments, 1, true), "#FFD9A6", [LAMP_BULB[0], LAMP_BULB[1] + 0.05, LAMP_BULB[2]], [0, 0, -0.35]),
  shape(new CylinderGeometry(0.11, 0.17, 0.26, segments, 1, true), "#FFE2B8", [FLOOR_LAMP.x, FLOOR_LAMP.height, FLOOR_LAMP.z]),
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

/** A row of book spines standing on a shelf at `y`, along the x axis. */
const bookRowX = (seed: number, from: number, to: number, y: number, z: number, depth: number): BufferGeometry[] => {
  const random = createRandom(seed);
  const parts: BufferGeometry[] = [];
  let x = from;
  for (;;) {
    const width = 0.035 + random() * 0.035;
    const height = 0.16 + random() * 0.09;
    if (x + width > to) return parts;
    parts.push(box(width, height, depth, BOOK_SPINES[Math.floor(random() * BOOK_SPINES.length)], [x + width / 2, y + height / 2, z]));
    x += width + 0.004;
  }
};

/** Same, standing along the z axis, for the bookcase on the left wall. */
const bookRowZ = (seed: number, from: number, to: number, y: number, x: number, depth: number): BufferGeometry[] => {
  const random = createRandom(seed);
  const parts: BufferGeometry[] = [];
  let z = from;
  for (;;) {
    const width = 0.035 + random() * 0.035;
    const height = 0.17 + random() * 0.11;
    if (z + width > to) return parts;
    parts.push(box(depth, height, width, BOOK_SPINES[Math.floor(random() * BOOK_SPINES.length)], [x, y + height / 2, z + width / 2]));
    z += width + 0.004;
  }
};

const pottedPlant = (segments: number, position: Tuple3, size: number, seed: number): BufferGeometry[] => {
  const random = createRandom(seed);
  const leaves = Math.max(5, Math.round(size * 12));
  return [
    cylinder(0.13 * size, 0.1 * size, 0.22 * size, segments, "#C8553D", [position[0], position[1] + 0.11 * size, position[2]]),
    ...Array.from({ length: leaves }, (_, index) => {
      const angle = index * 2.4;
      const lean = 0.25 + random() * 0.5;
      const length = (0.42 + random() * 0.32) * size;
      const reach = Math.sin(lean) * length * 0.5;
      return shape(
        new ConeGeometry(0.07 * size, length, 5),
        index % 2 ? LEAF : LEAF_LIGHT,
        [position[0] + Math.cos(angle) * reach, position[1] + 0.2 * size + Math.cos(lean) * length * 0.5, position[2] + Math.sin(angle) * reach],
        [Math.sin(angle) * lean, 0, -Math.cos(angle) * lean],
      );
    }),
  ];
};

/** A floating shelf over the desk, with an LED strip underneath. */
const deskShelf = (segments: number): BufferGeometry[] => {
  const { x, y, z, width } = DESK_SHELF;
  return [
    box(width, 0.03, 0.24, DARK_WOOD, [x, y, z]),
    ...bookRowX(41, x - width / 2 + 0.04, x + 0.08, y + 0.015, z, 0.17),
    box(0.18, 0.12, 0.14, "#F2B632", [x + 0.28, y + 0.075, z], [0, 0.2, 0]),
    ...pottedPlant(segments, [x + 0.5, y + 0.015, z], 0.38, 3),
  ];
};

const ledStrip = (): BufferGeometry[] => {
  const { x, y, z, width } = DESK_SHELF;
  return [box(width - 0.06, 0.012, 0.02, "#FF6AC1", [x, y - 0.022, z + 0.08])];
};

/** The cork board stays: notes pinned above the corner plant. */
const pinboard = (): BufferGeometry[] => {
  const random = createRandom(7);
  const tints = ["#F2B632", "#5FA8E8", "#5EC48A", "#E46A6A", "#A682E8", "#EEE8DA"];
  const board: Tuple3 = [-1.33, 1.5, INNER_BACK + 0.012];
  return [
    box(0.8, 0.54, 0.024, "#B98B5A", board),
    ...tints.map((hex, index) =>
      box(0.11, 0.11, 0.006, hex, [board[0] - 0.26 + (index % 3) * 0.26, board[1] + (index < 3 ? 0.12 : -0.12), board[2] + 0.015], [0, 0, (random() - 0.5) * 0.3]),
    ),
  ];
};

/** Bookcase frame against the left wall. */
const bookcaseFrame = (cell: number): BufferGeometry[] => {
  const { x, z, width, height, depth } = BOOKCASE;
  const shelves = [0.06, 0.46, 0.86, 1.26, 1.66, height - 0.015];
  return [
    panel(cell, depth, height, 0.03, DARK_WOOD, [x, height / 2, z - width / 2]),
    panel(cell, depth, height, 0.03, DARK_WOOD, [x, height / 2, z + width / 2]),
    ...shelves.map((y) => panel(cell, depth, 0.03, width, WOOD, [x, y, z])),
  ];
};

const bookcaseContents = (segments: number): BufferGeometry[] => {
  const { x, z, width } = BOOKCASE;
  const start = z - width / 2 + 0.03;
  const end = z + width / 2 - 0.03;
  const bookX = x + 0.02;
  return [
    ...bookRowZ(1, start, end - 0.35, 0.075, bookX, 0.22),
    box(0.22, 0.26, 0.28, "#D9C7A0", [bookX, 0.205, end - 0.17]),
    ...bookRowZ(2, start + 0.32, end, 0.475, bookX, 0.22),
    cylinder(0.08, 0.06, 0.14, segments, "#EEE8DA", [bookX, 0.545, start + 0.16]),
    ...bookRowZ(3, start, end - 0.5, 0.875, bookX, 0.22),
    box(0.22, 0.2, 0.42, "#5A6BC4", [bookX, 0.975, end - 0.24]),
    ...bookRowZ(4, start + 0.45, end, 1.275, bookX, 0.22),
    ...pottedPlant(segments, [bookX, 1.275, start + 0.2], 0.42, 5),
    ...bookRowZ(5, start, start + 0.6, 1.675, bookX, 0.22),
    box(0.22, 0.14, 0.34, "#E46A6A", [bookX, 1.75, end - 0.22]),
  ];
};

/** Rotates a local armchair offset around its center. */
const armchairPoint = (x: number, y: number, z: number): Tuple3 => {
  const c = Math.cos(ARMCHAIR.turn);
  const s = Math.sin(ARMCHAIR.turn);
  return [ARMCHAIR.x + x * c + z * s, y, ARMCHAIR.z - x * s + z * c];
};

const armchair = (): BufferGeometry[] => {
  const turn: Tuple3 = [0, ARMCHAIR.turn, 0];
  const fabric = "#D29A3F";
  const dark = "#A97528";
  return [
    box(0.78, 0.22, 0.72, dark, armchairPoint(0, 0.2, 0), turn),
    box(0.54, 0.12, 0.56, fabric, armchairPoint(0, 0.36, 0.05), turn),
    box(0.78, 0.68, 0.16, dark, armchairPoint(0, 0.54, -0.3), turn),
    box(0.54, 0.42, 0.08, fabric, armchairPoint(0, 0.62, -0.19), turn),
    box(0.13, 0.4, 0.72, fabric, armchairPoint(-0.33, 0.34, 0), turn),
    box(0.13, 0.4, 0.72, fabric, armchairPoint(0.33, 0.34, 0), turn),
    ...[[-0.3, -0.26], [0.3, -0.26], [-0.3, 0.26], [0.3, 0.26]].map(([x, z]) => box(0.05, 0.1, 0.05, DARK_WOOD, armchairPoint(x, 0.05, z), turn)),
  ];
};

const floorLampBody = (segments: number): BufferGeometry[] => [
  cylinder(0.14, 0.15, 0.03, segments, INK, [FLOOR_LAMP.x, 0.015, FLOOR_LAMP.z]),
  cylinder(0.012, 0.012, FLOOR_LAMP.height - 0.1, 8, INK, [FLOOR_LAMP.x, (FLOOR_LAMP.height - 0.1) / 2, FLOOR_LAMP.z]),
];

/** A little table by the armchair with a stack of books and a mug. */
const sideTable = (segments: number): BufferGeometry[] => {
  const x = -0.2;
  const z = 1.42;
  return [
    cylinder(0.22, 0.22, 0.025, segments, WOOD, [x, 0.46, z]),
    cylinder(0.02, 0.02, 0.45, 8, INK, [x, 0.225, z]),
    cylinder(0.12, 0.13, 0.02, segments, INK, [x, 0.01, z]),
    box(0.2, 0.03, 0.14, "#5FA8E8", [x - 0.04, 0.488, z], [0, 0.3, 0]),
    box(0.18, 0.03, 0.13, "#E46A6A", [x - 0.03, 0.518, z], [0, -0.1, 0]),
    cylinder(0.035, 0.032, 0.08, segments, "#EEE8DA", [x + 0.11, 0.513, z + 0.05]),
  ];
};

/** Poster on the left wall: Buenos Aires at night with the Obelisco. */
const poster = (): BufferGeometry[] => {
  const x = INNER_LEFT + 0.012;
  const z = 1.27;
  const y = 1.86;
  const facing = (height: number, width: number, hex: string, dy: number, dz: number, inset: number) =>
    box(0.006, height, width, hex, [x + 0.012 + inset, y + dy, z + dz]);
  return [
    box(0.024, 0.8, 0.54, INK, [x, y, z]),
    facing(0.73, 0.47, "#3A4CB0", 0, 0, 0),
    facing(0.15, 0.15, "#F2B632", 0.2, 0.1, 0.003),
    facing(0.22, 0.1, "#55389A", -0.25, -0.16, 0.003),
    facing(0.16, 0.1, "#46307A", -0.28, -0.05, 0.003),
    facing(0.26, 0.1, "#55389A", -0.23, 0.16, 0.003),
    facing(0.56, 0.04, "#EEE8DA", -0.08, 0.04, 0.006),
  ];
};

/** A low cabinet under the window with six small product boxes on top. */
const cabinet = (cell: number): BufferGeometry[] => {
  const tints = ["#A682E8", "#5FA8E8", "#F2B632", "#5EC48A", "#E46A6A", "#EEE8DA"];
  const center: Tuple3 = [1.5, 0.27, -1.02];
  const parts = [panel(cell, 0.85, 0.54, 0.4, DARK_WOOD, center), box(0.4, 0.46, 0.006, WOOD, [center[0] - 0.21, 0.27, center[2] + 0.203]), box(0.4, 0.46, 0.006, WOOD, [center[0] + 0.21, 0.27, center[2] + 0.203])];
  tints.forEach((hex, index) => {
    const row = index < 4 ? 0 : 1;
    const column = row === 0 ? index : index - 4 + 0.5;
    const size = 0.13;
    parts.push(box(size, size, size, hex, [center[0] - 0.3 + column * 0.2, 0.54 + size / 2 + row * size, center[2] + 0.02], [0, (index * 0.37) % 0.4 - 0.2, 0]));
  });
  return parts;
};

const pouf = (segments: number): BufferGeometry[] => [
  cylinder(0.27, 0.3, 0.3, segments, "#BC4F7E", [1.35, 0.15, 0.98]),
  cylinder(0.26, 0.27, 0.025, segments, "#D66A97", [1.35, 0.31, 0.98]),
];

const LIGHTS: BakeLight[] = [
  // The screen washes the desk and the room in blue.
  { position: [SCREEN.center[0], SCREEN.center[1], SCREEN.center[2] + 0.42], color: "#3E7BFF", intensity: 2.4, radius: 3.8, size: 0.14 },
  // Bias light behind the monitor, on the wall.
  { position: [SCREEN.center[0], SCREEN.center[1] + 0.02, -1.0], color: "#4E8CFF", intensity: 0.6, radius: 1.5, size: 0.08 },
  // Desk lamp.
  { position: LAMP_BULB, color: "#FF8A2A", intensity: 1, radius: 2.6, size: 0.05 },
  // LED strip under the shelf.
  { position: [DESK_SHELF.x + 0.12, DESK_SHELF.y - 0.1, DESK_SHELF.z + 0.16], color: "#FF2E9A", intensity: 1, radius: 2.7, size: 0.12 },
  // Floor lamp in the reading corner.
  { position: [FLOOR_LAMP.x, FLOOR_LAMP.height, FLOOR_LAMP.z], color: "#FFAE5E", intensity: 2.1, radius: 3.8, size: 0.1 },
  // A soft fill from the open side, so what faces the viewer never goes black.
  { position: [1.5, 2.3, 2.3], color: "#A79BE8", intensity: 1.5, radius: 6 },
  // Moonlight coming in through the window.
  { position: [(WINDOW.x0 + WINDOW.x1) / 2, (WINDOW.y0 + WINDOW.y1) / 2, INNER_BACK + 0.5], color: "#7FA6FF", intensity: 0.75, radius: 3.4, size: 0.2 },
];

type Group = { id: number; parts: BufferGeometry[]; occludes?: boolean; emissive?: boolean };

/** Bounding box of a part, used as a shadow caster; tiny parts cast nothing. */
const occluderOf = (part: BufferGeometry): Occluder | null => {
  const bounds = new Box3().setFromBufferAttribute(part.getAttribute("position") as never);
  const { min, max } = bounds;
  if (Math.max(max.x - min.x, max.y - min.y, max.z - min.z) < 0.08) return null;
  return { min: [min.x, min.y, min.z], max: [max.x, max.y, max.z] };
};

/** The solid shell, as whole boxes rather than as its many panels. */
const SHELL_OCCLUDERS: Occluder[] = [
  { min: [OUTER_LEFT, -SLAB, OUTER_BACK], max: [RIGHT, 0, FRONT] },
  { min: [OUTER_LEFT, 0, OUTER_BACK], max: [WINDOW.x0, WALL_HEIGHT, INNER_BACK] },
  { min: [WINDOW.x1, 0, OUTER_BACK], max: [RIGHT, WALL_HEIGHT, INNER_BACK] },
  { min: [WINDOW.x0, 0, OUTER_BACK], max: [WINDOW.x1, WINDOW.y0, INNER_BACK] },
  { min: [WINDOW.x0, WINDOW.y1, OUTER_BACK], max: [WINDOW.x1, WALL_HEIGHT, INNER_BACK] },
  { min: [OUTER_LEFT, 0, INNER_BACK], max: [INNER_LEFT, WALL_HEIGHT, FRONT] },
];

/** The armchair is turned, so its real bounds would shadow much more floor than it covers. */
const ARMCHAIR_CORE: Occluder = {
  min: [ARMCHAIR.x - 0.36, 0.02, ARMCHAIR.z - 0.36],
  max: [ARMCHAIR.x + 0.36, 0.72, ARMCHAIR.z + 0.36],
};

/**
 * The whole room in one geometry (one draw call), tagged and lit per vertex.
 * Yields during the light bake, so the browser can spread it over several tasks.
 */
export function* buildRoomInSteps(settings: QualitySettings): Generator<void, BufferGeometry, void> {
  const { curveSegments: segments, bakeCell: cell, bakeSamples } = settings;
  const groups: Group[] = [
    { id: DECOR, parts: shell(cell) },
    { id: DECOR, parts: [...rug(segments), ...windowFrame(), ...curtains(), ...keyboard(), ...poster()] },
    { id: DECOR, parts: [...desk(cell), ...cabinet(cell), ...bookcaseFrame(cell), ...pouf(segments)], occludes: true },
    { id: DECOR, parts: armchair() },
    { id: DECOR, parts: [...deskThings(segments), ...mate(segments), ...deskLamp(segments), ...deskShelf(segments), ...pinboard(), ...bookcaseContents(segments), ...floorLampBody(segments), ...sideTable(segments)] },
    { id: DECOR, parts: [...pottedPlant(segments, [-1.66, 0, -0.92], 1.1, 8), ...pottedPlant(segments, [1.56, 0, -0.32], 1.35, 13)] },
    { id: DECOR, parts: [...glowingShades(segments), ...ledStrip(), ...cutCaps()], emissive: true },
    { id: HOTSPOT_IDS.monitor, parts: monitor(), occludes: true },
    { id: HOTSPOT_IDS.chair, parts: chair(segments), occludes: true },
  ];
  const occluders: Occluder[] = [...SHELL_OCCLUDERS, ARMCHAIR_CORE];
  for (const group of groups) {
    if (!group.occludes) continue;
    for (const part of group.parts) {
      const occluder = occluderOf(part);
      if (occluder) occluders.push(occluder);
    }
  }
  const parts = groups.flatMap(({ id, parts: geometries, emissive }) => geometries.map((geometry) => tag(geometry, id, emissive)));
  const merged = merge(parts);
  merged.computeVertexNormals();
  const scene: BakeScene = {
    occluders,
    lights: LIGHTS,
    sky: "#7C86E0",
    ground: "#40305E",
    ambient: 0.24,
    softness: bakeSamples,
  };
  yield* bakeInSteps(merged, scene);
  merged.computeBoundingSphere();
  return merged;
}

/** The same room, built in one go. */
export const buildRoomGeometry = (settings: QualitySettings): BufferGeometry => {
  const steps = buildRoomInSteps(settings);
  let step = steps.next();
  while (!step.done) step = steps.next();
  return step.value;
};
