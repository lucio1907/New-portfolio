"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import BugIcon from "./BugIcon";
import { revealedHints } from "../riddles/hints";

type BugNoticeProps = {
  fixed: boolean;
  /** The riddle: tells the visitor, playfully, what to do with the section. */
  riddle: string;
  /** Increasingly direct hints, revealed over time while the bug stays open. */
  hints: readonly string[];
  fixedText: string;
  children?: React.ReactNode;
};

const TICK_MS = 1_000;

/** Counts hints revealed since the notice first came into view. */
const useRevealedHints = (
  ref: React.RefObject<HTMLElement | null>,
  hintCount: number,
  active: boolean,
): number => {
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [revealed, setRevealed] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!inView || !active || revealed >= hintCount) return;
    startedAt.current ??= Date.now();
    const start = startedAt.current;
    const timer = setInterval(() => {
      const next = revealedHints(Date.now() - start, hintCount);
      if (next > revealed) setRevealed(next);
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [inView, active, revealed, hintCount]);

  return revealed;
};

/** Sticky-note riddle shown at the top of a "broken" section. */
const BugNotice = ({
  fixed,
  riddle,
  hints,
  fixedText,
  children,
}: BugNoticeProps): React.ReactElement => {
  const t = useTranslations("debug.riddle");
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useRevealedHints(ref, hints.length, !fixed);

  if (fixed) {
    return <p className="brutal-chip mb-8 bg-green font-mono">✓ {fixedText}</p>;
  }

  return (
    <div
      ref={ref}
      className="mb-8 flex flex-col gap-3 rounded-card border-3 border-ink bg-white p-4 shadow-brutal-sm"
    >
      <p className="flex items-start gap-2.5">
        <BugIcon className="h-8 w-8 shrink-0 text-red motion-safe:animate-wiggle" />
        <span className="flex flex-col gap-1">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">
            {t("label")}
          </span>
          <span className="text-[17px] font-bold leading-snug">{riddle}</span>
        </span>
      </p>

      <ul aria-live="polite" className="flex flex-col gap-2 empty:hidden">
        <AnimatePresence initial={false}>
          {hints.slice(0, revealed).map((hint, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-fit rounded-btn border-2 border-ink bg-yellow px-3 py-1.5 font-mono text-sm font-bold"
            >
              <span aria-hidden="true">💡 </span>
              {t("hint", { n: index + 1 })} {hint}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {children}
    </div>
  );
};

export default BugNotice;
