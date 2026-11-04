import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { BoxGeometry, Color } from "three";
import { box, merge, shape, tag } from "./geometry.ts";
import { DECOR, HOTSPOT_IDS, ROOM_BOUNDS, buildRoomGeometry } from "./furniture.ts";
import { QUALITY } from "./quality.ts";

const triangles = (geometry: { getAttribute: (name: string) => { count: number } }) =>
  geometry.getAttribute("position").count / 3;

describe("geometry helpers", () => {
  test("shape makes a non-indexed, fully colored copy at the requested place", () => {
    const geometry = shape(new BoxGeometry(1, 1, 1), "#FFC94A", [2, 0, 0]);
    assert.equal(geometry.index, null);
    assert.equal(geometry.getAttribute("uv"), undefined);
    const expected = new Color("#FFC94A");
    const color = geometry.getAttribute("color");
    for (let i = 0; i < color.count; i++) {
      // Colors are stored in a Float32Array.
      assert.equal(color.getX(i), Math.fround(expected.r));
      assert.equal(color.getY(i), Math.fround(expected.g));
      assert.equal(color.getZ(i), Math.fround(expected.b));
    }
    geometry.computeBoundingBox();
    assert.equal(geometry.boundingBox!.min.x, 1.5);
  });

  test("box is centered on its position and tag marks every vertex", () => {
    const geometry = tag(box(1, 2, 1, "#fff", [0, 1, 0]), 4);
    geometry.computeBoundingBox();
    assert.equal(geometry.boundingBox!.min.y, 0);
    assert.equal(geometry.boundingBox!.max.y, 2);
    assert.ok(Array.from(geometry.getAttribute("objectId").array).every((id) => id === 4));
  });

  test("merge keeps every triangle", () => {
    const merged = merge([box(1, 1, 1, "#fff"), box(1, 1, 1, "#000", [3, 0, 0])]);
    assert.equal(triangles(merged), 24);
  });
});

describe("room", () => {
  for (const tier of ["high", "low"] as const) {
    const geometry = buildRoomGeometry(QUALITY[tier]);

    test(`${tier}: one non-indexed geometry with colors and object ids`, () => {
      assert.equal(geometry.index, null);
      const count = geometry.getAttribute("position").count;
      assert.equal(geometry.getAttribute("color").count, count);
      assert.equal(geometry.getAttribute("objectId").count, count);
    });

    test(`${tier}: every hotspot is present`, () => {
      const ids = new Set(geometry.getAttribute("objectId").array);
      for (const id of Object.values(HOTSPOT_IDS)) assert.ok(ids.has(id), `hotspot ${id}`);
      assert.ok(ids.has(DECOR));
    });

    test(`${tier}: everything sits inside the room`, () => {
      geometry.computeBoundingBox();
      const { min, max } = geometry.boundingBox!;
      assert.ok(min.x >= ROOM_BOUNDS.min[0] && min.y >= ROOM_BOUNDS.min[1] && min.z >= ROOM_BOUNDS.min[2], JSON.stringify(min));
      assert.ok(max.x <= ROOM_BOUNDS.max[0] && max.y <= ROOM_BOUNDS.max[1] && max.z <= ROOM_BOUNDS.max[2], JSON.stringify(max));
    });
  }

  test("triangle budgets: ≤ 60k on desktop tiers, ≤ 25k on mobile", () => {
    assert.ok(triangles(buildRoomGeometry(QUALITY.high)) <= 60_000);
    assert.ok(triangles(buildRoomGeometry(QUALITY.medium)) <= 60_000);
    assert.ok(triangles(buildRoomGeometry(QUALITY.low)) <= 25_000);
  });

  test("the baked light is deterministic, in range, and leaves no build attributes", () => {
    const a = buildRoomGeometry(QUALITY.low);
    const b = buildRoomGeometry(QUALITY.low);
    const colors = Array.from(a.getAttribute("color").array);
    assert.deepEqual(colors, Array.from(b.getAttribute("color").array));
    assert.ok(colors.every((value) => Number.isFinite(value) && value >= 0 && value <= 1));
    assert.equal(a.getAttribute("normal"), undefined);
    assert.equal(a.getAttribute("emissive"), undefined);
  });

  test("the room has real contrast: bright pools and dark corners", () => {
    const colors = buildRoomGeometry(QUALITY.low).getAttribute("color");
    let darkest = Infinity;
    let brightest = 0;
    for (let i = 0; i < colors.count; i++) {
      const luminance = 0.2126 * colors.getX(i) + 0.7152 * colors.getY(i) + 0.0722 * colors.getZ(i);
      darkest = Math.min(darkest, luminance);
      brightest = Math.max(brightest, luminance);
    }
    assert.ok(brightest > 0.5, `brightest ${brightest}`);
    assert.ok(darkest < 0.05, `darkest ${darkest}`);
  });
});
