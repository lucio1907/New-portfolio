/** Pure helpers behind the scroll-linked animations. */

/** The words of a text, each wrapped later on so it can light up on its own. */
export const splitWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);

/** The most the cursor's preview leans, in degrees. */
const MAX_TILT = 6;

/** How far the preview leans for a cursor that moved this many pixels since the last event. */
export const tiltFor = (delta: number): number => Math.max(-MAX_TILT, Math.min(MAX_TILT, delta * 0.2));

/** The whole number to show for a target at a scroll progress from 0 to 1. */
export const countAt = (target: number, progress: number): number =>
  Math.round(target * Math.min(1, Math.max(0, progress)));
