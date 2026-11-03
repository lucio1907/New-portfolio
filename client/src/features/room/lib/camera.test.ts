import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { roomFraming } from "./camera.ts";

describe("roomFraming", () => {
  test("landscape shifts the room right, leaving the left side for the intro card", () => {
    const framing = roomFraming(16 / 9);
    assert.ok(framing.offset.x < 0, "view window moves left so the room appears right");
    assert.equal(framing.offset.y, 0);
  });

  test("portrait widens the lens and lifts the room above the intro card", () => {
    const portrait = roomFraming(390 / 844);
    const landscape = roomFraming(16 / 9);
    assert.ok(portrait.fov > landscape.fov);
    assert.ok(portrait.offset.y > 0, "view window moves down so the room appears higher");
    assert.equal(portrait.offset.x, 0);
  });

  test("the camera always looks at the desk from in front of it", () => {
    for (const aspect of [0.4, 0.75, 1, 1.6, 2.4]) {
      const { position, target } = roomFraming(aspect);
      assert.ok(position[2] > target[2], `aspect ${aspect}`);
      assert.ok(position[1] > 0.8 && position[1] < 2.6);
    }
  });
});
