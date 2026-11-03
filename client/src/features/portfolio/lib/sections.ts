/**
 * The portfolio's sections in reading order. Each one is also a landmark on
 * the 3D planet, placed at these latitude/longitude degrees (home uses Buenos
 * Aires' real coordinates; the rest are spread around the little planet).
 */
export const SECTIONS = [
  { id: "home", lat: -34.6, lon: -58.4 },
  { id: "about", lat: 14, lon: -14 },
  { id: "experience", lat: 40, lon: 32 },
  { id: "stack", lat: 4, lon: 88 },
  { id: "projects", lat: -22, lon: 142 },
  { id: "contact", lat: 52, lon: -122 },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

const part = (value: number, positive: string, negative: string): string => {
  const absolute = Math.abs(value);
  let degrees = Math.floor(absolute);
  let minutes = Math.round((absolute - degrees) * 60);
  if (minutes === 60) {
    degrees += 1;
    minutes = 0;
  }
  return `${degrees}°${String(minutes).padStart(2, "0")}′${value < 0 ? negative : positive}`;
};

/** "34°36′S 58°24′W" style label for a landmark. */
export const formatCoordinate = (lat: number, lon: number): string =>
  `${part(lat, "N", "S")} ${part(lon, "E", "W")}`;
