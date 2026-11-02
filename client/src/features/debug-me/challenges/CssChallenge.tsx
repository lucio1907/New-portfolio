"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CSS_CHECKS,
  CSS_STARTER,
  MAX_CSS_LENGTH,
  parseDeclarations,
  toPreviewStyle,
} from "./cssChallenge";

const PREVIEW_COLORS = [
  "bg-yellow",
  "bg-pink",
  "bg-blue",
  "bg-green",
  "bg-lilac",
  "bg-white",
];

type CssChallengeProps = {
  onSolved: () => void;
};

/** CSS editor with a live, sandboxed preview of the projects grid. */
const CssChallenge = ({ onSolved }: CssChallengeProps) => {
  const t = useTranslations("debug.css");
  const tc = useTranslations("debug.challenge");
  const [css, setCss] = useState(CSS_STARTER);

  const declarations = useMemo(() => parseDeclarations(css), [css]);
  const previewStyle = useMemo(() => toPreviewStyle(declarations), [declarations]);
  const checks = CSS_CHECKS.map((check) => ({
    id: check.id,
    passed: check.passes(declarations),
  }));
  const allPassed = checks.every((check) => check.passed);

  return (
    <div className="mb-8 overflow-hidden rounded-card border-3 border-ink bg-white shadow-brutal-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-ink bg-white px-4 py-2">
        <label htmlFor="challenge-projects" className="font-mono text-xs font-bold">
          projects.css
          <span className="sr-only"> — {tc("editorLabel", { file: "projects.css" })}</span>
        </label>
        <button
          type="button"
          onClick={() => setCss(CSS_STARTER)}
          className="rounded-md border-2 border-ink px-2 py-1 font-mono text-xs font-bold hover:bg-yellow"
        >
          {tc("reset")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <textarea
          id="challenge-projects"
          value={css}
          onChange={(event) => setCss(event.target.value)}
          maxLength={MAX_CSS_LENGTH}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          rows={9}
          className="block min-h-[220px] w-full resize-y bg-terminal px-4 py-4 font-mono text-[13px] leading-[1.7] text-[#E6E6E6] outline-none [tab-size:2] focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-blue md:border-r-3 md:border-ink"
        />

        <div className="flex flex-col gap-2 bg-paper p-4">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.12em]">
            {t("preview")}
          </span>
          <div
            aria-hidden="true"
            className="relative h-[180px] overflow-hidden rounded-btn border-2 border-dashed border-ink bg-white p-2"
          >
            <div style={previewStyle}>
              {PREVIEW_COLORS.map((color, index) => (
                <div
                  key={color}
                  className={`flex h-12 min-w-[48px] items-center justify-center rounded-md border-2 border-ink font-mono text-xs font-bold ${color} ${
                    color === "bg-blue" ? "text-white" : ""
                  }`}
                >
                  P{index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t-3 border-ink px-4 py-4">
        <ul aria-label={t("checksLabel")} className="grid grid-cols-1 gap-1.5 font-mono text-[13px] sm:grid-cols-2">
          {checks.map((check) => (
            <li key={check.id} className="flex items-center gap-2 font-bold">
              <span
                aria-hidden="true"
                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-ink text-[11px] ${
                  check.passed ? "bg-green" : "bg-red"
                }`}
              >
                {check.passed ? "✓" : "✗"}
              </span>
              {t(`checks.${check.id}`)}
              <span className="sr-only">
                {" — "}
                {check.passed ? tc("testPassed") : tc("testFailed")}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSolved}
            disabled={!allPassed}
            aria-describedby={allPassed ? undefined : "css-not-yet"}
            className="brutal-btn min-h-[44px] bg-pink px-4 font-mono text-sm disabled:cursor-not-allowed"
          >
            ▶ {t("ship")}
          </button>
          {!allPassed && (
            <span id="css-not-yet" className="font-mono text-[13px] text-ink-soft">
              {t("notYet")}
            </span>
          )}
        </div>

        <details className="font-mono text-[13px]">
          <summary className="w-fit cursor-pointer font-bold underline decoration-2 underline-offset-4">
            {tc("hintLabel")}
          </summary>
          <p className="mt-2 text-ink-soft">{tc("hints.projects")}</p>
        </details>
      </div>
    </div>
  );
};

export default CssChallenge;
