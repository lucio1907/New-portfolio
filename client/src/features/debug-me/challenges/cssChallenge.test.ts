import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  CSS_STARTER,
  failingChecks,
  parseDeclarations,
  toPreviewStyle,
} from "./cssChallenge.ts";

describe("parseDeclarations", () => {
  test("reads declarations inside the rule, ignoring comments and case", () => {
    const declarations = parseDeclarations(`
      /* layout */
      .projects {
        DISPLAY: grid; /* fixed! */
        gap:   24px ;
      }`);
    assert.deepEqual(declarations, { display: "grid", gap: "24px" });
  });

  test("the last declaration of a property wins", () => {
    assert.equal(
      parseDeclarations(".p { display: block; display: grid; }").display,
      "grid",
    );
  });

  test("accepts bare declarations without a selector", () => {
    assert.deepEqual(parseDeclarations("display: grid"), { display: "grid" });
  });
});

describe("CSS checks", () => {
  test("the starter CSS fails every check", () => {
    assert.deepEqual(failingChecks(parseDeclarations(CSS_STARTER)), [
      "display",
      "position",
      "gap",
      "columns",
    ]);
  });

  test("a grid with gap and columns passes", () => {
    const css = `.projects {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 24px;
    }`;
    assert.deepEqual(failingChecks(parseDeclarations(css)), []);
  });

  test("relative positioning and row/column gaps are accepted", () => {
    const css = `.projects {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      row-gap: 16px;
      column-gap: 16px;
    }`;
    assert.deepEqual(failingChecks(parseDeclarations(css)), []);
  });

  test("absolute positioning keeps failing even with a grid", () => {
    const css = `.projects {
      position: absolute;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }`;
    assert.deepEqual(failingChecks(parseDeclarations(css)), ["position"]);
  });

  test("flex is not a grid", () => {
    const css = ".projects { display: flex; gap: 8px; grid-template-columns: 1fr; }";
    assert.deepEqual(failingChecks(parseDeclarations(css)), ["display"]);
  });
});

describe("toPreviewStyle", () => {
  test("keeps layout properties as camelCase inline styles", () => {
    assert.deepEqual(
      toPreviewStyle(
        parseDeclarations(
          ".p { display: grid; grid-template-columns: 1fr 1fr; column-gap: 8px; }",
        ),
      ),
      { display: "grid", columnGap: "8px", gridTemplateColumns: "1fr 1fr" },
    );
  });

  test("drops properties outside the allowlist", () => {
    assert.deepEqual(
      toPreviewStyle(parseDeclarations(".p { background: red; display: grid; }")),
      { display: "grid" },
    );
  });

  test("drops unsafe or oversized values", () => {
    const style = toPreviewStyle({
      display: "url(https://example.com/x)",
      gap: "expression(alert(1))",
      "grid-template-columns": "x".repeat(200),
      "justify-items": "center",
    });
    assert.deepEqual(style, { justifyItems: "center" });
  });
});
