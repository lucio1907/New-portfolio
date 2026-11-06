import type { SceneTools } from "./useScene";

type Gsap = SceneTools["gsap"];

type RiseOptions = { trigger?: Element | null; start?: string; end?: string };

/** The lines of a section's title rise out of their masks, tied to the scroll. */
export const riseLines = (gsap: Gsap, root: HTMLElement, options: RiseOptions = {}) => {
  const { trigger = root.querySelector("h2"), start = "top 92%", end = "top 58%" } = options;
  gsap.fromTo(
    root.querySelectorAll("[data-rise]"),
    { yPercent: 108 },
    { yPercent: 0, ease: "none", stagger: 0.22, scrollTrigger: { trigger, start, end, scrub: 0.4 } },
  );
};

/**
 * Content arrives once, on its own time, when it reaches the screen. It animates
 * opacity rather than visibility so links stay reachable by keyboard, and hands
 * the styles back to CSS when done, so hover states and resting opacity still apply.
 */
export const revealOnce = (
  gsap: Gsap,
  targets: gsap.TweenTarget,
  trigger: Element | null,
  start = "top 88%",
  offset: { x?: number; y?: number } = { y: 22 },
) => {
  gsap.from(targets, {
    opacity: 0,
    ...offset,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.07,
    clearProps: "transform,opacity",
    scrollTrigger: { trigger, start, once: true },
  });
};

/** Effects that follow the cursor need a real cursor. */
export const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
