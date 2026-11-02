"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useBug, useDebugMe } from "../useDebugMe";
import { bugActionClassName } from "../components/BugNotice";

const DEPLOY_DELAY_MS = 900;
const EMAIL = "luciogastellu.dev@gmail.com";

/** Bug 5: the deploy pipeline fails until CONTACT_EMAIL is set. */
const ContactBug = () => {
  const t = useTranslations("debug.contact");
  const { fixed, fix } = useBug("contact");
  const { deployed, fixed: fixedCount, total } = useDebugMe();
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const setEnv = () => {
    setRunning(true);
    timer.current = setTimeout(() => {
      setRunning(false);
      fix();
    }, DEPLOY_DELAY_MS);
  };

  const pending = total - fixedCount;

  return (
    <div className="mb-12 overflow-hidden rounded-card border border-border bg-terminal shadow-terminal">
      <div className="flex items-center gap-2 border-b border-border-soft bg-white/[0.02] px-4 py-3">
        <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
        <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-faint">deploy.log</span>
      </div>

      <div className="flex flex-col gap-1.5 overflow-x-auto px-5 py-5 font-mono text-[13px] leading-[1.7]">
        {(fixed || running) && (
          <p className="text-dim">
            <span className="text-faint">$</span> export CONTACT_EMAIL=
            <span className="text-syntax-string">{EMAIL}</span>
          </p>
        )}
        <p className="text-dim">
          <span className="text-faint">$</span> {t("command")}
        </p>

        {running && <p className="text-warn">{t("running")}</p>}

        {!fixed && !running && (
          <>
            <p className="text-error">{t("error")}</p>
            <p className="text-warn">{t("hint")}</p>
            <div className="mt-3">
              <button
                type="button"
                onClick={setEnv}
                className={bugActionClassName}
              >
                {t("setEnv")}
              </button>
            </div>
          </>
        )}

        {fixed && (
          <p className={deployed ? "text-success" : "text-warn"}>
            {deployed ? t("success") : t("pending", { remaining: pending })}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactBug;
