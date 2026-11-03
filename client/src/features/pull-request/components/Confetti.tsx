"use client";

import React, { useEffect, useRef } from "react";

const COLORS = ["#3FB950", "#A371F7", "#4493F8", "#D29922", "#F85149", "#E6EDF3"];
const PARTICLES = 140;
const DURATION_MS = 2600;
const GRAVITY = 0.18;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const burst = (canvas: HTMLCanvasElement): (() => void) => {
  const context = canvas.getContext("2d");
  if (!context || prefersReducedMotion()) return () => {};

  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.scale(ratio, ratio);

  const particles: Particle[] = Array.from({ length: PARTICLES }, (_, i) => {
    const fromLeft = i % 2 === 0;
    return {
      x: fromLeft ? 0 : width,
      y: height * 0.7,
      vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 8),
      vy: -(8 + Math.random() * 9),
      size: 5 + Math.random() * 6,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      color: COLORS[i % COLORS.length],
    };
  });

  const startedAt = performance.now();
  let frame = 0;

  const draw = (now: number) => {
    const elapsed = now - startedAt;
    context.clearRect(0, 0, width, height);
    if (elapsed > DURATION_MS) return;

    context.globalAlpha = Math.max(0, 1 - elapsed / DURATION_MS);
    for (const p of particles) {
      p.vy += GRAVITY;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      context.save();
      context.translate(p.x, p.y);
      context.rotate(p.rotation);
      context.fillStyle = p.color;
      context.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      context.restore();
    }
    frame = requestAnimationFrame(draw);
  };

  frame = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(frame);
};

/** Full-screen confetti; fires every time `shot` increases past 0. */
const Confetti = ({ shot }: { shot: number }): React.ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (shot === 0 || !canvasRef.current) return;
    return burst(canvasRef.current);
  }, [shot]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
    />
  );
};

export default Confetti;
