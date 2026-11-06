/** Pure helpers behind the scroll-linked animations. */

/** The words of a text, each wrapped later on so it can light up on its own. */
export const splitWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);

export type Point = { x: number; y: number };
export type RoadSample = { y: number; length: number };

type RoadStopOptions = { inset?: number; startLeft?: boolean };

/** The road's stops: one per height, winding from side to side of its width. */
export const roadStops = (heights: number[], width: number, options: RoadStopOptions = {}): Point[] => {
  const inset = options.inset ?? Math.min(width / 2, Math.max(9, width * 0.2));
  const left = options.startLeft ? 0 : 1;
  return heights.map((y, index) => ({ x: index % 2 === left ? inset : width - inset, y }));
};

/** The road's points when it may only change sides inside the given gaps, one between each pair of stops. */
export const roadWaypoints = (stops: Point[], gaps: { from: number; to: number }[]): Point[] =>
  stops.flatMap((stop, index) => {
    const gap = gaps[index];
    const next = stops[index + 1];
    return gap && next
      ? [stop, { x: stop.x, y: gap.from }, { x: next.x, y: gap.to }]
      : [stop];
  });

/** An SVG path through the points. Curves leave and arrive vertically, so the road never turns back up. */
export const roadPath = (points: Point[]): string =>
  points
    .map(({ x, y }, index) => {
      if (index === 0) return `M${x} ${y}`;
      const previous = points[index - 1];
      const middle = (previous.y + y) / 2;
      return `C${previous.x} ${middle} ${x} ${middle} ${x} ${y}`;
    })
    .join(" ");

/** How much road it takes to reach a height, from samples sorted from top to bottom. */
export const lengthAtY = (samples: RoadSample[], y: number): number => {
  if (samples.length === 0) return 0;
  const next = samples.findIndex((sample) => sample.y >= y);
  if (next === -1) return samples[samples.length - 1].length;
  if (next === 0) return samples[0].length;
  const before = samples[next - 1];
  const after = samples[next];
  return before.length + ((y - before.y) / (after.y - before.y)) * (after.length - before.length);
};

/** How many stops the road has reached by a height. */
export const reachedStops = (stops: number[], y: number): number => stops.filter((stop) => stop <= y).length;

/** The most the cursor's preview leans, in degrees. */
const MAX_TILT = 6;

/** How far the preview leans for a cursor that moved this many pixels since the last event. */
export const tiltFor = (delta: number): number => Math.max(-MAX_TILT, Math.min(MAX_TILT, delta * 0.2));

/** The whole number to show for a target at a scroll progress from 0 to 1. */
export const countAt = (target: number, progress: number): number =>
  Math.round(target * Math.min(1, Math.max(0, progress)));
