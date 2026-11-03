import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createRandom } from "./random.ts";

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
