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

/**
 * True once the page is idle and the device can and should render 3D:
 * WebGL available and the visitor has not asked to save data.
 */
export const useCanRender3D = (): boolean => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (connection?.saveData || !supportsWebGL()) return;

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return ready;
};
