import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { APPS, isAppId } from "./apps.ts";
import { appFromHash, hashForApp } from "./hash.ts";

describe("apps", () => {
  test("registers the five content apps plus the terminal, in desktop order", () => {
    assert.deepEqual(APPS.map((app) => app.id), ["about", "experience", "projects", "stack", "contact", "terminal"]);
  });

  test("isAppId accepts only registered ids", () => {
    assert.equal(isAppId("projects"), true);
    assert.equal(isAppId("desktop"), false);
    assert.equal(isAppId(""), false);
  });
});

describe("hash deep links", () => {
  test("maps #id to its app and anything else to null", () => {
    assert.equal(appFromHash("#projects"), "projects");
    assert.equal(appFromHash("projects"), "projects");
    assert.equal(appFromHash("#desktop"), null);
    assert.equal(appFromHash(""), null);
  });

  test("builds the hash for an app, or none for the bare desktop", () => {
    assert.equal(hashForApp("contact"), "#contact");
    assert.equal(hashForApp(null), "");
  });
});
