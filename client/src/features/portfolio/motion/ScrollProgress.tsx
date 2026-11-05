"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** A thin line along the nav's edge that fills up as the page is read. */
const build = (root: HTMLElement, _phone: boolean, { gsap }: SceneTools) => {
  gsap.fromTo(root, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
};

const ScrollProgress = () => {
  const ref = useScene<HTMLElement>(build);
  return <span ref={ref} aria-hidden="true" className="scroll-progress" />;
};

export default ScrollProgress;
