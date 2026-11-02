export const BUG_IDS = [
  "about",
  "stack",
  "experience",
  "projects",
  "contact",
] as const;

export type BugId = (typeof BUG_IDS)[number];

export type BugsState = Readonly<Record<BugId, boolean>>;

export type BugsAction =
  | { type: "fix"; id: BugId }
  | { type: "fixAll" }
  | { type: "reset" }
  | { type: "hydrate"; fixed: readonly BugId[] };

export const STORAGE_KEY = "debug-me:fixed";

export const initialBugsState: BugsState = {
  about: false,
  stack: false,
  experience: false,
  projects: false,
  contact: false,
};

const withFixed = (ids: readonly BugId[]): BugsState =>
  BUG_IDS.reduce(
    (state, id) => ({ ...state, [id]: ids.includes(id) }),
    initialBugsState,
  );

export const bugsReducer = (
  state: BugsState,
  action: BugsAction,
): BugsState => {
  switch (action.type) {
    case "fix":
      return state[action.id] ? state : { ...state, [action.id]: true };
    case "fixAll":
      return withFixed(BUG_IDS);
    case "reset":
      return initialBugsState;
    case "hydrate":
      return withFixed(action.fixed);
  }
};

export const fixedIds = (state: BugsState): BugId[] =>
  BUG_IDS.filter((id) => state[id]);

export const fixedCount = (state: BugsState): number => fixedIds(state).length;

export const isDeployed = (state: BugsState): boolean =>
  fixedCount(state) === BUG_IDS.length;

const isBugId = (value: unknown): value is BugId =>
  typeof value === "string" && (BUG_IDS as readonly string[]).includes(value);

/** Parses persisted progress, ignoring anything malformed or unknown. */
export const parseStoredBugs = (raw: string | null): BugId[] => {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isBugId) : [];
  } catch {
    return [];
  }
};
