import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { BufferAttribute, Color, PlaneGeometry } from "three";
import { type BakeScene, bakeLighting, irradianceAt, openness } from "./bake.ts";
import { box, merge, tag } from "./geometry.ts";

const UP: [number, number, number] = [0, 1, 0];
const table = { min: [-0.5, 0.7, -0.5] as [number, number, number], max: [0.5, 0.75, 0.5] as [number, number, number] };

const scene = (overrides: Partial<BakeScene> = {}): BakeScene => ({
  occluders: [],
  lights: [],
  sky: "#ffffff",
  ground: "#ffffff",
  ambient: 1,
  softness: 1,
  ...overrides,
});

const lamp = { position: [0, 1, 0] as [number, number, number], color: "#ffffff", intensity: 2, radius: 3 };

describe("openness (ambient occlusion)", () => {
  test("open space is fully open", () => {
    assert.equal(openness([0, 0, 0], UP, []), 1);
  });

  test("the floor under a table is darker than the floor beside it", () => {
    const under = openness([0, 0, 0], UP, [table]);
    const beside = openness([2, 0, 0], UP, [table]);
    assert.ok(under < beside, `${under} < ${beside}`);
    assert.equal(beside, 1);
  });

  test("a corner is darker than the middle of a wall", () => {
    const wall = { min: [-2, 0, -2.1] as [number, number, number], max: [2, 3, -2] as [number, number, number] };
    const floor = { min: [-2, -0.1, -2] as [number, number, number], max: [2, 0, 2] as [number, number, number] };
    const towardsRoom: [number, number, number] = [0, 0, 1];
    assert.ok(openness([0, 0.03, -2], towardsRoom, [wall, floor]) < openness([0, 1.5, -2], towardsRoom, [wall, floor]));
  });

  test("always stays between 0 and 1", () => {
    const value = openness([0, 0.71, 0], [0, -1, 0], [table, { min: [-1, -1, -1], max: [1, 0, 1] }]);
    assert.ok(value >= 0 && value <= 1);
  });
});

describe("irradianceAt", () => {
  test("a light adds its own color and fades with distance", () => {
    const red = { ...lamp, color: "#ff0000" };
    const near = irradianceAt([0, 0, 0], UP, scene({ ambient: 0, lights: [red] }));
    const far = irradianceAt([1.5, 0, 0], UP, scene({ ambient: 0, lights: [red] }));
    assert.ok(near[0] > far[0] && far[0] > 0, `${near[0]} > ${far[0]}`);
    assert.equal(near[1], 0);
    assert.equal(near[2], 0);
  });

  test("nothing arrives past the light's radius", () => {
    assert.deepEqual(irradianceAt([10, 0, 0], UP, scene({ ambient: 0, lights: [lamp] })), [0, 0, 0]);
  });

  test("surfaces facing away from a light get none of it", () => {
    assert.deepEqual(irradianceAt([0, 0, 0], [0, -1, 0], scene({ ambient: 0, lights: [lamp] })), [0, 0, 0]);
  });

  test("an object between the light and the surface casts a shadow", () => {
    const lit = irradianceAt([0, 0, 0], UP, scene({ ambient: 0, lights: [lamp] }));
    const shadowed = irradianceAt([0, 0, 0], UP, scene({ ambient: 0, lights: [lamp], occluders: [table] }));
    assert.ok(lit[0] > 0);
    assert.equal(shadowed[0], 0);
  });

  test("a sized light gives a partial shadow at the edge of an object", () => {
    const blocker = { min: [-0.5, 0.5, -0.5] as [number, number, number], max: [0.02, 0.52, 0.5] as [number, number, number] };
    const soft = { ...lamp, size: 0.2 };
    const free = irradianceAt([0, 0, 0], UP, scene({ ambient: 0, lights: [soft], softness: 4 }));
    const partial = irradianceAt([0, 0, 0], UP, scene({ ambient: 0, lights: [soft], occluders: [blocker], softness: 4 }));
    assert.ok(partial[0] > 0 && partial[0] < free[0], `${partial[0]} between 0 and ${free[0]}`);
  });

  test("an object does not shadow a surface when the light is on the same side", () => {
    const top = irradianceAt([0, 0.75, 0], UP, scene({ ambient: 0, lights: [lamp], occluders: [table] }));
    assert.ok(top[0] > 0);
  });
});

describe("bakeLighting", () => {
  const plane = () => {
    const geometry = tag(box(1, 0.1, 1, "#808080"), 0);
    geometry.computeVertexNormals();
    return geometry;
  };

  test("multiplies each vertex color by the light that reaches it", () => {
    const geometry = plane();
    const before = geometry.getAttribute("color").getX(0);
    bakeLighting(geometry, scene({ ambient: 0.5 }));
    const after = geometry.getAttribute("color").getX(0);
    assert.ok(Math.abs(after - before * 0.5) < 1e-5, `${after} vs ${before * 0.5}`);
  });

  test("emissive parts keep their color", () => {
    const geometry = tag(box(1, 0.1, 1, "#ff00ff"), 0, true);
    geometry.computeVertexNormals();
    const expected = new Color("#ff00ff");
    bakeLighting(geometry, scene({ ambient: 0 }));
    assert.equal(geometry.getAttribute("color").getX(0), Math.fround(expected.r));
  });

  test("removes the build-only attributes", () => {
    const geometry = plane();
    bakeLighting(geometry, scene());
    assert.equal(geometry.getAttribute("normal"), undefined);
    assert.equal(geometry.getAttribute("emissive"), undefined);
  });

  test("hot spots roll off instead of clipping, and nothing is NaN", () => {
    const geometry = merge([tag(box(1, 0.1, 1, "#ffffff"), 0), tag(box(1, 0.1, 1, "#ffffff", [0, 1, 0]), 0)]);
    geometry.computeVertexNormals();
    bakeLighting(geometry, scene({ ambient: 0, lights: [{ ...lamp, position: [0, 0.3, 0], intensity: 50 }] }));
    const colors = Array.from(geometry.getAttribute("color").array);
    assert.ok(colors.every((value) => Number.isFinite(value) && value >= 0 && value <= 1));
  });

  test("identical corners in non-indexed geometry get identical light", () => {
    const geometry = new PlaneGeometry(1, 1, 2, 2).rotateX(-Math.PI / 2).toNonIndexed();
    const count = geometry.getAttribute("position").count;
    geometry.setAttribute("color", new BufferAttribute(new Float32Array(count * 3).fill(1), 3));
    geometry.setAttribute("emissive", new BufferAttribute(new Float32Array(count), 1));
    bakeLighting(geometry, scene({ ambient: 0, lights: [lamp] }));
    const position = geometry.getAttribute("position");
    const color = geometry.getAttribute("color");
    const seen = new Map<string, number>();
    for (let i = 0; i < count; i++) {
      const key = `${position.getX(i)},${position.getZ(i)}`;
      if (seen.has(key)) assert.equal(color.getX(i), seen.get(key));
      else seen.set(key, color.getX(i));
    }
    assert.ok(seen.size < count);
  });
});
