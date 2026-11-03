"use client";

import { useEffect, useState } from "react";

type NetworkInformation = { saveData?: boolean };

const supportsWebGL = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

export type Render3DStatus = "pending" | "ready" | "unavailable";

/**
 * "ready" once the page is idle and the device can and should render 3D;
 * "unavailable" without WebGL, when the visitor saves data or prefers
 * reduced motion (the room is decorative: they go straight to the desktop).
 */
export const useRender3DStatus = (): Render3DStatus => {
  const [status, setStatus] = useState<Render3DStatus>("pending");

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (connection?.saveData || reducedMotion || !supportsWebGL()) {
      const timer = setTimeout(() => setStatus("unavailable"), 0);
      return () => clearTimeout(timer);
    }
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setStatus("ready"), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setStatus("ready"), 1200);
    return () => clearTimeout(timer);
  }, []);

  return status;
};
