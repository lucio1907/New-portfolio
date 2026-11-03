import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  createAnagram,
  pickLetter,
  progressOf,
  scrambleWord,
} from "./anagram.ts";
import { HINT_STEP_MS, revealedHints } from "./hints.ts";
import { isStackAnswer, STACK_ANSWER } from "./stack.ts";

describe("anagram", () => {
  test("scrambles the word into a different, deterministic order", () => {
    assert.equal(scrambleWord("LUCIO"), "UILCO");
    assert.equal(scrambleWord("LUCIO"), scrambleWord("LUCIO"));
    assert.notEqual(scrambleWord("LUCIO"), "LUCIO");
  });

  test("starts with no letters placed", () => {
    const state = createAnagram("LUCIO");
    assert.deepEqual(state.tiles, ["U", "I", "L", "C", "O"]);
    assert.deepEqual(state.used, []);
    assert.equal(progressOf(state), "");
  });

  test("placing the next correct letter advances the answer", () => {
    const state = createAnagram("LUCIO");
    const result = pickLetter(state, 2); // "L"
    assert.equal(result.outcome, "correct");
    assert.deepEqual(result.state.used, [2]);
    assert.equal(progressOf(result.state), "L");
  });

  test("a wrong letter is rejected and leaves the state unchanged", () => {
    const state = createAnagram("LUCIO");
    const result = pickLetter(state, 0); // "U" before "L"
    assert.equal(result.outcome, "wrong");
    assert.equal(result.state, state);
  });

  test("a tile that was already used cannot be picked again", () => {
    const first = pickLetter(createAnagram("LUCIO"), 2).state;
    const result = pickLetter(first, 2);
    assert.equal(result.outcome, "wrong");
    assert.equal(result.state, first);
  });

  test("placing every letter in order solves the word", () => {
    let state = createAnagram("LUCIO");
    const outcomes: string[] = [];
    for (const letter of "LUCIO") {
      const index = state.tiles.findIndex(
        (tile, i) => tile === letter && !state.used.includes(i),
      );
      const result = pickLetter(state, index);
      outcomes.push(result.outcome);
      state = result.state;
    }
    assert.deepEqual(outcomes, ["correct", "correct", "correct", "correct", "solved"]);
    assert.equal(progressOf(state), "LUCIO");
  });

  test("picks after the word is solved are ignored", () => {
    let state = createAnagram("AB");
    state = pickLetter(state, state.tiles.indexOf("A")).state;
    state = pickLetter(state, state.tiles.indexOf("B")).state;
    const result = pickLetter(state, 0);
    assert.equal(result.outcome, "wrong");
    assert.equal(result.state, state);
  });
});

describe("progressive hints", () => {
  test("no hint before the first step", () => {
    assert.equal(revealedHints(0, 2), 0);
    assert.equal(revealedHints(HINT_STEP_MS - 1, 2), 0);
  });

  test("one more hint per step, capped at the hint count", () => {
    assert.equal(HINT_STEP_MS, 20_000);
    assert.equal(revealedHints(HINT_STEP_MS, 2), 1);
    assert.equal(revealedHints(HINT_STEP_MS * 2, 2), 2);
    assert.equal(revealedHints(HINT_STEP_MS * 10, 2), 2);
  });
});

describe("stack riddle", () => {
  test("JavaScript is the answer", () => {
    assert.equal(STACK_ANSWER, "JavaScript");
    assert.equal(isStackAnswer("JavaScript"), true);
  });

  test("look-alike techs are not the answer", () => {
    for (const tech of ["Java", "TypeScript", "Node.js", "javascript "]) {
      assert.equal(isStackAnswer(tech), false, tech);
    }
  });
});
