"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** Each statement comes forward as it reaches the middle of the screen. */
const build = (root: HTMLElement, _phone: boolean, { gsap }: SceneTools) => {
  gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-line]")).forEach((line) => {
    gsap.fromTo(
      line,
      { opacity: 0.14, x: -28 },
      { opacity: 1, x: 0, ease: "none", scrollTrigger: { trigger: line, start: "top 88%", end: "top 58%", scrub: 0.4 } },
    );
  });
};

const HowScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} className="how">
      {children}
    </section>
  );
};

export default HowScene;
