"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

const NAV = "top 56px";
/** Fully inside the slot, torn edge included. */
const UNPRINTED = -112;

/** The largest the headline may start at. */
const TITLE_SCALE = 1.9;

/**
 * Desktop: the cobalt panel opens up and the headline fills the screen. The
 * stage stays stuck (CSS sticky, so scrolling stays native) while the headline
 * steps back, the real screen rises as the proof, and the receipt comes out from
 * under the nav listing the work. Phone: no stuck stage, the receipt just prints
 * as it crosses the screen.
 */
const build = (root: HTMLElement, phone: boolean, { gsap }: SceneTools) => {
  const receipt = root.querySelector("[data-receipt]");
  const title = root.querySelector<HTMLElement>("[data-pos-title]");
  const lines = root.querySelectorAll("[data-pos-line]");
  if (!title) return;

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

  // As big as fits: the receipt is not on screen yet, so it can use the full width.
  const startScale = () => Math.min(TITLE_SCALE, (root.clientWidth * 0.92) / title.offsetWidth);

  gsap
    .timeline({ scrollTrigger: { trigger: root, start: NAV, end: "bottom bottom", scrub: 0.5, invalidateOnRefresh: true } })
    .from(lines[0], { autoAlpha: 0, y: 48, duration: 0.08, ease: "power2.out" }, 0)
    .from(lines[1], { autoAlpha: 0, y: 48, duration: 0.08, ease: "power2.out" }, 0.07)
    .fromTo(title, { scale: startScale, y: () => window.innerHeight * 0.2 }, { scale: 1, y: 0, duration: 0.2, ease: "power2.inOut" }, 0.2)
    .from(root.querySelector("[data-pos-body]"), { autoAlpha: 0, duration: 0.08, ease: "none" }, 0.34)
    .from(root.querySelector("[data-pos-shot]"), { autoAlpha: 0, yPercent: 30, duration: 0.2, ease: "power2.out" }, 0.24)
    .fromTo(receipt, { yPercent: UNPRINTED }, { yPercent: 0, duration: 0.4, ease: "none" }, 0.46)
    .to({}, { duration: 0.14 }, 0.86);
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
