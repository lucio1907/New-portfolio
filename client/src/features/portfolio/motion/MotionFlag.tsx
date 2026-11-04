"use client";

import { useLayoutEffect } from "react";
import { useLocale } from "next-intl";

/**
 * Switching language replaces the document without running the inline script in
 * the layout again, which would drop the flag and, with it, the scroll tracks.
 */
const MotionFlag = () => {
  const locale = useLocale();

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      document.documentElement.classList.add("motion");
    }
  }, [locale]);

  return null;
};

export default MotionFlag;
