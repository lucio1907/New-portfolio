/** Time a visitor stays stuck on a riddle before the next hint shows up. */
export const HINT_STEP_MS = 20_000;

/** How many hints are visible after `elapsedMs` of looking at the riddle. */
export const revealedHints = (elapsedMs: number, hintCount: number): number =>
  Math.min(hintCount, Math.floor(elapsedMs / HINT_STEP_MS));
