"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** The system's layers slide in from alternating sides and stack up. */
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

  const layers = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-layer]"));
  const distance = phone ? 55 : 75;
  layers.forEach((layer, index) => {
    gsap.fromTo(
      layer,
      { xPercent: index % 2 ? distance : -distance },
      {
        xPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: root.querySelector(".layers"), start: `top ${88 - index * 6}%`, end: `top ${44 - index * 6}%`, scrub: 0.4 },
      },
    );
  });
};

const CrmScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} className="chapter">
      {children}
    </section>
  );
};

export default CrmScene;
