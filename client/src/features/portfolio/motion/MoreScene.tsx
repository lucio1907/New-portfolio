"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** Rules draw themselves in. Hovering a row brings its picture to the cursor. */
const build = (root: HTMLElement, phone: boolean, { gsap }: SceneTools) => {
  gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-rule]")).forEach((rule) => {
    gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: rule, start: "top 96%", end: "top 62%", scrub: 0.4 } });
  });

  const preview = root.querySelector<HTMLElement>("[data-preview]");
  if (phone || !preview || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const followX = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3" });
  const followY = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3" });
  const onMove = (event: PointerEvent) => {
    followX(event.clientX + 24);
    followY(event.clientY - preview.offsetHeight / 2);
  };

  const rows = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-row]"));
  const offs = rows.map((row) => {
    const image = preview.querySelector(`[data-preview-image="${row.dataset.row}"]`);
    const enter = () => {
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      gsap.to(image, { opacity: 1, duration: 0.2, overwrite: true });
    };
    const leave = () => {
      gsap.to(preview, { autoAlpha: 0, scale: 0.94, duration: 0.25, ease: "power2.in", overwrite: "auto" });
      gsap.to(image, { opacity: 0, duration: 0.2, overwrite: true });
    };
    row.addEventListener("pointerenter", enter);
    row.addEventListener("pointerleave", leave);
    return () => {
      row.removeEventListener("pointerenter", enter);
      row.removeEventListener("pointerleave", leave);
    };
  });
  window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onMove);
    offs.forEach((off) => off());
  };
};

const MoreScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} className="more">
      {children}
    </section>
  );
};

export default MoreScene;
