"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  BUG_IDS,
  type BugId,
  type BugsAction,
  type BugsState,
  STORAGE_KEY,
  bugsReducer,
  fixedCount,
  fixedIds,
  initialBugsState,
  isDeployed,
  parseStoredBugs,
} from "./model/bugs";

/*
 * Debug progress lives in a tiny external store backed by localStorage.
 * useSyncExternalStore renders the server snapshot (everything broken) during
 * hydration and then switches to the saved progress, so the server HTML and the
 * first client render always match.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
const mergeListeners = new Set<Listener>();
const mergedListeners = new Set<Listener>();
let current: BugsState = initialBugsState;
let loaded = false;
// Merging is the finale of a session; it is not persisted across reloads.
let merged = false;

const readStorage = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeStorage = (state: BugsState): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedIds(state)));
  } catch {
    // Storage can be unavailable (private mode, blocked site data): progress
    // simply is not remembered.
  }
};

const hydrateFrom = (raw: string | null): BugsState =>
  bugsReducer(initialBugsState, { type: "hydrate", fixed: parseStoredBugs(raw) });

// Other tabs (or frames) of the site share localStorage; keep them in sync.
const onStorage = (event: StorageEvent): void => {
  if (event.key !== STORAGE_KEY) return;
  current = hydrateFrom(event.newValue);
  listeners.forEach((listener) => listener());
};

const load = (): void => {
  if (loaded) return;
  loaded = true;
  current = hydrateFrom(readStorage());
  window.addEventListener("storage", onStorage);
};

const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = (): BugsState => {
  load();
  return current;
};

const getServerSnapshot = (): BugsState => initialBugsState;

const dispatch = (action: BugsAction): void => {
  load();
  const previous = current;
  const next = bugsReducer(previous, action);
  if (next === previous) return;
  current = next;
  writeStorage(current);
  listeners.forEach((listener) => listener());
};

const setMerged = (value: boolean): void => {
  if (merged === value) return;
  merged = value;
  mergedListeners.forEach((listener) => listener());
  if (value) mergeListeners.forEach((listener) => listener());
};

/**
 * Notifies when the visitor merges the pull request. Restored progress never
 * triggers it, so a reload does not replay the celebration.
 */
export const subscribeMerge = (listener: Listener): (() => void) => {
  mergeListeners.add(listener);
  return () => mergeListeners.delete(listener);
};

const subscribeMerged = (listener: Listener): (() => void) => {
  mergedListeners.add(listener);
  return () => mergedListeners.delete(listener);
};

/** Merges only once every check passes. */
const merge = (): void => {
  load();
  if (isDeployed(current)) setMerged(true);
};

/** Recruiter shortcut: fix every bug and merge in one go. */
const bypassAndMerge = (): void => {
  dispatch({ type: "fixAll" });
  merge();
};

const reset = (): void => {
  dispatch({ type: "reset" });
  setMerged(false);
};

export const useDebugMe = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    state,
    fixed: fixedCount(state),
    total: BUG_IDS.length,
    deployed: isDeployed(state),
    merged:
      useSyncExternalStore(subscribeMerged, () => merged, () => false) &&
      isDeployed(state),
    merge,
    bypassAndMerge,
    reset,
  };
};

export const useBug = (id: BugId) => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const fix = useCallback(() => dispatch({ type: "fix", id }), [id]);
  return { fixed: state[id], fix };
};
