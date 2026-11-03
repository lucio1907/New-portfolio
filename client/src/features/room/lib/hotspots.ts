import { Box3, type BufferGeometry, type Ray, Vector3 } from "three";
import { HOTSPOTS, hotspotById } from "./hotspotMap.ts";

export { HOTSPOTS, hotspotById };

/** Small objects get a margin so they are easy to hit, also with a finger. */
const PADDING = 0.04;
/** Objects smaller than this (meters) also accept hits on their padded box. */
const SMALL = 0.35;

export type HotspotIndex = {
  /** Padded bounding box per hotspot (broad phase). */
  boxes: Map<number, Box3>;
  /** Triangle corners per hotspot, 9 floats per triangle (narrow phase). */
  triangles: Map<number, Float32Array>;
};

/** Collects each hotspot's bounding box and triangles from the room geometry. */
export const hotspotIndex = (geometry: BufferGeometry): HotspotIndex => {
  const position = geometry.getAttribute("position");
  const ids = geometry.getAttribute("objectId");
  const boxes = new Map<number, Box3>();
  const lists = new Map<number, number[]>();
  const point = new Vector3();
  for (let i = 0; i < position.count; i++) {
    const id = ids.getX(i);
    if (!hotspotById(id)) continue;
    if (!boxes.has(id)) {
      boxes.set(id, new Box3());
      lists.set(id, []);
    }
    point.fromBufferAttribute(position, i);
    boxes.get(id)!.expandByPoint(point);
    lists.get(id)!.push(point.x, point.y, point.z);
  }
  for (const box of boxes.values()) box.expandByScalar(PADDING);
  const triangles = new Map([...lists].map(([id, values]) => [id, new Float32Array(values)]));
  return { boxes, triangles };
};

const hit = new Vector3();
const a = new Vector3();
const b = new Vector3();
const c = new Vector3();
const size = new Vector3();

/** Distance along the ray to the nearest of these triangles, or Infinity. */
const nearestTriangle = (ray: Ray, corners: Float32Array) => {
  let nearest = Infinity;
  for (let i = 0; i < corners.length; i += 9) {
    a.fromArray(corners, i);
    b.fromArray(corners, i + 3);
    c.fromArray(corners, i + 6);
    if (ray.intersectTriangle(a, b, c, false, hit)) nearest = Math.min(nearest, hit.distanceTo(ray.origin));
  }
  return nearest;
};

/**
 * Nearest hotspot under the ray. Boxes only narrow the search; the hit must
 * land on the object's triangles, except for small objects, whose padded box
 * also counts (easy to tap) when no triangle is hit at all.
 */
export const pickHotspot = (ray: Ray, { boxes, triangles }: HotspotIndex): number | null => {
  let exact: number | null = null;
  let exactDistance = Infinity;
  let loose: number | null = null;
  let looseDistance = Infinity;
  for (const [id, box] of boxes) {
    if (!ray.intersectBox(box, hit)) continue;
    const boxDistance = hit.distanceTo(ray.origin);
    const distance = nearestTriangle(ray, triangles.get(id)!);
    if (distance < exactDistance) {
      exactDistance = distance;
      exact = id;
    }
    const small = box.getSize(size).length() - PADDING * 2 * Math.sqrt(3) < SMALL;
    if (small && boxDistance < looseDistance) {
      looseDistance = boxDistance;
      loose = id;
    }
  }
  return exact ?? loose;
};
