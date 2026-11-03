import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { type TerminalContext, runCommand } from "./terminal.ts";

const context: TerminalContext = {
  projects: ["Ecommerce CoClothes", "SitioHoy"],
  about: ["Full Stack Developer.", "AI-native."],
  email: "me@example.com",
  phone: "+54 1",
  links: ["github.com/me"],
};

const texts = (input: string) => runCommand(input, context).lines.map((line) => line.text);

describe("terminal", () => {
  test("help lists every command", () => {
    const output = texts("help").join("\n");
    for (const command of ["help", "whoami", "ls", "cat", "open", "contact", "stats", "clear", "echo"]) {
      assert.ok(output.includes(command), command);
    }
  });

  test("whoami, ls and ls projects describe Lucio's files", () => {
    assert.match(texts("whoami")[0], /Lucio Gastellu/);
    assert.match(texts("ls")[0], /projects\//);
    assert.deepEqual(texts("ls projects"), ["Ecommerce CoClothes", "SitioHoy"]);
  });

  test("cat about.md prints the bio; other files are not found", () => {
    assert.deepEqual(texts("cat about.md"), ["Full Stack Developer.", "AI-native."]);
    const missing = runCommand("cat secrets.env", context).lines[0];
    assert.equal(missing.kind, "error");
    assert.match(missing.text, /secrets\.env/);
  });

  test("open launches apps and the CV; unknown targets fail", () => {
    assert.deepEqual(runCommand("open projects", context).effect, { type: "open", app: "projects" });
    assert.deepEqual(runCommand("open cv", context).effect, { type: "cv" });
    const result = runCommand("open nope", context);
    assert.equal(result.effect, undefined);
    assert.equal(result.lines[0].kind, "error");
  });

  test("contact lists the ways to reach Lucio", () => {
    assert.deepEqual(texts("contact"), ["email  me@example.com", "phone  +54 1", "link   github.com/me"]);
  });

  test("stats and clear only emit effects", () => {
    assert.deepEqual(runCommand("stats", context).effect, { type: "stats" });
    assert.deepEqual(runCommand("clear", context), { lines: [], effect: { type: "clear" } });
  });

  test("sudo hire lucio opens Contact; other sudo is refused", () => {
    const hire = runCommand("sudo hire lucio", context);
    assert.equal(hire.lines[0].kind, "success");
    assert.deepEqual(hire.effect, { type: "open", app: "contact" });
    assert.equal(runCommand("sudo rm -rf /", context).lines[0].kind, "error");
  });

  test("input is trimmed and case-insensitive; empty input prints nothing", () => {
    assert.deepEqual(texts("  WHOAMI  "), texts("whoami"));
    assert.deepEqual(runCommand("   ", context), { lines: [] });
    assert.deepEqual(texts("echo hola mundo"), ["hola mundo"]);
  });

  test("unknown commands suggest help", () => {
    const line = runCommand("rm -rf /", context).lines[0];
    assert.equal(line.kind, "error");
    assert.match(line.text, /command not found: rm/);
    assert.match(line.text, /help/);
  });
});
