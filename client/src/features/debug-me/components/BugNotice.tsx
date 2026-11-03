"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import BugIcon from "./BugIcon";
import { CheckIcon, LightbulbIcon } from "@/components/pr/Icons";
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

/** Bot avatar: a fixed light disc keeps the mascot's ink outlines readable. */
export const BotAvatar = ({ size = "h-8 w-8" }: { size?: string }) => (
  <span
    aria-hidden="true"
    className={`flex ${size} shrink-0 items-center justify-center rounded-full border border-line bg-[#FFE7A3]`}
  >
    <BugIcon className="h-[70%] w-[70%] text-danger" />
  </span>
);

/** Review thread from the deploy bot: the riddle, then hints as replies. */
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
    return (
      <p className="mb-5 flex items-center gap-2 rounded-box border border-accent/40 bg-accent/10 px-3 py-2 text-sm">
        <CheckIcon className="h-4 w-4 text-accent" />
        <span className="font-semibold">{t("bot")}</span>
        <span className="text-muted">{t("resolved")}</span>
        <span className="font-medium">{fixedText}</span>
      </p>
    );
  }

  return (
    <div ref={ref} className="box mb-5 overflow-hidden border-danger/50">
      <div className="box-header border-danger/30 bg-danger/10">
        <BotAvatar size="h-6 w-6" />
        <span className="font-semibold">{t("bot")}</span>
        <span className="text-muted">{t("requested")}</span>
        <span className="label-chip ml-auto border-danger/50 text-danger">
          {t("label")}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <p className="text-[16px] font-medium leading-relaxed">{riddle}</p>
        {children}
      </div>

      <ul aria-live="polite" className="empty:hidden">
        <AnimatePresence initial={false}>
          {hints.slice(0, revealed).map((hint, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-3 border-t border-line bg-subtle/60 px-4 py-3 text-sm"
            >
              <LightbulbIcon className="mt-0.5 h-4 w-4 text-attention" />
              <span>
                <span className="mr-1.5 font-semibold">
                  {t("hint", { n: index + 1 })}
                </span>
                <span className="font-mono text-[13px]">{hint}</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default BugNotice;
