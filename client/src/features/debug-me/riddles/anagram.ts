/**
 * Letter-tile anagram: the visitor rebuilds a word by picking its scrambled
 * letters in order. Pure state so it renders identically on server and client.
 */

export type AnagramState = Readonly<{
  word: string;
  /** Scrambled letters, one per tile. */
  tiles: readonly string[];
  /** Tile indexes already placed, in answer order. */
  used: readonly number[];
}>;

export type PickOutcome = "correct" | "wrong" | "solved";

export type PickResult = Readonly<{ state: AnagramState; outcome: PickOutcome }>;

/**
 * Deterministic shuffle (odd positions first, then even ones). Random order
 * would differ between server and client renders.
 */
export const scrambleWord = (word: string): string => {
  const letters = [...word];
  return [
    ...letters.filter((_, index) => index % 2 === 1),
    ...letters.filter((_, index) => index % 2 === 0),
  ].join("");
};

export const createAnagram = (word: string): AnagramState => ({
  word,
  tiles: [...scrambleWord(word)],
  used: [],
});

export const progressOf = (state: AnagramState): string =>
  state.used.map((index) => state.tiles[index]).join("");

export const isSolved = (state: AnagramState): boolean =>
  state.used.length === state.word.length;

export const pickLetter = (state: AnagramState, tileIndex: number): PickResult => {
  const expected = state.word[state.used.length];
  const isRight =
    !isSolved(state) &&
    !state.used.includes(tileIndex) &&
    state.tiles[tileIndex] === expected;

  if (!isRight) return { state, outcome: "wrong" };

  const next: AnagramState = { ...state, used: [...state.used, tileIndex] };
  return { state: next, outcome: isSolved(next) ? "solved" : "correct" };
};
