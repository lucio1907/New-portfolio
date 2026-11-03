import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { Ray, Vector3 } from "three";
import { HOTSPOTS, hotspotIndex, pickHotspot } from "./hotspots.ts";
import { HOTSPOT_IDS, SCREEN, buildRoomGeometry } from "./furniture.ts";
import { QUALITY } from "./quality.ts";
import { easeInOutCubic, lerpPose, roomFraming, sitPose } from "./camera.ts";

describe("hotspots", () => {
  test("map every interactive object to what it opens", () => {
    const opens = Object.fromEntries(HOTSPOTS.map((hotspot) => [hotspot.name, hotspot.app]));
    assert.deepEqual(opens, {
      monitor: null,
      chair: null,
      mate: "about",
      books: "experience",
      notes: "stack",
      boxes: "projects",
      phone: "contact",
    });
    for (const hotspot of HOTSPOTS) assert.equal(hotspot.id, HOTSPOT_IDS[hotspot.name]);
  });

  const index = hotspotIndex(buildRoomGeometry(QUALITY.high));
  const boxes = index.boxes;

  test("one bounding box and a triangle list per hotspot", () => {
    assert.equal(boxes.size, HOTSPOTS.length);
    for (const box of boxes.values()) assert.ok(!box.isEmpty());
    for (const hotspot of HOTSPOTS) assert.ok(index.triangles.get(hotspot.id)!.length % 9 === 0);
  });

  test("regression: the chair's loose bounding box does not steal the phone", () => {
    // From the default camera, the ray to the phone crosses the chair's
    // bounding box but none of the chair's triangles.
    const camera = new Vector3(2.35, 1.75, 2.55);
    const phone = boxes.get(HOTSPOT_IDS.phone)!.getCenter(new Vector3());
    const ray = new Ray(camera, phone.clone().sub(camera).normalize());
    assert.equal(pickHotspot(ray, index), HOTSPOT_IDS.phone);
  });

  test("a ray through an object's center picks it", () => {
    const camera = new Vector3(2.35, 1.75, 2.55);
    for (const hotspot of HOTSPOTS) {
      const center = boxes.get(hotspot.id)!.getCenter(new Vector3());
      const ray = new Ray(camera, center.clone().sub(camera).normalize());
      const picked = pickHotspot(ray, index);
      // The chair stands in front of the desk, so it may legitimately win.
      assert.ok(picked === hotspot.id || picked === HOTSPOT_IDS.chair, `${hotspot.name}: picked ${picked}`);
    }
  });

  test("a ray into empty space picks nothing", () => {
    const ray = new Ray(new Vector3(0, 1, 3), new Vector3(0, 1, 0));
    assert.equal(pickHotspot(ray, index), null);
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
      assert.deepEqual(pose.offset, { x: 0, y: 0 });
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
