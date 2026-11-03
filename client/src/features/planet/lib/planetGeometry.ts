import { BufferAttribute, Color, IcosahedronGeometry, type BufferGeometry } from "three";
import { PLANET_RADIUS, type Terrain, biomeColor } from "./terrain.ts";

/** Triangles of an IcosahedronGeometry at a given detail (linear subdivision). */
export const planetTriangles = (detail: number): number => 20 * (detail + 1) ** 2;

/**
 * Low-poly planet: a subdivided icosahedron displaced by the terrain, kept
 * non-indexed so every face gets its own flat normal and a single biome color.
 */
export const buildPlanetGeometry = (detail: number, terrain: Terrain): BufferGeometry => {
  const geometry = new IcosahedronGeometry(1, detail);
  geometry.deleteAttribute("uv");
  geometry.deleteAttribute("normal");

  const position = geometry.getAttribute("position");
  const heights = new Float32Array(position.count);
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const length = Math.hypot(x, y, z);
    const height = terrain.heightAt([x / length, y / length, z / length]);
    const radius = (PLANET_RADIUS + height) / length;
    position.setXYZ(i, x * radius, y * radius, z * radius);
    heights[i] = height;
  }

  const colors = new Float32Array(position.count * 3);
  const color = new Color();
  for (let face = 0; face < position.count; face += 3) {
    const average = (heights[face] + heights[face + 1] + heights[face + 2]) / 3;
    color.set(biomeColor(average));
    for (let corner = 0; corner < 3; corner++) {
      colors.set([color.r, color.g, color.b], (face + corner) * 3);
    }
  }

  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
};
