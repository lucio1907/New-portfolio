"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ProjectsData from "@/json/projects.json";
import { type TerminalLine, runCommand } from "../lib/terminal";
import { CV_HREF, EMAIL, PHONE, SOCIAL_LINKS } from "@/features/portfolio/lib/constants";
import { dispatchDesktop, toggleStats } from "@/features/experience/store";

const PROMPT = "visitor@lucio-os:~$";
const MAX_LINES = 200;

type Entry = { id: number; prompt?: string; line?: TerminalLine };

const COLORS: Record<TerminalLine["kind"], string> = {
  output: "text-[#C9D1E8]",
  error: "text-[#F28C8C]",
  success: "font-semibold text-[#7DDBA0]",
};

/** LucioOS terminal: a tiny shell over the portfolio, for developers. */
const Terminal = () => {
  const t = useTranslations("os.terminal");
  const ta = useTranslations("about");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const nextId = useRef(0);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [entries]);

  const context = {
    projects: ProjectsData.projects.map((project) => project.projectName),
    about: [ta("heading"), ta("bio1")],
    email: EMAIL,
    phone: PHONE.label,
    links: SOCIAL_LINKS.map((link) => link.href.replace(/^https?:\/\//, "")),
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const command = input;
    const result = runCommand(command, context);
    const make = (entry: Omit<Entry, "id">): Entry => ({ id: nextId.current++, ...entry });
    if (result.effect?.type === "clear") setEntries([]);
    else setEntries((previous) => [...previous, make({ prompt: command }), ...result.lines.map((line) => make({ line }))].slice(-MAX_LINES));
    if (result.effect?.type === "open") dispatchDesktop({ type: "open", app: result.effect.app });
    if (result.effect?.type === "cv") window.open(CV_HREF, "_blank", "noopener");
    if (result.effect?.type === "stats") toggleStats();
    if (command.trim()) setHistory((previous) => [...previous, command].slice(-50));
    setCursor(null);
    setInput("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    if (history.length === 0) return;
    event.preventDefault();
    const last = history.length - 1;
    const next = event.key === "ArrowUp" ? (cursor === null ? last : Math.max(0, cursor - 1)) : cursor === null ? null : cursor + 1 > last ? null : cursor + 1;
    setCursor(next);
    setInput(next === null ? "" : history[next]);
  };

  return (
    <div className="-mx-5 -my-6 flex h-[calc(100%+3rem)] flex-col bg-[#0A0E26] font-mono text-[13.5px] leading-relaxed md:-mx-8">
      <div ref={log} role="log" aria-live="polite" className="flex-1 overflow-y-auto px-5 py-4 md:px-6">
        <p className="text-haze">{t("welcome")}</p>
        {entries.map((entry) =>
          entry.prompt !== undefined ? (
            <p key={entry.id} className="break-words text-parchment">
              <span className="text-sky">{PROMPT}</span> {entry.prompt}
            </p>
          ) : (
            <p key={entry.id} className={`whitespace-pre-wrap break-words ${COLORS[entry.line!.kind]}`}>
              {entry.line!.text}
            </p>
          ),
        )}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-orbit/60 px-5 py-3 md:px-6">
        <label htmlFor="terminal-input" className="shrink-0 text-sky">
          <span aria-hidden="true">{PROMPT}</span>
          <span className="sr-only">{t("label")}</span>
        </label>
        <input
          id="terminal-input"
          data-autofocus
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={120}
          placeholder="help"
          className="min-w-0 flex-1 bg-transparent text-parchment caret-sun outline-none placeholder:text-haze/60"
        />
      </form>
    </div>
  );
};

export default Terminal;
