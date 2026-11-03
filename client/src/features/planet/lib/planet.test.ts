import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createRandom } from "./random.ts";
import { createNoise3D, fbm3 } from "./noise.ts";
import { angleBetween, latLonToVector } from "./sphere.ts";
import {
  LANDMARK_HEIGHT,
  MAX_HEIGHT,
  PLANET_RADIUS,
  createTerrain,
} from "./terrain.ts";
import { buildPlanetGeometry, planetTriangles } from "./planetGeometry.ts";

const close = (actual: number, expected: number, epsilon = 1e-9) =>
  assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} ≈ ${expected}`);

describe("createRandom", () => {
  test("is deterministic per seed and stays in [0, 1)", () => {
    const a = createRandom(42);
    const b = createRandom(42);
    for (let i = 0; i < 1000; i++) {
      const value = a();
      assert.equal(value, b());
      assert.ok(value >= 0 && value < 1);
    }
  });

  test("different seeds give different sequences", () => {
    assert.notEqual(createRandom(1)(), createRandom(2)());
  });
});

describe("noise", () => {
  test("is deterministic per seed and bounded to [-1, 1]", () => {
    const n1 = createNoise3D(createRandom(7));
    const n2 = createNoise3D(createRandom(7));
    const random = createRandom(99);
    for (let i = 0; i < 2000; i++) {
      const [x, y, z] = [random() * 20 - 10, random() * 20 - 10, random() * 20 - 10];
      const value = n1(x, y, z);
      assert.equal(value, n2(x, y, z));
      assert.ok(value >= -1 && value <= 1, `noise ${value}`);
    }
  });

  test("fbm stays bounded to [-1, 1]", () => {
    const noise = createNoise3D(createRandom(3));
    const random = createRandom(5);
    for (let i = 0; i < 2000; i++) {
      const value = fbm3(noise, random() * 4, random() * 4, random() * 4, 5);
      assert.ok(value >= -1 && value <= 1, `fbm ${value}`);
    }
  });
});

describe("sphere", () => {
  test("latLonToVector maps the reference points", () => {
    const [x0, y0, z0] = latLonToVector(0, 0);
    close(x0, 0); close(y0, 0); close(z0, 1);
    const [x1, y1, z1] = latLonToVector(90, 0);
    close(x1, 0); close(y1, 1); close(z1, 0, 1e-12);
    const [x2, y2, z2] = latLonToVector(0, 90);
    close(x2, 1); close(y2, 0); close(z2, 0, 1e-12);
  });

  test("returns unit vectors scaled by radius", () => {
    const [x, y, z] = latLonToVector(-34.6, -58.4, 2);
    close(Math.hypot(x, y, z), 2);
  });

  test("angleBetween measures the arc between directions", () => {
    close(angleBetween(latLonToVector(0, 0), latLonToVector(0, 90)), Math.PI / 2);
    close(angleBetween(latLonToVector(10, 20), latLonToVector(10, 20)), 0, 1e-7);
  });
});

describe("terrain", () => {
  const landmark = latLonToVector(-34.6, -58.4);
  const terrain = createTerrain({ seed: 2026, landmarks: [landmark] });

  test("is deterministic and bounded", () => {
    const again = createTerrain({ seed: 2026, landmarks: [landmark] });
    const random = createRandom(11);
    for (let i = 0; i < 1500; i++) {
      const dir = latLonToVector(random() * 180 - 90, random() * 360 - 180);
      const height = terrain.heightAt(dir);
      assert.equal(height, again.heightAt(dir));
      assert.ok(Math.abs(height) <= MAX_HEIGHT, `height ${height}`);
    }
  });

  test("is flat at landmark height on top of each landmark", () => {
    assert.equal(terrain.heightAt(landmark), LANDMARK_HEIGHT);
  });

  test("leaves terrain far from landmarks untouched", () => {
    const plain = createTerrain({ seed: 2026, landmarks: [] });
    const far = latLonToVector(40, 120);
    assert.equal(terrain.heightAt(far), plain.heightAt(far));
  });

  test("has both land and ocean", () => {
    const random = createRandom(17);
    let land = 0;
    let water = 0;
    for (let i = 0; i < 2000; i++) {
      const h = terrain.heightAt(latLonToVector(random() * 180 - 90, random() * 360 - 180));
      if (h > 0) land++;
      else water++;
    }
    assert.ok(land > 600 && water > 300, `land ${land}, water ${water}`);
  });
});

describe("planet geometry", () => {
  const terrain = createTerrain({ seed: 2026, landmarks: [] });

  test("triangle count follows the icosahedron detail", () => {
    for (const detail of [4, 12, 30]) {
      const geometry = buildPlanetGeometry(detail, terrain);
      assert.equal(geometry.getAttribute("position").count / 3, planetTriangles(detail));
      assert.equal(planetTriangles(detail), 20 * (detail + 1) ** 2);
      geometry.dispose();
    }
  });

  test("the highest detail stays within the 20k-triangle planet budget", () => {
    assert.ok(planetTriangles(30) <= 20_000);
  });

  test("vertices sit on the displaced sphere and faces are flat-colored", () => {
    const geometry = buildPlanetGeometry(8, terrain);
    const position = geometry.getAttribute("position");
    const color = geometry.getAttribute("color");
    assert.equal(color.count, position.count);
    for (let i = 0; i < position.count; i++) {
      const radius = Math.hypot(position.getX(i), position.getY(i), position.getZ(i));
      assert.ok(Math.abs(radius - PLANET_RADIUS) <= MAX_HEIGHT + 1e-6, `radius ${radius}`);
    }
    for (let face = 0; face < position.count; face += 3) {
      for (const offset of [1, 2]) {
        assert.equal(color.getX(face + offset), color.getX(face));
        assert.equal(color.getY(face + offset), color.getY(face));
        assert.equal(color.getZ(face + offset), color.getZ(face));
      }
    }
    geometry.dispose();
  });
});
