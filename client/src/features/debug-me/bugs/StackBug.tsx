"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBug } from "../useDebugMe";
import BugNotice from "../components/BugNotice";
import { SpinnerIcon } from "@/components/pr/Icons";
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
          <p className="flex items-center gap-2 font-mono text-sm text-attention">
            <SpinnerIcon />
            {t("loading")}
          </p>
          {wrong && (
            <p
              role="alert"
              className="w-fit rounded-box border border-danger/50 bg-danger/10 px-3 py-1.5 font-mono text-sm text-danger"
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
  /** 1-based line number in the diff. */
  line: number;
};

const lineClassName =
  "grid w-full grid-cols-[3rem_1.5rem_1fr] items-center bg-diff-add font-mono text-[13px] leading-7 text-left";

const LineContent = ({ tech, line }: StackChipProps) => (
  <>
    <span aria-hidden="true" className="select-none border-r border-line/60 bg-diff-add-line pr-2 text-right text-muted">
      {line}
    </span>
    <span aria-hidden="true" className="select-none text-center text-accent">+</span>
    <span>
      <span className="text-link">&quot;{tech}&quot;</span>
      <span className="text-muted">,</span>
    </span>
  </>
);

/** An added diff line; while the bug is open it is a guess for the riddle. */
export const StackChip = ({ tech, line }: StackChipProps) => {
  const t = useTranslations("debug.stack");
  const context = useContext(StackBugContext);
  const reduceMotion = useReducedMotion();

  if (!context?.open) {
    return (
      <li className={lineClassName}>
        <LineContent tech={tech} line={line} />
      </li>
    );
  }

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
        className={`${lineClassName} cursor-pointer transition-colors hover:brightness-125 ${isWrong ? "!bg-danger/25" : ""}`}
      >
        <LineContent tech={tech} line={line} />
      </motion.button>
    </li>
  );
};

export default StackBug;
