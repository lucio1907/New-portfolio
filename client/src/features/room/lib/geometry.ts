import { BoxGeometry, BufferAttribute, type BufferGeometry, Color } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * Tiny toolkit for procedural low-poly models: every part becomes
 * non-indexed geometry with a per-vertex `color`, so whole scenes merge into
 * a single draw call. Normals are computed once, after merging.
 */
export type Tuple3 = [number, number, number];

const scratchColor = new Color();

/** Colors, rotates (XYZ order) and moves one primitive. Consumes `source`. */
export const shape = (
  source: BufferGeometry,
  hex: string,
  position: Tuple3 = [0, 0, 0],
  rotation: Tuple3 = [0, 0, 0],
): BufferGeometry => {
  const geometry = source.index ? source.toNonIndexed() : source;
  if (geometry !== source) source.dispose();
  geometry.deleteAttribute("uv");
  geometry.deleteAttribute("normal");
  geometry.rotateX(rotation[0]).rotateY(rotation[1]).rotateZ(rotation[2]);
  geometry.translate(position[0], position[1], position[2]);
  scratchColor.set(hex);
  const count = geometry.getAttribute("position").count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) colors.set([scratchColor.r, scratchColor.g, scratchColor.b], i * 3);
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  return geometry;
};

/** Axis-aligned box centered on `position` (then optionally rotated in place). */
export const box = (
  width: number,
  height: number,
  depth: number,
  hex: string,
  position: Tuple3 = [0, 0, 0],
  rotation: Tuple3 = [0, 0, 0],
): BufferGeometry => {
  const geometry = shape(new BoxGeometry(width, height, depth), hex, [0, 0, 0], rotation);
  geometry.translate(position[0], position[1], position[2]);
  return geometry;
};

/** Merges parts (all must share the same attributes) and frees them. */
export const merge = (parts: BufferGeometry[]): BufferGeometry => {
  const merged = mergeGeometries(parts);
  for (const part of parts) part.dispose();
  if (!merged) throw new Error("mergeGeometries failed: parts have mismatched attributes");
  return merged;
};

/** Marks every vertex with an object id (hover glow and picking). */
export const tag = (geometry: BufferGeometry, id: number): BufferGeometry => {
  const count = geometry.getAttribute("position").count;
  geometry.setAttribute("objectId", new BufferAttribute(new Float32Array(count).fill(id), 1));
  return geometry;
};
