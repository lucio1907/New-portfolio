import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { QUALITY, initialTier, lowerTier } from "./quality.ts";
import { planetTriangles } from "./planetGeometry.ts";

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

  test("each tier respects the triangle budgets (desktop 120k, mobile 40k)", () => {
    assert.ok(planetTriangles(QUALITY.high.planetDetail) <= 20_000);
    assert.ok(planetTriangles(QUALITY.low.planetDetail) + planetTriangles(QUALITY.low.oceanDetail) <= 12_000);
  });

  test("pixel ratio caps follow the plan (1.5 desktop, 1.25 mobile)", () => {
    assert.equal(QUALITY.high.maxDpr, 1.5);
    assert.equal(QUALITY.low.maxDpr, 1.25);
    assert.ok(QUALITY.medium.maxDpr <= QUALITY.high.maxDpr);
  });
});
