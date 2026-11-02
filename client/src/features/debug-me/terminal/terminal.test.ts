import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  type CommandResult,
  initialTerminalState,
  MAX_COMMAND_LENGTH,
  runCommand,
  type TerminalState,
} from "./terminal.ts";

const keys = (result: CommandResult) =>
  result.lines.map((line) => ("key" in line ? `${line.kind}:${line.key}` : `${line.kind}:${line.text}`));

/** Runs several commands in sequence, threading the state. */
const session = (commands: string[]) => {
  let state: TerminalState = initialTerminalState;
  let last: CommandResult = { state, lines: [] };
  for (const command of commands) {
    last = runCommand(command, state);
    state = last.state;
  }
  return last;
};

describe("deploy flow", () => {
  test("deploy fails while CONTACT_EMAIL is missing", () => {
    const result = runCommand("npm run deploy", initialTerminalState);
    assert.deepEqual(keys(result), ["input:npm run deploy", "error:missingEnv"]);
    assert.equal(result.deployed, undefined);
  });

  test("export + deploy succeeds and reports deployed", () => {
    const result = session([
      "export CONTACT_EMAIL=recruiter@company.com",
      "npm run deploy",
    ]);
    assert.equal(result.deployed, true);
    assert.deepEqual(keys(result), [
      "input:npm run deploy",
      "output:building",
      "success:deploySuccess",
    ]);
  });

  test("quoted values are accepted", () => {
    const result = session(['export CONTACT_EMAIL="me@lucio.dev"', "npm run deploy"]);
    assert.equal(result.deployed, true);
  });

  test("an invalid email is rejected and does not unlock the deploy", () => {
    const exported = runCommand("export CONTACT_EMAIL=not-an-email", initialTerminalState);
    assert.deepEqual(keys(exported), [
      "input:export CONTACT_EMAIL=not-an-email",
      "error:invalidEmail",
    ]);
    assert.deepEqual(exported.state.env, {});
    assert.equal(runCommand("npm run deploy", exported.state).deployed, undefined);
  });

  test("export without = shows usage", () => {
    const result = runCommand("export CONTACT_EMAIL", initialTerminalState);
    assert.deepEqual(keys(result), ["input:export CONTACT_EMAIL", "error:exportUsage"]);
  });

  test("other npm commands are rejected", () => {
    assert.deepEqual(keys(runCommand("npm install", initialTerminalState)), [
      "input:npm install",
      "error:npmUsage",
    ]);
  });
});

describe("other commands", () => {
  test("echo expands variables", () => {
    const result = session(["export NAME=Lucio", "echo hello $NAME"]);
    assert.deepEqual(keys(result), ["input:echo hello $NAME", "text:hello Lucio"]);
  });

  test("clear wipes the output", () => {
    const result = runCommand("clear", initialTerminalState);
    assert.equal(result.clear, true);
    assert.deepEqual(result.lines, []);
  });

  test("unknown commands report not found with the command name", () => {
    const result = runCommand("vim", initialTerminalState);
    assert.deepEqual(result.lines[1], {
      kind: "error",
      key: "notFound",
      values: { command: "vim" },
    });
  });

  test("empty input does nothing", () => {
    assert.deepEqual(runCommand("   ", initialTerminalState).lines, []);
  });

  test("input is trimmed to the maximum length", () => {
    const result = runCommand("echo " + "x".repeat(500), initialTerminalState);
    const first = result.lines[0];
    assert.ok("text" in first && first.text.length === MAX_COMMAND_LENGTH);
  });

  for (const [command, expected] of [
    ["help", "output:help"],
    ["whoami", "output:whoami"],
    ["hire lucio", "success:hire"],
    ["sudo rm -rf /", "error:sudo"],
    ["rm -rf node_modules", "error:rm"],
  ] as const) {
    test(`${command} answers with ${expected}`, () => {
      assert.equal(keys(runCommand(command, initialTerminalState))[1], expected);
    });
  }
});
