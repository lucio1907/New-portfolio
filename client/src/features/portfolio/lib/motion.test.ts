import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { countAt, lengthAtY, reachedStops, roadPath, roadStops, roadWaypoints, splitWords, tiltFor } from "./motion.ts";

describe("roadStops", () => {
  test("keeps each height and winds from side to side, starting on the right", () => {
    assert.deepEqual(roadStops([100, 200, 300], 100), [
      { x: 80, y: 100 },
      { x: 20, y: 200 },
      { x: 80, y: 300 },
    ]);
  });

  test("keeps room for the stop's marker on a narrow road", () => {
    assert.deepEqual(roadStops([10, 20], 30), [
      { x: 21, y: 10 },
      { x: 9, y: 20 },
    ]);
  });

  test("never leaves a road too narrow to wind", () => {
    assert.deepEqual(roadStops([10, 20], 10), [
      { x: 5, y: 10 },
      { x: 5, y: 20 },
    ]);
  });

  test("can hug the edges and start on the left", () => {
    assert.deepEqual(roadStops([10, 20], 100, { inset: 12, startLeft: true }), [
      { x: 12, y: 10 },
      { x: 88, y: 20 },
    ]);
  });
});

describe("roadWaypoints", () => {
  test("holds each side until its gap, and crosses only inside it", () => {
    assert.deepEqual(
      roadWaypoints(
        [
          { x: 12, y: 10 },
          { x: 88, y: 100 },
        ],
        [{ from: 50, to: 90 }],
      ),
      [
        { x: 12, y: 10 },
        { x: 12, y: 50 },
        { x: 88, y: 90 },
        { x: 88, y: 100 },
      ],
    );
  });

  test("a single stop has nothing to cross", () => {
    assert.deepEqual(roadWaypoints([{ x: 12, y: 10 }], []), [{ x: 12, y: 10 }]);
  });
});

describe("roadPath", () => {
  test("joins the points with curves that leave and arrive vertically", () => {
    assert.equal(
      roadPath([
        { x: 10, y: 0 },
        { x: 50, y: 100 },
      ]),
      "M10 0 C10 50 50 50 50 100",
    );
  });

  test("continues from each point to the next", () => {
    assert.equal(
      roadPath([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 30 },
      ]),
      "M0 0 C0 5 10 5 10 10 C10 20 0 20 0 30",
    );
  });

  test("has nothing to draw without points", () => {
    assert.equal(roadPath([]), "");
  });
});

describe("lengthAtY", () => {
  const samples = [
    { y: 0, length: 0 },
    { y: 100, length: 150 },
    { y: 200, length: 400 },
  ];

  test("finds how much road it takes to reach a height, between samples too", () => {
    assert.equal(lengthAtY(samples, 100), 150);
    assert.equal(lengthAtY(samples, 50), 75);
    assert.equal(lengthAtY(samples, 150), 275);
  });

  test("stays on the road above its start and past its end", () => {
    assert.equal(lengthAtY(samples, -40), 0);
    assert.equal(lengthAtY(samples, 900), 400);
  });

  test("has no length before the road is measured", () => {
    assert.equal(lengthAtY([], 50), 0);
  });
});

describe("reachedStops", () => {
  test("counts the stops at or above the road's end", () => {
    assert.equal(reachedStops([100, 300], 99), 0);
    assert.equal(reachedStops([100, 300], 100), 1);
    assert.equal(reachedStops([100, 300], 900), 2);
  });
});

describe("tiltFor", () => {
  test("leans the way the cursor moves, in proportion to its speed", () => {
    assert.equal(tiltFor(10), 2);
    assert.equal(tiltFor(-10), -2);
  });

  test("stays upright when the cursor stops", () => {
    assert.equal(tiltFor(0), 0);
  });

  test("never leans past the limit, however fast the cursor goes", () => {
    assert.equal(tiltFor(900), 6);
    assert.equal(tiltFor(-900), -6);
  });
});

describe("splitWords", () => {
  test("splits on any whitespace and keeps punctuation with its word", () => {
    assert.deepEqual(splitWords("Uso IA,  todos\nlos días."), ["Uso", "IA,", "todos", "los", "días."]);
  });

  test("empty or blank text has no words", () => {
    assert.deepEqual(splitWords(""), []);
    assert.deepEqual(splitWords("   "), []);
  });

  test("joining the words gives the text back, so nothing is lost for readers", () => {
    const text = "Construyo productos web de punta a punta.";
    assert.equal(splitWords(text).join(" "), text);
  });
});

describe("countAt", () => {
  test("goes from 0 to the target, exact at both ends", () => {
    assert.equal(countAt(35, 0), 0);
    assert.equal(countAt(35, 1), 35);
  });

  test("shows whole numbers on the way", () => {
    assert.equal(countAt(35, 0.5), 18);
    assert.ok(Number.isInteger(countAt(24, 0.33)));
  });

  test("stays inside the range when scroll overshoots", () => {
    assert.equal(countAt(35, -0.2), 0);
    assert.equal(countAt(35, 1.4), 35);
  });

  test("never goes backwards as the scroll advances", () => {
    let previous = 0;
    for (let progress = 0; progress <= 1; progress += 0.01) {
      const value = countAt(35, progress);
      assert.ok(value >= previous, `${value} after ${previous}`);
      previous = value;
    }
  });
});
