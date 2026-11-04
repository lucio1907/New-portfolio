import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { PerspectiveCamera, Vector3 } from "three";
import { ORBIT_LIMITS, clampOrbit, dragToOrbit, roomFraming } from "./camera.ts";
import { ROOM_BOUNDS } from "./furniture.ts";

const ASPECTS = [390 / 844, 0.75, 1, 1.6, 16 / 9, 2.4];
const EXTREMES = [
  { yaw: 0, pitch: 0 },
  { yaw: ORBIT_LIMITS.yaw, pitch: ORBIT_LIMITS.pitch },
  { yaw: -ORBIT_LIMITS.yaw, pitch: ORBIT_LIMITS.pitch },
  { yaw: ORBIT_LIMITS.yaw, pitch: -ORBIT_LIMITS.pitch },
  { yaw: -ORBIT_LIMITS.yaw, pitch: -ORBIT_LIMITS.pitch },
];

/** Bounds of the room's corners on screen, in normalized device coordinates. */
const projectedBounds = (aspect: number, orbit: { yaw: number; pitch: number }) => {
  const framing = roomFraming(aspect, orbit);
  const camera = new PerspectiveCamera(framing.fov, aspect, 0.05, 100);
  camera.position.set(...framing.position);
  camera.lookAt(...framing.target);
  camera.updateMatrixWorld();
  let width = 0;
  let height = 0;
  for (const x of [ROOM_BOUNDS.min[0], ROOM_BOUNDS.max[0]]) {
    for (const y of [ROOM_BOUNDS.min[1], ROOM_BOUNDS.max[1]]) {
      for (const z of [ROOM_BOUNDS.min[2], ROOM_BOUNDS.max[2]]) {
        const point = new Vector3(x, y, z).project(camera);
        width = Math.max(width, Math.abs(point.x));
        height = Math.max(height, Math.abs(point.y));
      }
    }
  }
  return { width, height };
};

describe("roomFraming", () => {
  for (const aspect of ASPECTS) {
    test(`aspect ${aspect.toFixed(2)}: the whole diorama stays on screen at every orbit extreme`, () => {
      for (const orbit of EXTREMES) {
        const { width, height } = projectedBounds(aspect, orbit);
        assert.ok(width <= 1 && height <= 1, `${JSON.stringify(orbit)}: ${width}, ${height}`);
      }
    });

    test(`aspect ${aspect.toFixed(2)}: at rest the diorama fills most of the screen`, () => {
      const { width, height } = projectedBounds(aspect, { yaw: 0, pitch: 0 });
      assert.ok(Math.max(width, height) >= 0.72, `${width}, ${height}`);
    });
  }

  test("the camera looks down at the room from the open corner", () => {
    for (const aspect of ASPECTS) {
      for (const orbit of EXTREMES) {
        const { position, target } = roomFraming(aspect, orbit);
        assert.ok(position[0] > target[0] && position[1] > target[1] && position[2] > target[2], JSON.stringify(position));
      }
    }
  });

  test("distance does not change with the orbit, so dragging never zooms", () => {
    const length = ({ position, target }: ReturnType<typeof roomFraming>) =>
      Math.hypot(position[0] - target[0], position[1] - target[1], position[2] - target[2]);
    const rest = length(roomFraming(16 / 9));
    for (const orbit of EXTREMES) assert.ok(Math.abs(length(roomFraming(16 / 9, orbit)) - rest) < 1e-9);
  });
});

describe("orbit", () => {
  test("clampOrbit keeps yaw and pitch inside the limits", () => {
    assert.deepEqual(clampOrbit({ yaw: 9, pitch: -9 }), { yaw: ORBIT_LIMITS.yaw, pitch: -ORBIT_LIMITS.pitch });
    assert.deepEqual(clampOrbit({ yaw: 0.01, pitch: 0.02 }), { yaw: 0.01, pitch: 0.02 });
  });

  test("the limits are 25 degrees of yaw and 10 of pitch", () => {
    assert.ok(Math.abs(ORBIT_LIMITS.yaw - (25 * Math.PI) / 180) < 1e-12);
    assert.ok(Math.abs(ORBIT_LIMITS.pitch - (10 * Math.PI) / 180) < 1e-12);
  });

  test("dragging right turns the room with the finger; dragging down looks from higher up", () => {
    const right = dragToOrbit(100, 0);
    const down = dragToOrbit(0, 100);
    assert.ok(right.yaw < 0);
    assert.equal(right.pitch, 0);
    assert.ok(down.pitch > 0);
    assert.equal(down.yaw, 0);
  });

  test("a huge drag stays inside the limits", () => {
    const { yaw, pitch } = dragToOrbit(-10_000, 10_000);
    assert.equal(yaw, ORBIT_LIMITS.yaw);
    assert.equal(pitch, ORBIT_LIMITS.pitch);
  });
});
