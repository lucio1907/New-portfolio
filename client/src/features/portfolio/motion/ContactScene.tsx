"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** The last screen rises from below the previous one, a little slower. */
const build = (root: HTMLElement, _phone: boolean, { gsap }: SceneTools) => {
  gsap.fromTo(
    root.querySelector("[data-contact]"),
    { yPercent: -22 },
    {
      yPercent: 0,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true },
    },
  );
};

const ContactScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} id="contact" className="contact">
      {children}
    </section>
  );
};

export default ContactScene;
