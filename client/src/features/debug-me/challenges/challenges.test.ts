import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { HARNESS_SOURCE } from "./harness.ts";
import {
  EXPERIENCE_CHALLENGE,
  type JsChallenge,
  STACK_CHALLENGE,
} from "./jsChallenges.ts";

type Result = {
  status: "passed" | "failed" | "error";
  message?: string;
  results: { id: string; passed: boolean; message?: string }[];
};

type RunChallenge = (
  code: string,
  entry: string,
  tests: JsChallenge["tests"],
  testTimeoutMs?: number,
) => Promise<Result>;

// Same source the browser worker evaluates.
const runChallenge = new Function(
  `${HARNESS_SOURCE}\nreturn runChallenge;`,
)() as RunChallenge;

const run = (challenge: JsChallenge, code: string) =>
  runChallenge(code, challenge.entry, challenge.tests);

const passedIds = (result: Result) =>
  result.results.filter((r) => r.passed).map((r) => r.id);

describe("stack challenge", () => {
  test("starter code fails the retry tests and passes the happy path", async () => {
    const result = await run(STACK_CHALLENGE, STACK_CHALLENGE.starter);
    assert.equal(result.status, "failed");
    assert.deepEqual(passedIds(result), ["firstTry"]);
  });

  test("fixing only the missing await is not enough", async () => {
    const code = STACK_CHALLENGE.starter.replace(
      "return fetchStack();",
      "return await fetchStack();",
    );
    const result = await run(STACK_CHALLENGE, code);
    assert.equal(result.status, "failed");
    assert.deepEqual(passedIds(result), ["firstTry"]);
  });

  test("the intended fix passes every test", async () => {
    const code = STACK_CHALLENGE.starter
      .replace("return fetchStack();", "return await fetchStack();")
      .replace("attempt < retries", "attempt <= retries");
    const result = await run(STACK_CHALLENGE, code);
    assert.equal(result.status, "passed");
  });

  test("an alternative correct solution also passes", async () => {
    const code = `
async function loadStack(fetchStack, retries) {
  let lastError;
  let left = retries;
  while (left-- > 0) {
    try {
      return await fetchStack();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}`;
    const result = await run(STACK_CHALLENGE, code);
    assert.equal(result.status, "passed");
  });
});

describe("experience challenge", () => {
  test("starter code only passes the no-mutation test", async () => {
    const result = await run(EXPERIENCE_CHALLENGE, EXPERIENCE_CHALLENGE.starter);
    assert.equal(result.status, "failed");
    assert.deepEqual(passedIds(result), ["noMutation"]);
  });

  test("a correct comparator that still mutates the input fails", async () => {
    const code = `
function sortTimeline(items) {
  return items.sort((a, b) => b.start.localeCompare(a.start));
}`;
    const result = await run(EXPERIENCE_CHALLENGE, code);
    assert.equal(result.status, "failed");
    assert.deepEqual(passedIds(result), ["newestFirst", "sameYear"]);
  });

  for (const [name, code] of [
    [
      "spread + localeCompare",
      "function sortTimeline(items) { return [...items].sort((a, b) => b.start.localeCompare(a.start)); }",
    ],
    [
      "toSorted + Date",
      "function sortTimeline(items) { return items.toSorted((a, b) => new Date(b.start) - new Date(a.start)); }",
    ],
    [
      "slice + string comparison",
      "function sortTimeline(items) { return items.slice().sort((a, b) => (a.start < b.start ? 1 : -1)); }",
    ],
  ] as const) {
    test(`correct solution passes: ${name}`, async () => {
      const result = await run(EXPERIENCE_CHALLENGE, code);
      assert.equal(result.status, "passed");
    });
  }
});

describe("harness", () => {
  const tests = STACK_CHALLENGE.tests;

  test("reports syntax errors without running tests", async () => {
    const result = await runChallenge("function loadStack( {", "loadStack", tests);
    assert.equal(result.status, "error");
    assert.deepEqual(result.results, []);
    assert.ok(result.message);
  });

  test("reports a missing entry function", async () => {
    const result = await runChallenge("const x = 1;", "loadStack", tests);
    assert.equal(result.status, "error");
    assert.match(result.message ?? "", /loadStack was not found/);
  });

  test("cuts a test that never settles", async () => {
    const code = "function loadStack() { return new Promise(() => {}); }";
    const result = await runChallenge(code, "loadStack", tests.slice(0, 1), 50);
    assert.equal(result.status, "failed");
    assert.match(result.results[0].message ?? "", /timed out after 50ms/);
  });

  test("runs visitor code in strict mode", async () => {
    const code = "function loadStack() { undeclared = 1; return []; }";
    const result = await runChallenge(code, "loadStack", tests.slice(0, 1));
    assert.equal(result.status, "failed");
    assert.match(result.results[0].message ?? "", /undeclared/);
  });
});
