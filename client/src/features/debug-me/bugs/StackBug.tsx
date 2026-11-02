"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useBug } from "../useDebugMe";
import BugNotice, {
  bugActionClassName,
  bugSecondaryActionClassName,
} from "../components/BugNotice";
import CodeChallenge from "../challenges/CodeChallenge";
import { STACK_CHALLENGE } from "../challenges/jsChallenges";

type Phase = "stuck" | "retrying" | "failed";

const RETRY_DELAY_MS = 800;

/** Bug 2: the tech stack loader never finishes; the second retry works. */
const StackBug = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("debug.stack");
  const tc = useTranslations("debug.challenge");
  const [showCode, setShowCode] = useState(false);
  const { fixed, fix } = useBug("stack");
  const [phase, setPhase] = useState<Phase>("stuck");
  const attempts = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const retry = () => {
    setPhase("retrying");
    timer.current = setTimeout(() => {
      attempts.current += 1;
      if (attempts.current === 1) {
        setPhase("failed");
      } else {
        fix();
      }
    }, RETRY_DELAY_MS);
  };

  const retrying = phase === "retrying";

  return (
    <div>
      <BugNotice fixed={fixed} hint={t("hint")} fixedText={t("loaded")}>
        <button
          type="button"
          onClick={retry}
          disabled={retrying}
          className={bugActionClassName}
        >
          {retrying ? t("retrying") : t("retry")}
        </button>
        <button
          type="button"
          aria-expanded={showCode}
          aria-controls="challenge-stack"
          onClick={() => setShowCode((open) => !open)}
          className={bugSecondaryActionClassName}
        >
          <span aria-hidden="true">{"</>"}</span>
          {showCode ? tc("close") : tc("open")}
        </button>
      </BugNotice>

      {!fixed && showCode && (
        <CodeChallenge
          challenge={STACK_CHALLENGE}
          fileName="loadStack.js"
          onSolved={fix}
        />
      )}

      {!fixed && (
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex items-center gap-3 font-mono text-sm font-bold">
            {t("loading")}
          </div>
          <div
            aria-hidden="true"
            className="h-6 overflow-hidden rounded-full border-3 border-ink bg-white"
          >
            <div className="hazard-tape h-full w-2/3 border-r-3 border-ink [background-size:40px_40px] motion-safe:animate-stripes" />
          </div>
          {phase === "failed" && (
            <p
              role="alert"
              className="w-fit rounded-btn border-2 border-ink bg-red px-3 py-1.5 font-mono text-sm font-bold"
            >
              {t("firstError")}
            </p>
          )}
        </div>
      )}

      <div
        className={`transition-opacity duration-500 ${fixed ? "opacity-100" : "opacity-75"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default StackBug;
