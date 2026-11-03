"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useBug, useDebugMe } from "../useDebugMe";
import BugNotice from "../components/BugNotice";
import {
  type CommandResult,
  initialTerminalState,
  MAX_COMMAND_LENGTH,
  runCommand,
  type TerminalLine,
} from "../terminal/terminal";

const MAX_LINES = 60;
const PROMPT = "visitor@lucio.dev:~$";

const INITIAL_LINES: TerminalLine[] = [
  { kind: "input", text: "npm run deploy" },
  { kind: "error", key: "missingEnv" },
  { kind: "output", key: "intro" },
];

// The terminal is always dark, so it uses fixed colors instead of theme tokens.
const LINE_COLORS: Record<TerminalLine["kind"], string> = {
  input: "text-[#E6ECF4]",
  text: "text-[#E6ECF4]",
  output: "text-[#9AA7BA]",
  error: "text-[#F56360]",
  success: "font-bold text-[#34C776]",
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
          <span className="text-[#63AAFF]">$</span> {line.text}
        </>
      );
    }
    if (line.kind === "text") return line.text;
    return tt(`out.${line.key}`, line.values);
  };

  const pending = total - fixedCount;

  return (
    <div>
      <BugNotice
        fixed={fixed}
        riddle={t("riddle")}
        hints={[t("hint1"), t("hint2")]}
        fixedText={t("envSet")}
      />
      <div className="overflow-hidden rounded-box border border-line bg-terminal">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#121821] px-4 py-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#F56360]" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#E5B548]" />
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#34C776]" />
          <span className="ml-2 font-mono text-xs text-[#9AA7BA]">ci / deploy.sh</span>
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
            <p className={deployed ? "font-bold text-[#34C776]" : "text-[#E5B548]"}>
              {deployed ? t("success") : t("pending", { remaining: pending })}
            </p>
          )}
        </div>

        <form
          onSubmit={submit}
          className="flex items-center gap-2 px-5 pb-5 pt-2 font-mono text-sm"
        >
          <label htmlFor="terminal-input" className="shrink-0 text-[#63AAFF]">
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
            className="min-w-0 flex-1 rounded-md bg-transparent px-1 text-[#E6ECF4] caret-[#E5B548] outline-none placeholder:text-[#6B7890] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#63AAFF]"
          />
          <button
            type="submit"
            className="min-h-[32px] rounded-md border border-[#3A4558] px-2.5 text-xs font-semibold text-[#E6ECF4] hover:bg-[#E6ECF4] hover:text-[#0A0D12]"
          >
            {tt("run")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactBug;
