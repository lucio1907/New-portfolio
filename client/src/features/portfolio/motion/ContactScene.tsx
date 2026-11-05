"use client";

import React from "react";
import { hasFinePointer, revealOnce, riseLines } from "./moves";
import { type SceneTools, useScene } from "./useScene";

/** How far a button follows the cursor, as a share of the cursor's distance from its center. */
const PULL = 0.28;

/**
 * The last screen rises from below the previous one, a little slower, and its
 * content arrives in order. The content moves with that rise, so every trigger
 * here measures the section itself. The buttons lean toward the cursor.
 */
const build = (root: HTMLElement, phone: boolean, { gsap }: SceneTools) => {
  gsap.fromTo(
    root.querySelector("[data-contact]"),
    { yPercent: -22 },
    {
      yPercent: 0,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true },
    },
  );
  riseLines(gsap, root, { trigger: root, start: "top 70%", end: "top 25%" });
  revealOnce(gsap, root.querySelectorAll(".contact-lead, .contact-email, .contact-actions, .contact-links > p"), root, "top 45%");

  if (phone || !hasFinePointer()) return;

  const offs = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".action")).map((button) => {
    const moveX = gsap.quickTo(button, "x", { duration: 0.5, ease: "power3" });
    const moveY = gsap.quickTo(button, "y", { duration: 0.5, ease: "power3" });
    const onMove = (event: PointerEvent) => {
      const box = button.getBoundingClientRect();
      moveX((event.clientX - box.left - box.width / 2) * PULL);
      moveY((event.clientY - box.top - box.height / 2) * PULL);
    };
    const onLeave = () => {
      moveX(0);
      moveY(0);
    };
    button.addEventListener("pointermove", onMove);
    button.addEventListener("pointerleave", onLeave);
    return () => {
      button.removeEventListener("pointermove", onMove);
      button.removeEventListener("pointerleave", onLeave);
    };
  });

  return () => offs.forEach((off) => off());
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
