"use client";

import React from "react";
import { revealOnce, riseLines } from "./moves";
import { type SceneTools, useScene } from "./useScene";

/**
 * The headline rises line by line, then the screenshot lifts from a slight tilt
 * and grows into place as it crosses the screen. It ends at its natural size, so
 * nothing leaves empty space around it, and the site's logo and nav at its edges
 * stay in the picture.
 */
const build = (root: HTMLElement, phone: boolean, { gsap }: SceneTools) => {
  riseLines(gsap, root);
  revealOnce(gsap, root.querySelectorAll(".chapter-foot > *"), root.querySelector(".chapter-foot"));

  // On the parent, not the frame: a perspective of its own would keep the frame
  // on a 3D layer after the scene ends, and that layer blurs the screenshot.
  if (!phone) gsap.set(root, { perspective: 1400 });

  const frame = root.querySelector("[data-frame]");
  gsap.fromTo(
    frame,
    { scale: phone ? 0.93 : 0.84, rotateX: phone ? 0 : 9, transformOrigin: "50% 100%" },
    {
      scale: 1,
      rotateX: 0,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top 96%", end: "top 36%", scrub: true },
    },
  );
  if (phone) return;
  gsap.fromTo(
    root.querySelector("[data-picture]"),
    { scale: 1.16 },
    {
      scale: 1,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top bottom", end: "top 24%", scrub: true },
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
