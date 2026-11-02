"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(pointer: fine)";

const subscribe = (onChange: () => void): (() => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

/**
 * True on mouse/trackpad devices. Dragging is only offered there so touch
 * users keep native scrolling; they fix bugs with the button alternatives.
 */
export const useFinePointer = (): boolean =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
