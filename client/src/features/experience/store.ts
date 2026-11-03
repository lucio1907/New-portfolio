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

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useExperience = (): Snapshot =>
  useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
