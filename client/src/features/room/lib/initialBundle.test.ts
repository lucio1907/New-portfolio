import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * RoomStage ships in the initial bundle; three.js must only arrive with the
 * lazy RoomCanvas chunk. Guard: nothing RoomStage imports from this feature
 * may import "three" (directly or through another local module).
 */
const here = dirname(fileURLToPath(import.meta.url));
const read = (file: string) => readFileSync(file, "utf8");
const localImports = (file: string): string[] =>
  [...read(file).matchAll(/from "(\.{1,2}\/[^"]+)"/g)]
    .map((match) => join(dirname(file), match[1]))
    .map((path) => (path.endsWith(".ts") || path.endsWith(".tsx") ? path : `${path}.ts`))
    .filter((path) => !path.includes("RoomCanvas"));

const importsThree = (file: string, seen = new Set<string>()): boolean => {
  if (seen.has(file)) return false;
  seen.add(file);
  let source: string;
  try {
    source = read(file);
  } catch {
    source = read(file.replace(/\.ts$/, ".tsx"));
    file = file.replace(/\.ts$/, ".tsx");
  }
  if (/from "three(\/[^"]*)?"|from "@react-three\//.test(source)) return true;
  return localImports(file).some((dependency) => importsThree(dependency, seen));
};

describe("initial bundle", () => {
  test("RoomStage does not pull three.js in eagerly", () => {
    const stage = join(here, "../components/RoomStage.tsx");
    assert.equal(importsThree(stage), false);
  });
});
