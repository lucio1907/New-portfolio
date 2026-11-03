"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  IcosahedronGeometry,
  type Group,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from "three";
import { SECTIONS } from "@/features/portfolio/lib/sections";
import { createRandom } from "../lib/random";
import { latLonToVector } from "../lib/sphere";
import { PLANET_RADIUS, createTerrain } from "../lib/terrain";
import { buildPlanetGeometry } from "../lib/planetGeometry";
import type { QualitySettings } from "../lib/quality";

const SEED = 2026;
const LANDMARKS = SECTIONS.map(({ lat, lon }) => latLonToVector(lat, lon));
const HOME = new Vector3(...LANDMARKS[0]);
const TOWARD_CAMERA = new Vector3(0, 0, 1);

const atmosphereMaterial = () =>
  new ShaderMaterial({
    side: BackSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    uniforms: {},
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vNormal;
      void main() {
        float rim = pow(clamp(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 4.0);
        gl_FragColor = vec4(vec3(0.55, 0.8, 1.0), rim * 0.95);
      }
    `,
  });

const starGeometry = (count: number) => {
  const random = createRandom(SEED + 1);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = latLonToVector(Math.asin(random() * 2 - 1) * (180 / Math.PI), random() * 360 - 180);
    const radius = 30 + random() * 25;
    positions.set([x * radius, y * radius, z * radius], i * 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
};

type SceneProps = { settings: QualitySettings };

/** Planet, ocean, atmosphere, stars and lights. All geometry is procedural. */
const Scene = ({ settings }: SceneProps) => {
  const invalidate = useThree((state) => state.invalidate);
  const sway = useRef<Group>(null);

  const terrain = useMemo(() => createTerrain({ seed: SEED, landmarks: LANDMARKS }), []);
  const planet = useMemo(() => buildPlanetGeometry(settings.planetDetail, terrain), [settings.planetDetail, terrain]);
  const ocean = useMemo(() => new IcosahedronGeometry(PLANET_RADIUS, settings.oceanDetail), [settings.oceanDetail]);
  const atmosphere = useMemo(() => new IcosahedronGeometry(PLANET_RADIUS * 1.16, 6), []);
  const atmosphereShader = useMemo(() => atmosphereMaterial(), []);
  const stars = useMemo(() => starGeometry(settings.stars), [settings.stars]);
  // Start with the home landmark (Buenos Aires) facing the camera.
  const pose = useMemo(() => new Quaternion().setFromUnitVectors(HOME, TOWARD_CAMERA), []);

  useEffect(
    () => () => {
      for (const resource of [planet, ocean, atmosphere, atmosphereShader, stars]) resource.dispose();
    },
    [planet, ocean, atmosphere, atmosphereShader, stars],
  );

  // Created once: reading it per frame must not allocate.
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)"), []);

  // The sway loop stops while hidden; request a frame to resume it.
  useEffect(() => {
    const resume = () => invalidate();
    document.addEventListener("visibilitychange", resume);
    reducedMotion.addEventListener("change", resume);
    return () => {
      document.removeEventListener("visibilitychange", resume);
      reducedMotion.removeEventListener("change", resume);
    };
  }, [invalidate, reducedMotion]);

  // Gentle idle sway; paused when the tab is hidden or motion is reduced.
  useFrame((state) => {
    if (!sway.current || reducedMotion.matches || document.hidden) return;
    sway.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.16;
    invalidate();
  });

  return (
    <>
      <hemisphereLight args={["#8CCBFF", "#0F1640", 0.9]} />
      <directionalLight position={[-4, 3, 5]} intensity={2.4} />

      <points geometry={stars}>
        <pointsMaterial color="#EEE8DA" size={1.6} sizeAttenuation={false} transparent opacity={0.75} depthWrite={false} />
      </points>

      <group quaternion={pose}>
        <group ref={sway}>
          <mesh geometry={planet}>
            <meshLambertMaterial vertexColors />
          </mesh>
          <mesh geometry={ocean}>
            <meshPhongMaterial color="#2F7DB5" flatShading shininess={70} transparent opacity={0.88} />
          </mesh>
        </group>
      </group>

      <mesh geometry={atmosphere} material={atmosphereShader} />
    </>
  );
};

export default Scene;
