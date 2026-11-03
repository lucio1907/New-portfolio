"use client";

import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  PlaneGeometry,
  ShaderMaterial,
} from "three";
import { createRandom } from "../lib/random";
import { roomFraming } from "../lib/camera";
import { LAMP_BULB, SCREEN, WINDOW, buildRoomGeometry, buildSkylineGeometry } from "../lib/furniture";
import type { QualitySettings } from "../lib/quality";

/** Frames the room for the current viewport (beside or above the intro card). */
const CameraRig = () => {
  const get = useThree((state) => state.get);
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    // Read the live camera from the store instead of mutating a hook value.
    const { camera: current, invalidate } = get();
    const camera = current as PerspectiveCamera;
    const { position, target, fov, offset } = roomFraming(size.width / size.height);
    camera.position.set(...position);
    camera.fov = fov;
    camera.lookAt(...target);
    camera.setViewOffset(size.width, size.height, offset.x * size.width, offset.y * size.height, size.width, size.height);
    camera.updateProjectionMatrix();
    invalidate();
  }, [get, size]);

  return null;
};

/** The monitor shows a tiny LucioOS: wallpaper, app icons and a window. */
const screenMaterial = () =>
  new ShaderMaterial({
    toneMapped: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      float rect(vec2 uv, vec2 center, vec2 halfSize, float radius) {
        vec2 d = abs(uv - center) - halfSize + radius;
        return 1.0 - smoothstep(0.0, 0.004, length(max(d, 0.0)) - radius);
      }
      void main() {
        vec3 color = mix(vec3(0.06, 0.09, 0.25), vec3(0.14, 0.19, 0.43), vUv.y);
        vec3 tints[5];
        tints[0] = vec3(1.0, 0.79, 0.29);
        tints[1] = vec3(0.55, 0.8, 1.0);
        tints[2] = vec3(0.76, 0.65, 1.0);
        tints[3] = vec3(0.49, 0.86, 0.63);
        tints[4] = vec3(0.95, 0.55, 0.55);
        for (int i = 0; i < 5; i++) {
          color = mix(color, tints[i], rect(vUv, vec2(0.07, 0.86 - float(i) * 0.15), vec2(0.035, 0.055), 0.012));
        }
        float window = rect(vUv, vec2(0.56, 0.55), vec2(0.3, 0.3), 0.02);
        color = mix(color, vec3(0.07, 0.1, 0.27), window);
        color = mix(color, vec3(0.2, 0.26, 0.52), rect(vUv, vec2(0.56, 0.82), vec2(0.3, 0.035), 0.01));
        color = mix(color, vec3(0.06, 0.08, 0.2), rect(vUv, vec2(0.5, 0.035), vec2(0.5, 0.035), 0.0));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

/** Night sky behind the skyline: gradient plus a moon. */
const skyMaterial = () =>
  new ShaderMaterial({
    toneMapped: false,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vec3 color = mix(vec3(0.17, 0.23, 0.5), vec3(0.03, 0.05, 0.16), smoothstep(0.0, 0.85, vUv.y));
        float moon = 1.0 - smoothstep(0.028, 0.032, distance(vUv * vec2(1.8, 1.0), vec2(0.62 * 1.8, 0.78)));
        color = mix(color, vec3(0.95, 0.93, 0.87), moon);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

const starGeometry = (count: number) => {
  const random = createRandom(2026);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions.set([-3 + random() * 7.5, 1.4 + random() * 3.2, -5.2 - random() * 0.4], i * 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
};

type RoomSceneProps = { settings: QualitySettings };

/** The desk room and the night outside its window. Everything is procedural. */
const RoomScene = ({ settings }: RoomSceneProps) => {
  const room = useMemo(() => buildRoomGeometry(settings), [settings]);
  const skyline = useMemo(() => buildSkylineGeometry(9), []);
  const stars = useMemo(() => starGeometry(settings.stars), [settings.stars]);
  const screen = useMemo(() => new PlaneGeometry(SCREEN.width, SCREEN.height), []);
  const sky = useMemo(() => new PlaneGeometry(10, 6), []);
  const screenShader = useMemo(() => screenMaterial(), []);
  const skyShader = useMemo(() => skyMaterial(), []);

  useEffect(
    () => () => {
      for (const resource of [room, skyline, stars, screen, sky, screenShader, skyShader]) resource.dispose();
    },
    [room, skyline, stars, screen, sky, screenShader, skyShader],
  );

  const windowCenter: [number, number, number] = [(WINDOW.x0 + WINDOW.x1) / 2, (WINDOW.y0 + WINDOW.y1) / 2, WINDOW.z];

  return (
    <>
      <color attach="background" args={["#0F1640"]} />
      <CameraRig />

      <hemisphereLight args={["#8CCBFF", "#0F1640", 0.85]} />
      <directionalLight position={[windowCenter[0], 2.4, -3]} color="#A9C2FF" intensity={1.1} />
      <pointLight position={LAMP_BULB} color="#FFB86B" intensity={3.2} distance={3.6} decay={1.6} />
      <pointLight position={[SCREEN.center[0], SCREEN.center[1], SCREEN.center[2] + 0.35]} color="#8CCBFF" intensity={0.7} distance={1.6} decay={2} />

      <mesh geometry={room}>
        <meshLambertMaterial vertexColors />
      </mesh>
      <mesh geometry={screen} material={screenShader} position={SCREEN.center} />

      <mesh geometry={sky} material={skyShader} position={[1.2, 2.6, -5.6]} />
      <points geometry={stars}>
        <pointsMaterial color="#EEE8DA" size={1.4} sizeAttenuation={false} transparent opacity={0.8} depthWrite={false} />
      </points>
      <mesh geometry={skyline}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
    </>
  );
};

export default RoomScene;
