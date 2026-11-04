"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** The paragraph lights up word by word as it crosses the screen. */
const build = (root: HTMLElement, _phone: boolean, { gsap }: SceneTools) => {
  gsap.fromTo(
    root.querySelectorAll("[data-word]"),
    { opacity: 0.13 },
    {
      opacity: 1,
      ease: "none",
      stagger: 0.12,
      scrollTrigger: { trigger: root, start: "top 72%", end: "bottom 78%", scrub: 0.4 },
    },
  );
};

const ManifestoScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} className="manifesto">
      {children}
    </section>
  );
};

export default ManifestoScene;
