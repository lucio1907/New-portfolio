"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useBug } from "../useDebugMe";
import BugNotice, { bugActionClassName } from "../components/BugNotice";

type Phase = "stuck" | "retrying" | "failed";

const RETRY_DELAY_MS = 800;

/** Bug 2: the tech stack loader never finishes; the second retry works. */
const StackBug = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("debug.stack");
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
      </BugNotice>

      {!fixed && (
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[13px]">
          <span
            aria-hidden="true"
            className="h-4 w-4 rounded-full border-2 border-white/15 border-t-accent motion-safe:animate-spin"
          />
          <span className="text-dim">{t("loading")}</span>
          {phase === "failed" && (
            <span role="alert" className="text-error">
              {t("firstError")}
            </span>
          )}
        </div>
      )}

      <div
        className={`transition-opacity duration-500 ${fixed ? "opacity-100" : "opacity-70"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default StackBug;
