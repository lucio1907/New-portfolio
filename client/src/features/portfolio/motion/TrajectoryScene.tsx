"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** Roles other than the one in front stay this visible. */
const RESTING = 0.2;

/**
 * A dark panel opens up as this section arrives. On desktop the date stays stuck
 * (CSS sticky) and rolls like an odometer while each role comes into focus.
 */
const build = (root: HTMLElement, phone: boolean, { gsap }: SceneTools) => {
  gsap.fromTo(
    root.querySelector("[data-panel]"),
    { clipPath: "inset(0% 2.5% 0% 2.5% round 32px 32px 0px 0px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
      ease: "none",
      scrollTrigger: { trigger: root, start: "top 90%", end: "top 30%", scrub: true },
    },
  );
  if (phone) return;

  const roles = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-role]"));
  roles.forEach((role, index) => {
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: role, start: "top 78%", end: "bottom 22%", scrub: 0.3 },
    });
    timeline.fromTo(role, { opacity: RESTING }, { opacity: 1, duration: 0.3, ease: "none" });
    timeline.to({}, { duration: 0.4 });
    if (index < roles.length - 1) timeline.to(role, { opacity: RESTING, duration: 0.3, ease: "none" });
  });

  const rail = root.querySelector("[data-rail]");
  const rolling = gsap.timeline({
    scrollTrigger: { trigger: root.querySelector(".trajectory-body"), start: "top top", end: "bottom bottom", scrub: 0.4 },
  });
  roles.slice(1).forEach((_, index) => {
    rolling.to({}, { duration: 0.6 });
    rolling.to(rail, { yPercent: (-100 * (index + 1)) / roles.length, duration: 0.4, ease: "power2.inOut" });
  });
  rolling.to({}, { duration: 0.6 });
};

const TrajectoryScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} id="trajectory" className="trajectory">
      {children}
    </section>
  );
};

export default TrajectoryScene;
