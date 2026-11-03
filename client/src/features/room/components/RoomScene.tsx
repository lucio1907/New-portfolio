"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  MeshLambertMaterial,
  type PerspectiveCamera,
  PlaneGeometry,
  ShaderMaterial,
} from "three";
import RoomInteraction from "./RoomInteraction";
import { createRandom } from "../lib/random";
import { type Framing, easeInOutCubic, lerpPose, roomFraming, sitPose } from "../lib/camera";
import { HOTSPOT_IDS } from "../lib/furniture";
import { dispatchExperience, getSnapshot, useExperience } from "@/features/experience/store";
import { LAMP_BULB, SCREEN, WINDOW, buildRoomGeometry, buildSkylineGeometry } from "../lib/furniture";
import type { QualitySettings } from "../lib/quality";

const SIT_MS = 1100;
const STAND_MS = 900;
const PARALLAX = { x: 0.16, y: 0.08 };

type Tween = { from: Framing; to: Framing; start: number; duration: number; arrive: boolean };

/**
 * Frames the room for the viewport, follows the pointer with a little
 * parallax, and flies into the monitor when the visitor sits down (and back
 * out when they stand up). Renders only while something moves.
 */
const CameraRig = () => {
  const get = useThree((state) => state.get);
  const size = useThree((state) => state.size);
  const { experience } = useExperience();
  const pose = useRef<Framing | null>(null);
  const tween = useRef<Tween | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const parallax = useRef({ x: 0, y: 0 });

  const apply = useCallback(
    (framing: Framing, shift = { x: 0, y: 0 }) => {
      const { camera: current, size: viewport } = get();
      const camera = current as PerspectiveCamera;
      const [x, y, z] = framing.position;
      camera.position.set(x + shift.x * PARALLAX.x, y + shift.y * PARALLAX.y, z);
      camera.fov = framing.fov;
      camera.lookAt(...framing.target);
      camera.setViewOffset(viewport.width, viewport.height, framing.offset.x * viewport.width, framing.offset.y * viewport.height, viewport.width, viewport.height);
      camera.updateProjectionMatrix();
    },
    [get],
  );

  const resting = useCallback(
    () => (getSnapshot().experience.mode === "room" ? roomFraming(size.width / size.height) : sitPose(size.width / size.height)),
    [size],
  );

  // Resize (or first mount): jump to the resting pose for the current mode.
  useLayoutEffect(() => {
    if (tween.current) return;
    pose.current = resting();
    apply(pose.current);
    get().invalidate();
  }, [apply, get, resting]);

  // Sitting down / standing up start a flight from wherever the camera is.
  const previousMode = useRef(experience.mode);
  useEffect(() => {
    const before = previousMode.current;
    previousMode.current = experience.mode;
    if (before === experience.mode) return;
    const aspect = size.width / size.height;
    const from = pose.current ?? roomFraming(aspect);
    const now = performance.now();
    if (experience.mode === "sitting") {
      tween.current = { from, to: sitPose(aspect), start: now, duration: SIT_MS, arrive: true };
    } else if (experience.mode === "room") {
      tween.current = { from, to: roomFraming(aspect), start: now, duration: STAND_MS, arrive: false };
    } else if (!tween.current) {
      // Deep links land on the desktop directly: no flight, just the pose.
      pose.current = sitPose(aspect);
      apply(pose.current);
    }
    get().invalidate();
  }, [experience.mode, size, get, apply]);

  // Parallax target follows the mouse (fine pointers only).
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      pointer.current = { x: (event.clientX / window.innerWidth) * 2 - 1, y: -((event.clientY / window.innerHeight) * 2 - 1) };
      if (getSnapshot().experience.mode === "room") get().invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [get]);

  useFrame((state, delta) => {
    const flight = tween.current;
    if (flight) {
      const t = (performance.now() - flight.start) / flight.duration;
      const current = lerpPose(flight.from, flight.to, easeInOutCubic(t));
      pose.current = current;
      apply(current);
      if (t >= 1) {
        tween.current = null;
        pose.current = flight.to;
        parallax.current = { x: 0, y: 0 };
        if (flight.arrive) dispatchExperience({ type: "arrived" });
      } else state.invalidate();
      return;
    }
    if (getSnapshot().experience.mode !== "room" || !pose.current) return;
    // Ease the parallax toward the pointer; keep rendering until it settles.
    const k = 1 - Math.exp(-delta * 6);
    parallax.current.x += (pointer.current.x - parallax.current.x) * k;
    parallax.current.y += (pointer.current.y - parallax.current.y) * k;
    apply(pose.current, parallax.current);
    if (Math.abs(pointer.current.x - parallax.current.x) + Math.abs(pointer.current.y - parallax.current.y) > 0.002) state.invalidate();
  });

  return null;
};

/**
 * While LucioOS covers the room nothing should render, not even on resize:
 * freeze the loop on the desktop and resume on-demand rendering otherwise
 * (the stand-up flight needs it).
 */
const FrameloopGate = () => {
  const setFrameloop = useThree((state) => state.setFrameloop);
  const invalidate = useThree((state) => state.invalidate);
  const { experience } = useExperience();
  useEffect(() => {
    const frozen = experience.mode === "desktop";
    setFrameloop(frozen ? "never" : "demand");
    if (!frozen) invalidate();
  }, [experience.mode, setFrameloop, invalidate]);
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

/**
 * Lambert with vertex colors plus a warm glow on the hovered object, read
 * from the `objectId` attribute: highlighting costs no extra draw call.
 */
const roomMaterial = () => {
  const uniforms = { uHovered: { value: -10 }, uHoveredAlt: { value: -10 } };
  const material = new MeshLambertMaterial({ vertexColors: true });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uHovered = uniforms.uHovered;
    shader.uniforms.uHoveredAlt = uniforms.uHoveredAlt;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float objectId;\nvarying float vObjectId;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjectId = objectId;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uHovered;\nuniform float uHoveredAlt;\nvarying float vObjectId;")
      .replace(
        "#include <opaque_fragment>",
        "float glow = max(1.0 - step(0.5, abs(vObjectId - uHovered)), 1.0 - step(0.5, abs(vObjectId - uHoveredAlt)));\noutgoingLight += vec3(1.0, 0.8, 0.45) * 0.3 * glow;\n#include <opaque_fragment>",
      );
  };
  /** Glow one object (and an optional partner); -10 matches nothing. */
  const setHover = (id: number, partner: number) => {
    uniforms.uHovered.value = id;
    uniforms.uHoveredAlt.value = partner;
  };
  return { material, setHover };
};

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

type RoomSceneProps = {
  settings: QualitySettings;
  highlight: number | null;
  onHover: (id: number | null, x: number, y: number) => void;
  onActivate: (id: number) => void;
};

/** Monitor and chair both mean "sit down", so they glow together. */
const partnerOf = (id: number | null) =>
  id === HOTSPOT_IDS.monitor ? HOTSPOT_IDS.chair : id === HOTSPOT_IDS.chair ? HOTSPOT_IDS.monitor : -10;

/** The desk room and the night outside its window. Everything is procedural. */
const RoomScene = ({ settings, highlight, onHover, onActivate }: RoomSceneProps) => {
  const invalidate = useThree((state) => state.invalidate);
  const { material: roomShader, setHover } = useMemo(() => roomMaterial(), []);

  useEffect(() => {
    setHover(highlight ?? -10, partnerOf(highlight));
    invalidate();
  }, [highlight, setHover, invalidate]);

  const room = useMemo(() => buildRoomGeometry(settings), [settings]);
  const skyline = useMemo(() => buildSkylineGeometry(9), []);
  const stars = useMemo(() => starGeometry(settings.stars), [settings.stars]);
  const screen = useMemo(() => new PlaneGeometry(SCREEN.width, SCREEN.height), []);
  const sky = useMemo(() => new PlaneGeometry(10, 6), []);
  const screenShader = useMemo(() => screenMaterial(), []);
  const skyShader = useMemo(() => skyMaterial(), []);

  useEffect(
    () => () => {
      for (const resource of [room, skyline, stars, screen, sky, screenShader, skyShader, roomShader]) resource.dispose();
    },
    [room, skyline, stars, screen, sky, screenShader, skyShader, roomShader],
  );

  const windowCenter: [number, number, number] = [(WINDOW.x0 + WINDOW.x1) / 2, (WINDOW.y0 + WINDOW.y1) / 2, WINDOW.z];

  return (
    <>
      <color attach="background" args={["#0F1640"]} />
      {/* Must come before the rig: its effect re-enables rendering first. */}
      <FrameloopGate />
      <CameraRig />

      <hemisphereLight args={["#8CCBFF", "#0F1640", 0.85]} />
      <directionalLight position={[windowCenter[0], 2.4, -3]} color="#A9C2FF" intensity={1.1} />
      <pointLight position={LAMP_BULB} color="#FFB86B" intensity={3.2} distance={3.6} decay={1.6} />
      <pointLight position={[SCREEN.center[0], SCREEN.center[1], SCREEN.center[2] + 0.35]} color="#8CCBFF" intensity={0.7} distance={1.6} decay={2} />

      <mesh geometry={room} material={roomShader} />
      <RoomInteraction room={room} highlight={highlight} onHover={onHover} onActivate={onActivate} />
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
