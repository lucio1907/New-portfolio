import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { countAt, splitWords, tiltFor } from "./motion.ts";

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
