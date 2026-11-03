import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { INITIAL_EXPERIENCE, experienceReducer, initialExperience } from "./experience.ts";

describe("experienceReducer", () => {
  test("starts in the room", () => {
    assert.equal(INITIAL_EXPERIENCE.mode, "room");
  });

  test("sitting down animates when motion is allowed, then lands on the desktop", () => {
    let state = experienceReducer(INITIAL_EXPERIENCE, { type: "sit", animate: true });
    assert.equal(state.mode, "sitting");
    state = experienceReducer(state, { type: "arrived" });
    assert.equal(state.mode, "desktop");
  });

  test("sitting down without animation goes straight to the desktop", () => {
    assert.equal(experienceReducer(INITIAL_EXPERIENCE, { type: "sit", animate: false }).mode, "desktop");
  });

  test("standing up returns to the room; arrived outside a transition is a no-op", () => {
    const desktop = experienceReducer(INITIAL_EXPERIENCE, { type: "sit", animate: false });
    assert.equal(experienceReducer(desktop, { type: "stand" }).mode, "room");
    assert.equal(experienceReducer(INITIAL_EXPERIENCE, { type: "arrived" }), INITIAL_EXPERIENCE);
  });

  test("a deep link or a device without 3D starts on the desktop", () => {
    assert.equal(initialExperience({ deepLink: true, can3D: true }).mode, "desktop");
    assert.equal(initialExperience({ deepLink: false, can3D: false }).mode, "desktop");
    assert.equal(initialExperience({ deepLink: false, can3D: true }).mode, "room");
  });
});
