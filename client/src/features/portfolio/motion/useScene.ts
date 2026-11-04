"use client";

import { useEffect, useRef } from "react";

const DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const PHONE = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

export type SceneTools = typeof import("./gsap");

/**
 * Runs a scene's animations against a root element and undoes them all on
 * unmount. GSAP loads after the page, since the content reads fine without it:
 * if it never arrives, the sections fall back to normal flow. With reduced
 * motion nothing runs, so the content stays in its final state. Pass a function
 * defined outside the component, so it stays stable; it may return its own
 * cleanup for anything GSAP does not track.
 */
export const useScene = <T extends HTMLElement>(
  build: (root: T, phone: boolean, tools: SceneTools) => void | (() => void),
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cancelled = false;
    let revert: (() => void) | undefined;
    import("./gsap")
      .then((tools) => {
        if (cancelled) return;
        const media = tools.gsap.matchMedia(root);
        media.add({ desktop: DESKTOP, phone: PHONE }, (context) =>
          build(root, Boolean(context.conditions?.phone), tools),
        );
        revert = () => media.revert();
      })
      .catch(() => document.documentElement.classList.remove("motion"));
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [build]);

  return ref;
};
