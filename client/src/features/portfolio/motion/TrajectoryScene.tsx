"use client";

import React from "react";
import { type RoadSample, lengthAtY, reachedStops, roadPath, roadStops, roadWaypoints } from "../lib/motion";
import { revealOnce, riseLines } from "./moves";
import { type SceneTools, useScene } from "./useScene";

/** Roles other than the one in front stay this visible. */
const RESTING = 0.2;

/** The height of the screen, in percent, where the road is being made. */
const HEAD_LINE = 58;

/** Points measured along the road, to turn a height into a length without searching the path each frame. */
const SAMPLES = 480;

/** How far a role and its date travel as they arrive from their side, in pixels. */
const ARRIVAL = { desktop: 56, phone: 28 };

/** On phones the road runs along the edges of the text, this far in. */
const PHONE_INSET = 12;

/** The element's distance from the top of an ancestor, ignoring any transform in progress. */
const topWithin = (element: HTMLElement, ancestor: HTMLElement) => {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current && current !== ancestor) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
};

/**
 * A dark panel opens up as this section arrives, then a road is made along the
 * career, always at the same height of the screen. Reaching a role lights its
 * stop and brings it in from its side: the first on the right, the next on the
 * left, and so on, with the date across the road on desktop and on top of the
 * role on phones. On desktop the role in front also comes into focus.
 */
const build = (root: HTMLElement, phone: boolean, { gsap, ScrollTrigger }: SceneTools) => {
  const roles = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-role]"));
  const anchors = roles.map((role) => role.querySelector<HTMLElement>(".role-date"));
  const distance = phone ? ARRIVAL.phone : ARRIVAL.desktop;

  riseLines(gsap, root);
  roles.forEach((role, index) => {
    const side = index % 2 ? -1 : 1;
    // The stop sits at the date's center, so this is the moment the road reaches it.
    const start = `center ${HEAD_LINE}%`;
    revealOnce(gsap, role.querySelectorAll(".role-name, .role-place, .role-list > li"), anchors[index], start, { x: side * distance });
    revealOnce(gsap, anchors[index], anchors[index], start, { x: (phone ? side : -side) * distance });
  });

  gsap.fromTo(
    root.querySelector("[data-panel]"),
    { clipPath: "inset(0% 2.5% 0% 2.5% round 32px 32px 0px 0px)" },
    {
      clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)",
      ease: "none",
      scrollTrigger: { trigger: root, start: "top 90%", end: "top 30%", scrub: true },
    },
  );

  if (!phone) {
    roles.forEach((role, index) => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: role, start: "top 78%", end: "bottom 22%", scrub: 0.3 },
      });
      timeline.fromTo(role, { opacity: RESTING }, { opacity: 1, duration: 0.3, ease: "none" });
      timeline.to({}, { duration: 0.4 });
      if (index < roles.length - 1) timeline.to(role, { opacity: RESTING, duration: 0.3, ease: "none" });
    });
  }

  const list = root.querySelector<HTMLElement>("[data-road-list]");
  const road = root.querySelector<SVGSVGElement>("[data-road]");
  const track = root.querySelector<SVGPathElement>("[data-road-track]");
  const line = root.querySelector<SVGPathElement>("[data-road-line]");
  const head = root.querySelector<SVGGElement>("[data-road-head]");
  const stops = gsap.utils.toArray<SVGGElement>(root.querySelectorAll("[data-road-stop]"));
  if (!list || !road || !track || !line || !head) return;

  const made = { progress: 0 };
  let height = 0;
  let total = 0;
  let stopHeights: number[] = [];
  let samples: RoadSample[] = [];
  let reached = 0;

  const showReached = (count: number) => {
    if (count === reached) return;
    reached = count;
    stops.forEach((stop, index) => stop.classList.toggle("is-reached", index < count));
  };

  const render = () => {
    const y = made.progress * height;
    const length = lengthAtY(samples, y);
    const point = line.getPointAtLength(length);
    line.style.strokeDashoffset = String(total - length);
    head.setAttribute("transform", `translate(${point.x} ${point.y})`);
    showReached(reachedStops(stopHeights, y));
  };

  // Measured, not fixed: the roles' heights depend on the screen and the language.
  const layout = () => {
    const width = road.getBoundingClientRect().width;
    height = list.offsetHeight;
    stopHeights = anchors.map((anchor) => (anchor ? topWithin(anchor, list) + anchor.offsetHeight / 2 : 0));
    const stopPoints = phone ? roadStops(stopHeights, width, { inset: PHONE_INSET, startLeft: true }) : roadStops(stopHeights, width);
    // On phones the text fills the width, so the road only changes sides between roles.
    const gaps = roles.slice(1).map((_, index) => {
      const next = anchors[index + 1];
      return { from: topWithin(roles[index], list) + roles[index].offsetHeight, to: next ? topWithin(next, list) : 0 };
    });
    const points = phone ? roadWaypoints(stopPoints, gaps) : stopPoints;
    const path = roadPath([{ x: phone ? stopPoints[0].x : width / 2, y: 0 }, ...points]);
    track.setAttribute("d", path);
    line.setAttribute("d", path);
    total = line.getTotalLength();
    line.style.strokeDasharray = String(total);
    samples = Array.from({ length: SAMPLES + 1 }, (_, index) => {
      const length = (total * index) / SAMPLES;
      return { y: line.getPointAtLength(length).y, length };
    });
    stops.forEach((stop, index) => stop.setAttribute("transform", `translate(${stopPoints[index].x} ${stopPoints[index].y})`));
    render();
  };

  layout();
  ScrollTrigger.addEventListener("refresh", layout);

  gsap.to(made, {
    progress: 1,
    ease: "none",
    onUpdate: render,
    scrollTrigger: { trigger: list, start: `top ${HEAD_LINE}%`, end: `bottom ${HEAD_LINE}%`, scrub: 0.4 },
  });

  // GSAP only undoes its own tweens: the road's marks belong to this version of the scene.
  return () => {
    ScrollTrigger.removeEventListener("refresh", layout);
    stops.forEach((stop) => stop.classList.remove("is-reached"));
    line.style.strokeDasharray = "";
    line.style.strokeDashoffset = "";
  };
};

const TrajectoryScene = ({ children }: { children: React.ReactNode }) => {
  const ref = useScene<HTMLElement>(build);
  return (
    <section ref={ref} id="trajectory" className="trajectory">
      {children}
    </section>
  );
};

export default TrajectoryScene;
