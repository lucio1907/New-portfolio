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
const deployListeners = new Set<Listener>();
let current: BugsState = initialBugsState;
let loaded = false;

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

const load = (): void => {
  if (loaded) return;
  loaded = true;
  current = bugsReducer(initialBugsState, {
    type: "hydrate",
    fixed: parseStoredBugs(readStorage()),
  });
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
  if (!isDeployed(previous) && isDeployed(next)) {
    deployListeners.forEach((listener) => listener());
  }
};

/**
 * Notifies when the visitor finishes fixing the site. Restored progress never
 * triggers it, so a reload does not replay the celebration.
 */
export const subscribeDeploy = (listener: Listener): (() => void) => {
  deployListeners.add(listener);
  return () => deployListeners.delete(listener);
};

const fixAll = (): void => dispatch({ type: "fixAll" });
const reset = (): void => dispatch({ type: "reset" });

export const useDebugMe = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    state,
    fixed: fixedCount(state),
    total: BUG_IDS.length,
    deployed: isDeployed(state),
    fixAll,
    reset,
  };
};

export const useBug = (id: BugId) => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const fix = useCallback(() => dispatch({ type: "fix", id }), [id]);
  return { fixed: state[id], fix };
};
