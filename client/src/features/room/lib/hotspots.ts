import { Box3, type BufferGeometry, type Ray, Vector3 } from "three";
import { DECOR } from "./furniture.ts";

/** A margin on the broad phase, so grazing rays still reach the triangle test. */
const PADDING = 0.04;

export type HotspotIndex = {
  /** Padded bounding box per interactive object (broad phase). */
  boxes: Map<number, Box3>;
  /** Triangle corners per interactive object, 9 floats per triangle (narrow phase). */
  triangles: Map<number, Float32Array>;
};

/** Collects each interactive object's bounding box and triangles from the room. */
export const hotspotIndex = (geometry: BufferGeometry): HotspotIndex => {
  const position = geometry.getAttribute("position");
  const ids = geometry.getAttribute("objectId");
  const boxes = new Map<number, Box3>();
  const lists = new Map<number, number[]>();
  const point = new Vector3();
  for (let i = 0; i < position.count; i++) {
    const id = ids.getX(i);
    if (id === DECOR) continue;
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

/** Nearest interactive object under the ray: boxes narrow it, triangles confirm it. */
export const pickHotspot = (ray: Ray, { boxes, triangles }: HotspotIndex): number | null => {
  let picked: number | null = null;
  let pickedDistance = Infinity;
  for (const [id, box] of boxes) {
    if (!ray.intersectBox(box, hit)) continue;
    const distance = nearestTriangle(ray, triangles.get(id)!);
    if (distance < pickedDistance) {
      pickedDistance = distance;
      picked = id;
    }
  }
  return picked;
};
