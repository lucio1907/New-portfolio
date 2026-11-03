"use client";

import { useSyncExternalStore } from "react";
import {
  type ExperienceAction,
  type ExperienceState,
  INITIAL_EXPERIENCE,
  experienceReducer,
} from "./lib/experience";
import {
  type DesktopAction,
  type DesktopState,
  EMPTY_DESKTOP,
  desktopReducer,
} from "@/features/os/lib/windows";

/**
 * One tiny external store shared by the 3D room and LucioOS: where the
 * visitor is (room / sitting / desktop) and which windows are open.
 */
type Snapshot = { experience: ExperienceState; desktop: DesktopState };

const SERVER_SNAPSHOT: Snapshot = { experience: INITIAL_EXPERIENCE, desktop: EMPTY_DESKTOP };

let snapshot: Snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

const commit = (next: Snapshot) => {
  if (next === snapshot) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
};

export const dispatchExperience = (action: ExperienceAction) => {
  const experience = experienceReducer(snapshot.experience, action);
  if (experience !== snapshot.experience) commit({ ...snapshot, experience });
};

export const dispatchDesktop = (action: DesktopAction) => {
  const desktop = desktopReducer(snapshot.desktop, action);
  if (desktop !== snapshot.desktop) commit({ ...snapshot, desktop });
};

export const getSnapshot = () => snapshot;

/**
 * Whether the 3D room is on screen. Sitting down animates only when it is;
 * otherwise (loading, no WebGL) the desktop opens instantly.
 */
let roomReady = false;
export const setRoomReady = (ready: boolean) => {
  roomReady = ready;
};
export const isRoomReady = () => roomReady;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useExperience = (): Snapshot =>
  useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);

/** Developer overlay with live rendering stats (toggled with ` or `stats`). */
let statsVisible = false;
const statsListeners = new Set<() => void>();
export const toggleStats = () => {
  statsVisible = !statsVisible;
  statsListeners.forEach((listener) => listener());
};
const subscribeStats = (listener: () => void) => {
  statsListeners.add(listener);
  return () => statsListeners.delete(listener);
};
export const useStatsVisible = (): boolean =>
  useSyncExternalStore(subscribeStats, () => statsVisible, () => false);
