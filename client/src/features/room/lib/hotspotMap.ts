import type { AppId } from "../../os/lib/apps.ts";

/**
 * Hotspot metadata without any three.js import, so the parts of the room
 * that ship in the initial bundle (labels, keyboard mirror) stay light.
 */
export const HOTSPOT_IDS = {
  monitor: 0,
  mate: 1,
  books: 2,
  notes: 3,
  boxes: 4,
  phone: 5,
  chair: 6,
} as const;
export type HotspotName = keyof typeof HOTSPOT_IDS;
/** Everything that is not interactive. */
export const DECOR = -1;

/** What each object in the room opens (`null` = just sit at the desktop). */
export const HOTSPOTS: ReadonlyArray<{ name: HotspotName; id: number; app: AppId | null }> = [
  { name: "monitor", id: HOTSPOT_IDS.monitor, app: null },
  { name: "chair", id: HOTSPOT_IDS.chair, app: null },
  { name: "mate", id: HOTSPOT_IDS.mate, app: "about" },
  { name: "books", id: HOTSPOT_IDS.books, app: "experience" },
  { name: "notes", id: HOTSPOT_IDS.notes, app: "stack" },
  { name: "boxes", id: HOTSPOT_IDS.boxes, app: "projects" },
  { name: "phone", id: HOTSPOT_IDS.phone, app: "contact" },
];

export const hotspotById = (id: number) => HOTSPOTS.find((hotspot) => hotspot.id === id) ?? null;
