"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "./gsap";

const DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const PHONE = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

/**
 * Runs a scene's animations against a root element and undoes them all on
 * unmount. With reduced motion nothing runs, so the content stays in its final
 * state. Pass a function defined outside the component, so it stays stable.
 */
export const useScene = <T extends HTMLElement>(build: (root: T, phone: boolean) => void) => {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia(root);
    media.add({ desktop: DESKTOP, phone: PHONE }, (context) => {
      build(root, Boolean(context.conditions?.phone));
    });
    return () => media.revert();
  }, [build]);

  return ref;
};
