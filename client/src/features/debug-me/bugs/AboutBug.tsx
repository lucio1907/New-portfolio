"use client";

import React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBug } from "../useDebugMe";
import BugNotice from "../components/BugNotice";
import BugIcon from "../components/BugIcon";

// Path the bug walks around the photo (px offsets inside a 112px frame).
const CRAWL_X = [4, 64, 70, 30, 0, 4];
const CRAWL_Y = [0, 6, 60, 70, 38, 0];
const CRAWL_ROTATE = [80, 120, 200, 250, 340, 440];

/** Bug 1: a bug crawls over the photo; catching it stabilizes the bio. */
const AboutBug = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("debug.about");
  const { fixed, fix } = useBug("about");
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <BugNotice fixed={fixed} hint={t("hint")} fixedText={t("caught")} />

      <div className="relative mb-8 h-28 w-28">
        <Image
          src="/MeMemoji.webp"
          alt="Lucio Gastellu"
          width={112}
          height={112}
          priority={false}
          className="h-28 w-28 rounded-full border border-border bg-surface-2 object-cover"
        />
        <AnimatePresence>
          {!fixed && (
            <motion.button
              type="button"
              onClick={fix}
              aria-label={t("catch")}
              title={t("catch")}
              initial={{ opacity: 1, scale: 1 }}
              animate={
                reduceMotion
                  ? { x: 64, y: 6, rotate: 120 }
                  : { x: CRAWL_X, y: CRAWL_Y, rotate: CRAWL_ROTATE }
              }
              exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.25 } }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 9, repeat: Infinity, ease: "linear" }
              }
              className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
            >
              <BugIcon className="h-6 w-6 drop-shadow-[0_0_6px_rgba(255,107,107,0.6)]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className={fixed ? undefined : "motion-safe:animate-glitch"}>
        {children}
      </div>
    </div>
  );
};

export default AboutBug;
