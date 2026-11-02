"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useBug, useDebugMe } from "../useDebugMe";
import { bugActionClassName } from "../components/BugNotice";
import {
  type CommandResult,
  initialTerminalState,
  MAX_COMMAND_LENGTH,
  runCommand,
  type TerminalLine,
} from "../terminal/terminal";

const EMAIL = "luciogastellu.dev@gmail.com";
const MAX_LINES = 60;
const PROMPT = "visitor@lucio.dev:~$";

const INITIAL_LINES: TerminalLine[] = [
  { kind: "input", text: "npm run deploy" },
  { kind: "error", key: "missingEnv" },
  { kind: "output", key: "intro" },
];

const LINE_COLORS: Record<TerminalLine["kind"], string> = {
  input: "text-[#E6E6E6]",
  text: "text-[#E6E6E6]",
  output: "text-[#BDBDBD]",
  error: "text-red",
  success: "font-bold text-green",
};

/** Bug 5: a tiny terminal where the deploy fails until CONTACT_EMAIL is set. */
const ContactBug = () => {
  const t = useTranslations("debug.contact");
  const tt = useTranslations("debug.terminal");
  const { fixed, fix } = useBug("contact");
  const { deployed, fixed: fixedCount, total } = useDebugMe();
  const [terminal, setTerminal] = useState(initialTerminalState);
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines]);

  /** Runs commands in order, threading the terminal state between them. */
  const execute = (commands: string[]) => {
    let state = terminal;
    let output: TerminalLine[] = [];
    let cleared = false;
    let didDeploy = false;

    for (const command of commands) {
      const result: CommandResult = runCommand(command, state);
      state = result.state;
      if (result.clear) {
        output = [];
        cleared = true;
      }
      output = [...output, ...result.lines];
      didDeploy ||= result.deployed === true;
    }

    setTerminal(state);
    setLines((previous) =>
      (cleared ? output : [...previous, ...output]).slice(-MAX_LINES),
    );
    if (didDeploy) fix();
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const command = input.trim();
    if (!command) return;
    execute([command]);
    setHistory((previous) => [...previous, command].slice(-20));
    setInput("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && history.length > 0) {
      event.preventDefault();
      setInput(history[history.length - 1]);
    }
  };

  const renderLine = (line: TerminalLine) => {
    if (line.kind === "input") {
      return (
        <>
          <span className="text-pink">$</span> {line.text}
        </>
      );
    }
    if (line.kind === "text") return line.text;
    return tt(`out.${line.key}`, line.values);
  };

  const pending = total - fixedCount;

  return (
    <div className="mb-14">
      <div className="overflow-hidden rounded-card border-3 border-ink bg-terminal shadow-brutal-lg">
        <div className="flex items-center gap-2 border-b-3 border-ink bg-white px-4 py-2.5">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-red" />
          <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-yellow" />
          <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-green" />
          <span className="ml-2 font-mono text-xs font-bold">deploy.sh</span>
        </div>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          onClick={() => inputRef.current?.focus()}
          className="flex max-h-[260px] flex-col gap-1 overflow-y-auto px-5 pt-5 font-mono text-sm leading-[1.6]"
        >
          {lines.map((line, index) => (
            <p key={index} className={`break-words ${LINE_COLORS[line.kind]}`}>
              {renderLine(line)}
            </p>
          ))}
          {fixed && (
            <p className={deployed ? "font-bold text-green" : "text-yellow"}>
              {deployed ? t("success") : t("pending", { remaining: pending })}
            </p>
          )}
        </div>

        <form
          onSubmit={submit}
          className="flex items-center gap-2 px-5 pb-5 pt-2 font-mono text-sm"
        >
          <label htmlFor="terminal-input" className="shrink-0 text-pink">
            <span aria-hidden="true">{PROMPT}</span>
            <span className="sr-only">{tt("label")}</span>
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            maxLength={MAX_COMMAND_LENGTH}
            placeholder={tt("placeholder")}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="min-w-0 flex-1 rounded-md bg-transparent px-1 text-[#E6E6E6] caret-yellow outline-none placeholder:text-[#8A8A8A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue"
          />
          <button
            type="submit"
            className="rounded-md border-2 border-[#E6E6E6] px-2 py-0.5 text-xs font-bold text-[#E6E6E6] hover:bg-[#E6E6E6] hover:text-ink"
          >
            {tt("run")}
          </button>
        </form>
      </div>

      {!fixed && (
        <button
          type="button"
          onClick={() => execute([`export CONTACT_EMAIL=${EMAIL}`, "npm run deploy"])}
          className={`${bugActionClassName} mt-5`}
        >
          {t("setEnv")}
        </button>
      )}
    </div>
  );
};

export default ContactBug;
