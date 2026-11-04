import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { Ray, Vector3 } from "three";
import { hotspotIndex, pickHotspot } from "./hotspots.ts";
import { DECOR_SPOTS, HOTSPOT_IDS, SCREEN, buildRoomGeometry } from "./furniture.ts";
import { QUALITY } from "./quality.ts";
import { easeInOutCubic, lerpPose, roomFraming, sitPose } from "./camera.ts";

const eye = new Vector3(...roomFraming(16 / 9).position);
const rayTo = (point: Vector3) => new Ray(eye, point.clone().sub(eye).normalize());

describe("hotspots", () => {
  const index = hotspotIndex(buildRoomGeometry(QUALITY.low));

  test("only the computer is interactive: the monitor and the chair", () => {
    assert.deepEqual([...index.boxes.keys()].sort(), [HOTSPOT_IDS.monitor, HOTSPOT_IDS.chair].sort());
    assert.deepEqual(Object.keys(HOTSPOT_IDS).sort(), ["chair", "monitor"]);
    for (const box of index.boxes.values()) assert.ok(!box.isEmpty());
    for (const corners of index.triangles.values()) assert.equal(corners.length % 9, 0);
  });

  test("a ray at the screen picks the monitor", () => {
    assert.equal(pickHotspot(rayTo(new Vector3(...SCREEN.center)), index), HOTSPOT_IDS.monitor);
  });

  test("a ray at the chair picks the chair", () => {
    const center = index.boxes.get(HOTSPOT_IDS.chair)!.getCenter(new Vector3());
    assert.equal(pickHotspot(rayTo(center), index), HOTSPOT_IDS.chair);
  });

  for (const [name, spot] of Object.entries(DECOR_SPOTS)) {
    test(`clicking the ${name} does nothing`, () => {
      assert.equal(pickHotspot(rayTo(new Vector3(...spot)), index), null);
    });
  }

  test("a ray into empty space picks nothing", () => {
    assert.equal(pickHotspot(new Ray(new Vector3(0, 1, 3), new Vector3(0, 1, 0)), index), null);
  });
});

describe("camera poses", () => {
  test("easeInOutCubic starts at 0, ends at 1 and never goes backwards", () => {
    assert.equal(easeInOutCubic(0), 0);
    assert.equal(easeInOutCubic(1), 1);
    assert.equal(easeInOutCubic(0.5), 0.5);
    let previous = 0;
    for (let t = 0; t <= 1; t += 0.05) {
      const value = easeInOutCubic(t);
      assert.ok(value >= previous - 1e-12);
      previous = value;
    }
    assert.equal(easeInOutCubic(-1), 0);
    assert.equal(easeInOutCubic(2), 1);
  });

  test("sitPose fills the viewport with the screen", () => {
    for (const aspect of [0.46, 1, 16 / 9]) {
      const pose = sitPose(aspect);
      const distance = pose.position[2] - SCREEN.center[2];
      const halfHeight = Math.tan(((pose.fov / 2) * Math.PI) / 180) * distance;
      const visibleWidth = halfHeight * 2 * aspect;
      const visibleHeight = halfHeight * 2;
      // The screen covers the view in at least one direction and is never cropped in both.
      assert.ok(Math.abs(visibleWidth - SCREEN.width) < 1e-9 || Math.abs(visibleHeight - SCREEN.height) < 1e-9, `aspect ${aspect}`);
      assert.deepEqual(pose.target, SCREEN.center);
    }
  });

  test("lerpPose returns the endpoints at 0 and 1", () => {
    const from = roomFraming(16 / 9);
    const to = sitPose(16 / 9);
    assert.deepEqual(lerpPose(from, to, 0), from);
    assert.deepEqual(lerpPose(from, to, 1), to);
    const middle = lerpPose(from, to, 0.5);
    assert.equal(middle.fov, (from.fov + to.fov) / 2);
  });
});
