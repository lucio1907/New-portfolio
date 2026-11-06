"use client";

import React from "react";
import { riseLines } from "./moves";
import { type SceneTools, useScene } from "./useScene";

/** The title rises. Each rule draws itself, its label fades in and its value prints from left to right. */
const build = (root: HTMLElement, _phone: boolean, { gsap }: SceneTools) => {
  riseLines(gsap, root);
  gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".sheet-row")).forEach((row) => {
    const trigger = { trigger: row, start: "top 94%", end: "top 66%", scrub: 0.4 };
    gsap.fromTo(row.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: trigger });
    gsap.fromTo(row.querySelector("dt"), { opacity: 0, x: -12 }, { opacity: 1, x: 0, ease: "none", scrollTrigger: trigger });
    gsap.fromTo(
      row.querySelector("[data-value]"),
      { clipPath: "inset(-5% 100% -5% 0%)" },
      { clipPath: "inset(-5% 0% -5% 0%)", ease: "none", scrollTrigger: trigger },
    );
  });
};

const SheetScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} className="sheet">
      {children}
    </section>
  );
};

export default SheetScene;
