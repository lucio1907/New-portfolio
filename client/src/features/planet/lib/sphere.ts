/** Spherical helpers. Convention: +Y is north, lon 0 faces +Z (the camera). */
export type Vec3 = readonly [number, number, number];

const DEG = Math.PI / 180;

export const latLonToVector = (lat: number, lon: number, radius = 1): Vec3 => {
  const phi = lat * DEG;
  const lambda = lon * DEG;
  return [
    radius * Math.cos(phi) * Math.sin(lambda),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(lambda),
  ];
};

/** Angle in radians between two directions (any length). */
export const angleBetween = (a: Vec3, b: Vec3): number => {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const lengths = Math.hypot(...a) * Math.hypot(...b);
  return Math.acos(Math.max(-1, Math.min(1, dot / lengths)));
};
