"use client";

import React from "react";
import { countAt } from "../lib/motion";
import { revealOnce } from "./moves";
import { type SceneTools, useScene } from "./useScene";

const TARGET = 35;

/** The number counts up with the scroll and slides into place. */
const build = (root: HTMLElement, _phone: boolean, { gsap }: SceneTools) => {
  const count = root.querySelector("[data-count]");
  if (!count) return;
  const show = (progress: number) => {
    count.textContent = String(countAt(TARGET, progress));
  };
  show(0);
  revealOnce(gsap, root.querySelector(".number-text"), root, "top 60%");
  gsap.fromTo(
    root.querySelector(".number-value"),
    { xPercent: -14 },
    {
      xPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top 78%",
        end: "top 12%",
        scrub: 0.3,
        onUpdate: (self) => show(self.progress),
        onRefresh: (self) => show(self.progress),
      },
    },
  );
  return () => show(1);
};

const NumberScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} className="number">
      {children}
    </section>
  );
};

export default NumberScene;
