"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/**
 * The headline rises line by line, then the full-width screenshot settles into
 * a framed picture as it crosses the screen, with its image easing out behind.
 */
const build = (root: HTMLElement, phone: boolean, { gsap }: SceneTools) => {
  gsap.fromTo(
    root.querySelectorAll("[data-rise]"),
    { yPercent: 108 },
    {
      yPercent: 0,
      ease: "none",
      stagger: 0.22,
      scrollTrigger: { trigger: root.querySelector(".chapter-title"), start: "top 92%", end: "top 58%", scrub: 0.4 },
    },
  );

  const frame = root.querySelector("[data-frame]");
  const inset = phone ? "inset(0% 5% 0% 5% round 12px)" : "inset(0% 8% 0% 8% round 20px)";
  gsap.fromTo(
    frame,
    { clipPath: "inset(0% 0% 0% 0% round 0px)" },
    {
      clipPath: inset,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top 72%", end: "top 16%", scrub: true },
    },
  );
  if (phone) return;
  gsap.fromTo(
    root.querySelector("[data-picture]"),
    { scale: 1.16 },
    {
      scale: 1,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top bottom", end: "top 16%", scrub: true },
    },
  );
};

const ChapterScene = ({ offset, children }: { offset: boolean; children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} className={offset ? "chapter chapter-offset" : "chapter"}>
      {children}
    </section>
  );
};

export default ChapterScene;
