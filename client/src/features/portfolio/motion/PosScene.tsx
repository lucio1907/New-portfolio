"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

const NAV = "top 56px";
/** Fully inside the slot, torn edge included. */
const UNPRINTED = -112;

/**
 * Desktop: the cobalt panel opens up to fill the screen, then the stage stays
 * stuck (CSS sticky, so scrolling stays native) while the receipt comes out
 * from under the nav and the headline completes. Phone: no stuck stage, the
 * receipt just prints as it crosses the screen.
 */
const build = (root: HTMLElement, phone: boolean, { gsap }: SceneTools) => {
  const receipt = root.querySelector("[data-receipt]");
  const lines = root.querySelectorAll("[data-pos-line]");

  if (phone) {
    gsap.fromTo(
      receipt,
      { yPercent: UNPRINTED },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: root.querySelector(".receipt-slot"), start: "top 88%", end: "top 30%", scrub: 0.4 },
      },
    );
    return;
  }

  gsap.fromTo(
    root.querySelector("[data-pos-bg]"),
    { clipPath: "inset(14% 8% 14% 8% round 32px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 0px)",
      ease: "none",
      scrollTrigger: { trigger: root, start: "top 92%", end: NAV, scrub: true },
    },
  );

  gsap
    .timeline({ scrollTrigger: { trigger: root, start: NAV, end: "bottom bottom", scrub: 0.5 } })
    .from(lines[0], { autoAlpha: 0, y: 48, duration: 0.14, ease: "power2.out" }, 0)
    .fromTo(receipt, { yPercent: UNPRINTED }, { yPercent: 0, duration: 0.6, ease: "none" }, 0.08)
    .from(lines[1], { autoAlpha: 0, y: 48, duration: 0.14, ease: "power2.out" }, 0.5)
    .from(root.querySelector("[data-pos-body]"), { autoAlpha: 0, y: 24, duration: 0.12, ease: "power2.out" }, 0.62)
    .to({}, { duration: 0.2 }, 0.8);
};

const PosScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} id="work" className="pos-track">
      {children}
    </section>
  );
};

export default PosScene;
