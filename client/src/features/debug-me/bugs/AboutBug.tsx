"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBug } from "../useDebugMe";
import BugNotice from "../components/BugNotice";
import {
  type AnagramState,
  createAnagram,
  pickLetter,
  progressOf,
} from "../riddles/anagram";

const NAME = "LUCIO";
const SHAKE = { x: [0, -6, 6, -4, 4, 0] };

const tileClassName =
  "flex h-12 w-12 items-center justify-center rounded-btn border-3 border-ink font-mono text-xl font-bold shadow-brutal-sm";

/** Bug 1: the deploy scrambled my name; rebuild it by tapping the letters in order. */
const AboutBug = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("debug.about");
  const { fixed, fix } = useBug("about");
  const reduceMotion = useReducedMotion();
  const [anagram, setAnagram] = useState<AnagramState>(() => createAnagram(NAME));
  const [wrongTile, setWrongTile] = useState<{ index: number; count: number } | null>(null);

  const pick = (index: number) => {
    const result = pickLetter(anagram, index);
    if (result.outcome === "wrong") {
      setWrongTile((previous) => ({ index, count: (previous?.count ?? 0) + 1 }));
      return;
    }
    setWrongTile(null);
    setAnagram(result.state);
    if (result.outcome === "solved") fix();
  };

  const progress = progressOf(anagram);

  return (
    <div>
      <BugNotice
        fixed={fixed}
        riddle={t("riddle")}
        hints={[t("hint1"), t("hint2")]}
        fixedText={t("solved")}
      >
        <div className="flex flex-wrap items-center gap-4">
          <p
            role="status"
            aria-label={t("progress", { value: progress || "—" })}
            className="flex gap-1.5"
          >
            {[...NAME].map((_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className={`${tileClassName} ${progress[index] ? "bg-green" : "border-dashed bg-paper shadow-none"}`}
              >
                {progress[index] ?? ""}
              </span>
            ))}
          </p>
          <div className="flex gap-1.5">
            {anagram.tiles.map((letter, index) => {
              const used = anagram.used.includes(index);
              const wrong = wrongTile?.index === index;
              const shaking = wrong && !reduceMotion;
              return (
                <motion.button
                  key={`${index}-${shaking ? wrongTile?.count : 0}`}
                  type="button"
                  disabled={used}
                  onClick={() => pick(index)}
                  aria-label={t("letter", { letter })}
                  animate={shaking ? SHAKE : undefined}
                  transition={{ duration: 0.35 }}
                  className={`${tileClassName} cursor-pointer ${wrong ? "bg-red" : "bg-yellow"} transition-colors hover:bg-pink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-25`}
                >
                  {letter}
                </motion.button>
              );
            })}
          </div>
        </div>
      </BugNotice>

      <Image
        src="/MeMemoji.webp"
        alt="Lucio Gastellu"
        width={112}
        height={112}
        priority={false}
        className="mb-8 h-28 w-28 rounded-full border-3 border-ink bg-yellow object-cover shadow-brutal-sm"
      />

      <div className={fixed ? undefined : "motion-safe:animate-glitch"}>
        {children}
      </div>
    </div>
  );
};

export default AboutBug;
