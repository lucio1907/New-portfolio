"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { type JsChallenge, MAX_CODE_LENGTH } from "./jsChallenges";
import { runInSandbox, type SandboxResult } from "./runInSandbox";

type CodeChallengeProps = {
  challenge: JsChallenge;
  fileName: string;
  onSolved: () => void;
};

/** Small editor + test runner where visitors fix a bug by writing code. */
const CodeChallenge = ({ challenge, fileName, onSolved }: CodeChallengeProps) => {
  const t = useTranslations("debug.challenge");
  const [code, setCode] = useState(challenge.starter);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SandboxResult | null>(null);

  const run = async () => {
    setRunning(true);
    const next = await runInSandbox(challenge, code);
    setResult(next);
    setRunning(false);
    if (next.status === "passed") onSolved();
  };

  const reset = () => {
    setCode(challenge.starter);
    setResult(null);
  };

  const passedCount = result?.results.filter((r) => r.passed).length ?? 0;
  const editorId = `challenge-${challenge.bugId}`;

  return (
    <div className="mb-8 overflow-hidden rounded-card border-3 border-ink bg-terminal shadow-brutal-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-ink bg-white px-4 py-2">
        <label htmlFor={editorId} className="font-mono text-xs font-bold">
          {fileName}
          <span className="sr-only"> — {t("editorLabel", { file: fileName })}</span>
        </label>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border-2 border-ink px-2 py-1 font-mono text-xs font-bold hover:bg-yellow"
        >
          {t("reset")}
        </button>
      </div>

      <textarea
        id={editorId}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        maxLength={MAX_CODE_LENGTH}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        rows={Math.min(16, challenge.starter.split("\n").length + 1)}
        className="block w-full resize-y bg-terminal px-4 py-4 font-mono text-[13px] leading-[1.7] text-[#E6E6E6] outline-none [tab-size:2] focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-blue"
      />

      <div className="flex flex-col gap-3 border-t-3 border-ink bg-white px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="brutal-btn min-h-[44px] bg-pink px-4 font-mono text-sm"
          >
            {running ? t("running") : `▶ ${t("run")}`}
          </button>
          <p aria-live="polite" className="font-mono text-sm font-bold">
            {result?.status === "passed" && `✓ ${t("passed")}`}
            {result?.status === "failed" &&
              t("summary", { passed: passedCount, total: result.results.length })}
            {result?.status === "timeout" && t("timeout")}
            {result?.status === "error" &&
              t("error", { message: result.message ?? "" })}
          </p>
        </div>

        {result && result.results.length > 0 && (
          <ul className="flex flex-col gap-1.5 font-mono text-[13px]">
            {result.results.map((test) => (
              <li key={test.id} className="flex flex-col">
                <span className="flex items-center gap-2 font-bold">
                  <span
                    aria-hidden="true"
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-ink text-[11px] ${
                      test.passed ? "bg-green" : "bg-red"
                    }`}
                  >
                    {test.passed ? "✓" : "✗"}
                  </span>
                  {t(`tests.${challenge.bugId}.${test.id}`)}
                  <span className="sr-only">
                    {" — "}
                    {test.passed ? t("testPassed") : t("testFailed")}
                  </span>
                </span>
                {!test.passed && test.message && (
                  <span className="pl-7 text-ink-soft">{test.message}</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <details className="font-mono text-[13px]">
          <summary className="w-fit cursor-pointer font-bold underline decoration-2 underline-offset-4">
            {t("hintLabel")}
          </summary>
          <p className="mt-2 text-ink-soft">{t(`hints.${challenge.bugId}`)}</p>
        </details>
      </div>
    </div>
  );
};

export default CodeChallenge;
