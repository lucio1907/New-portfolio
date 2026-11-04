/** Pure helpers behind the scroll-linked animations. */

/** The words of a text, each wrapped later on so it can light up on its own. */
export const splitWords = (text: string): string[] => text.split(/\s+/).filter(Boolean);

/** The whole number to show for a target at a scroll progress from 0 to 1. */
export const countAt = (target: number, progress: number): number =>
  Math.round(target * Math.min(1, Math.max(0, progress)));
