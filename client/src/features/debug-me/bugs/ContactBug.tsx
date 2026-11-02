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
    <div className="mb-14 overflow-hidden rounded-card border-3 border-ink bg-terminal shadow-brutal-lg">
      <div className="flex items-center gap-2 border-b-3 border-ink bg-white px-4 py-2.5">
        <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-red" />
        <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-yellow" />
        <span className="h-3.5 w-3.5 rounded-full border-2 border-ink bg-green" />
        <span className="ml-2 font-mono text-xs font-bold">deploy.log</span>
      </div>

      <div className="flex flex-col gap-1.5 overflow-x-auto px-5 py-5 font-mono text-sm leading-[1.7] text-[#E6E6E6]">
        {(fixed || running) && (
          <p>
            <span className="text-pink">$</span> export CONTACT_EMAIL=
            <span className="text-syntax-string">{EMAIL}</span>
          </p>
        )}
        <p>
          <span className="text-pink">$</span> {t("command")}
        </p>

        {running && <p className="text-yellow">{t("running")}</p>}

        {!fixed && !running && (
          <>
            <p className="text-red">{t("error")}</p>
            <p className="text-yellow">{t("hint")}</p>
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
          <p className={deployed ? "font-bold text-green" : "text-yellow"}>
            {deployed ? t("success") : t("pending", { remaining: pending })}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactBug;
