"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** Each rule draws itself and its value prints from left to right. */
const build = (root: HTMLElement, _phone: boolean, { gsap }: SceneTools) => {
  gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".sheet-row")).forEach((row) => {
    const trigger = { trigger: row, start: "top 94%", end: "top 66%", scrub: 0.4 };
    gsap.fromTo(row.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: trigger });
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
