import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { QUALITY, initialTier, lowerTier } from "./quality.ts";

describe("quality tiers", () => {
  test("desktop with enough cores starts high, phones start low", () => {
    assert.equal(initialTier({ mobile: false, cores: 8 }), "high");
    assert.equal(initialTier({ mobile: false, cores: 2 }), "medium");
    assert.equal(initialTier({ mobile: true, cores: 8 }), "low");
  });

  test("lowering never goes below low", () => {
    assert.equal(lowerTier("high"), "medium");
    assert.equal(lowerTier("medium"), "low");
    assert.equal(lowerTier("low"), "low");
  });

  test("pixel ratio caps follow the plan (1.5 desktop, 1.25 mobile)", () => {
    assert.equal(QUALITY.high.maxDpr, 1.5);
    assert.equal(QUALITY.low.maxDpr, 1.25);
    assert.ok(QUALITY.medium.maxDpr <= QUALITY.high.maxDpr);
  });

  test("detail shrinks from high to low", () => {
    assert.ok(QUALITY.high.curveSegments > QUALITY.medium.curveSegments);
    assert.ok(QUALITY.medium.curveSegments > QUALITY.low.curveSegments);
    assert.ok(QUALITY.high.stars > QUALITY.low.stars);
  });
});
