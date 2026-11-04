"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/**
 * The headline rises line by line, then the full-width screenshot shrinks into
 * place as it crosses the screen. It scales rather than crops, so the site's
 * logo and nav at its edges stay in the picture.
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
  gsap.fromTo(
    frame,
    { scale: 1 },
    {
      scale: phone ? 0.9 : 0.84,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top 72%", end: "top 16%", scrub: true },
    },
  );
  if (phone) return;
  gsap.fromTo(
    root.querySelector("[data-picture]"),
    { scale: 1.08 },
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
