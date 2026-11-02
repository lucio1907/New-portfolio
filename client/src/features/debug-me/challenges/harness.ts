/*
 * The sandbox harness is kept as plain JavaScript source so the exact same code
 * runs inside the browser Web Worker and inside the Node test suite.
 *
 * It defines `runChallenge(code, entry, tests, testTimeoutMs)`, which compiles
 * the visitor's code, looks up the `entry` function and runs every test body
 * (an async function receiving `fn` and `assert`). A single test that never
 * settles is cut by `testTimeoutMs`; a synchronous infinite loop can only be
 * stopped by terminating the worker, which the runner does.
 */
export const HARNESS_SOURCE = String.raw`
const MAX_MESSAGE = 160;

const format = (value) => {
  let text;
  try {
    text = JSON.stringify(value);
  } catch {
    text = String(value);
  }
  if (text === undefined) text = String(value);
  return text.length > MAX_MESSAGE ? text.slice(0, MAX_MESSAGE) + "…" : text;
};

const describe = (error) => {
  const text = error && error.message ? error.message : String(error);
  return text.length > MAX_MESSAGE ? text.slice(0, MAX_MESSAGE) + "…" : text;
};

const assert = {
  equal(actual, expected, label) {
    if (format(actual) !== format(expected)) {
      throw new Error(
        (label ? label + ": " : "") +
          "expected " + format(expected) + ", got " + format(actual),
      );
    }
  },
  ok(value, message) {
    if (!value) throw new Error(message || "expected a truthy value");
  },
};

const withTimeout = (promise, ms) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("timed out after " + ms + "ms")),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });

async function runChallenge(code, entry, tests, testTimeoutMs = 1000) {
  let fn;
  try {
    fn = new Function(
      '"use strict";\n' + code +
        "\n;return typeof " + entry + ' === "function" ? ' + entry + " : undefined;",
    )();
  } catch (error) {
    return { status: "error", message: describe(error), results: [] };
  }
  if (typeof fn !== "function") {
    return {
      status: "error",
      message: "function " + entry + " was not found",
      results: [],
    };
  }

  const results = [];
  for (const test of tests) {
    try {
      const body = new Function(
        "fn",
        "assert",
        '"use strict";\nreturn (async () => {\n' + test.body + "\n})();",
      );
      await withTimeout(Promise.resolve().then(() => body(fn, assert)), testTimeoutMs);
      results.push({ id: test.id, passed: true });
    } catch (error) {
      results.push({ id: test.id, passed: false, message: describe(error) });
    }
  }

  return {
    status: results.every((result) => result.passed) ? "passed" : "failed",
    results,
  };
}
`;

/**
 * Worker entry point. Network and storage APIs are removed before any visitor
 * code runs, and `postMessage` is captured so the visitor code cannot replace
 * the reply channel.
 */
export const WORKER_BOOTSTRAP = String.raw`
const reply = self.postMessage.bind(self);
for (const name of [
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "EventSource",
  "importScripts",
  "indexedDB",
  "caches",
  "BroadcastChannel",
]) {
  try {
    Object.defineProperty(self, name, { value: undefined, writable: false, configurable: false });
  } catch {
    // Some globals are not configurable; ignore them.
  }
}
self.onmessage = async (event) => {
  const { code, entry, tests } = event.data;
  reply(await runChallenge(code, entry, tests));
};
`;
