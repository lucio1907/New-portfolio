"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBug } from "../useDebugMe";
import BugNotice from "../components/BugNotice";
import { isStackAnswer } from "../riddles/stack";

const SHAKE = { x: [0, -6, 6, -4, 4, 0] };

type StackBugContextValue = {
  open: boolean;
  wrong: { tech: string; count: number } | null;
  guess: (tech: string) => void;
};

const StackBugContext = createContext<StackBugContextValue | null>(null);

/** Bug 2: the stack loader is stuck until the visitor taps the riddle's answer. */
const StackBug = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("debug.stack");
  const { fixed, fix } = useBug("stack");
  const [wrong, setWrong] = useState<StackBugContextValue["wrong"]>(null);

  const guess = (tech: string) => {
    if (isStackAnswer(tech)) {
      setWrong(null);
      fix();
      return;
    }
    setWrong((previous) => ({ tech, count: (previous?.count ?? 0) + 1 }));
  };

  return (
    <div>
      <BugNotice
        fixed={fixed}
        riddle={t("riddle")}
        hints={[t("hint1"), t("hint2")]}
        fixedText={t("loaded")}
      >
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm font-bold">{t("loading")}</p>
          <div
            aria-hidden="true"
            className="h-5 overflow-hidden rounded-full border-3 border-ink bg-white"
          >
            <div className="hazard-tape h-full w-2/3 border-r-3 border-ink [background-size:40px_40px] motion-safe:animate-stripes" />
          </div>
          {wrong && (
            <p
              role="alert"
              className="w-fit rounded-btn border-2 border-ink bg-red px-3 py-1.5 font-mono text-sm font-bold"
            >
              {t("wrong", { tech: wrong.tech })}
            </p>
          )}
        </div>
      </BugNotice>

      <StackBugContext.Provider value={{ open: !fixed, wrong, guess }}>
        {children}
      </StackBugContext.Provider>
    </div>
  );
};

type StackChipProps = {
  tech: string;
  className: string;
};

/** A tech chip; while the bug is open it is a guess for the riddle. */
export const StackChip = ({ tech, className }: StackChipProps) => {
  const t = useTranslations("debug.stack");
  const context = useContext(StackBugContext);
  const reduceMotion = useReducedMotion();

  if (!context?.open) return <li className={className}>{tech}</li>;

  const { wrong, guess } = context;
  const isWrong = wrong?.tech === tech;
  const shaking = isWrong && !reduceMotion;

  return (
    <li>
      <motion.button
        key={shaking ? wrong.count : 0}
        type="button"
        onClick={() => guess(tech)}
        aria-label={t("guess", { tech })}
        animate={shaking ? SHAKE : undefined}
        transition={{ duration: 0.35 }}
        className={`${className} cursor-pointer transition-colors hover:bg-yellow active:translate-x-0.5 active:translate-y-0.5 ${isWrong ? "!bg-red" : ""}`}
      >
        {tech}
      </motion.button>
    </li>
  );
};

export default StackBug;
