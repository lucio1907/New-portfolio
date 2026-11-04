"use client";

import React from "react";
import { type SceneTools, useScene } from "./useScene";

/** How much scroll it takes the name to land in the nav, in viewport heights. */
const LANDING = 0.75;

/**
 * On desktop the huge name shrinks into the nav as the page scrolls, tied to
 * the scrollbar. On phones it scrolls away normally: JavaScript transforms
 * against native touch scrolling would shake. The nav's own copy of the name
 * takes over the moment the big one is gone.
 */
const build = (root: HTMLElement, phone: boolean, { gsap }: SceneTools) => {
  const name = root.querySelector<HTMLElement>("[data-hero-name]");
  const rest = root.querySelector<HTMLElement>("[data-hero-rest]");
  const navName = document.querySelector<HTMLElement>("[data-nav-name]");
  if (!name || !rest || !navName) return;

  const show = (landed: boolean) => {
    navName.style.opacity = landed ? "1" : "0";
    if (!phone) name.style.visibility = landed ? "hidden" : "visible";
  };

  if (phone) {
    const observer = new IntersectionObserver(([entry]) => show(!entry.isIntersecting), {
      rootMargin: "-56px 0px 0px 0px",
    });
    observer.observe(name);
    return () => observer.disconnect();
  }

  const distance = () => window.innerHeight * LANDING;
  const box = () => name.getBoundingClientRect();
  const target = () => navName.getBoundingClientRect();

  gsap.to(name, {
    x: () => target().left - box().left,
    y: () => target().top - (box().top + window.scrollY) + distance(),
    scale: () => target().width / name.offsetWidth,
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: distance,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => show(self.progress >= 1),
      onRefresh: (self) => show(self.progress >= 1),
    },
  });

  gsap.to(rest, {
    autoAlpha: 0,
    y: -24,
    ease: "none",
    scrollTrigger: { start: 0, end: () => distance() * 0.45, scrub: true },
  });
};

const HeroScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} id="top" className="hero">
      {children}
    </section>
  );
};

export default HeroScene;
