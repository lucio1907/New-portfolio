import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { SECTIONS, formatCoordinate } from "./sections.ts";

describe("SECTIONS", () => {
  test("lists the six portfolio sections in reading order", () => {
    assert.deepEqual(
      SECTIONS.map((section) => section.id),
      ["home", "about", "experience", "stack", "projects", "contact"],
    );
  });

  test("home sits on Buenos Aires' real coordinates", () => {
    const home = SECTIONS[0];
    assert.equal(home.lat, -34.6);
    assert.equal(home.lon, -58.4);
  });

  test("every landmark is a valid, distinct point on the sphere", () => {
    const keys = new Set<string>();
    for (const { lat, lon } of SECTIONS) {
      assert.ok(lat >= -90 && lat <= 90, `lat ${lat}`);
      assert.ok(lon >= -180 && lon <= 180, `lon ${lon}`);
      keys.add(`${lat},${lon}`);
    }
    assert.equal(keys.size, SECTIONS.length);
  });
});

describe("formatCoordinate", () => {
  test("uses degrees, minutes and hemisphere letters", () => {
    assert.equal(formatCoordinate(-34.6, -58.4), "34°36′S 58°24′W");
    assert.equal(formatCoordinate(12.25, 101.5), "12°15′N 101°30′E");
  });

  test("handles the equator and the prime meridian", () => {
    assert.equal(formatCoordinate(0, 0), "0°00′N 0°00′E");
  });
});
