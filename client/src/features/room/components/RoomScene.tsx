"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { type BufferGeometry, MeshBasicMaterial, type PerspectiveCamera, PlaneGeometry, ShaderMaterial, Vector3 } from "three";
import RoomInteraction from "./RoomInteraction";
import { type DragOrbit, type Framing, type Orbit, ORBIT_LIMITS, REST_VIEW_SLOPE, createDragOrbit, easeInOutCubic, lerpPose, roomFraming, sitPose } from "../lib/camera";
import { dispatchExperience, getSnapshot, useExperience } from "@/features/experience/store";
import { SCREEN, WINDOW, buildRoomInSteps } from "../lib/furniture";
import type { QualitySettings } from "../lib/quality";

const SIT_MS = 1100;
const STAND_MS = 900;
/** How far the pointer turns the room, as a share of the orbit limits. */
const PARALLAX = 0.14;
/** How fast the view catches up with a drag, and how it springs back after one. */
const FOLLOW_RATE = 14;
const SPRING_RATE = 4.5;
/** Longest the light bake may hold the main thread at a time (ms). */
const BAKE_SLICE = 8;

type Tween = { from: Framing; to: Framing; start: number; duration: number; arrive: boolean };

const screenCenter = new Vector3();

/**
 * Frames the room for the viewport, follows the pointer with a little
 * parallax and a drag with a limited orbit, and flies into the monitor when
 * the visitor sits down (and back out when they stand up). Keeps the ring on
 * the monitor. Renders only while something moves.
 */
const CameraRig = ({ drag, onScreenMove }: { drag: DragOrbit; onScreenMove: (x: number, y: number) => void }) => {
  const get = useThree((state) => state.get);
  const size = useThree((state) => state.size);
  const { experience } = useExperience();
  const pose = useRef<Framing | null>(null);
  const tween = useRef<Tween | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const view = useRef<Orbit>({ yaw: 0, pitch: 0 });

  const apply = useCallback(
    (framing: Framing) => {
      const { camera: current, size: viewport } = get();
      const camera = current as PerspectiveCamera;
      camera.position.set(...framing.position);
      camera.fov = framing.fov;
      camera.lookAt(...framing.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      screenCenter.set(...SCREEN.center).project(camera);
      onScreenMove(((screenCenter.x + 1) / 2) * viewport.width, ((1 - screenCenter.y) / 2) * viewport.height);
    },
    [get, onScreenMove],
  );

  const resting = useCallback(
    () => (getSnapshot().experience.mode === "room" ? roomFraming(size.width / size.height, view.current) : sitPose(size.width / size.height)),
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
      view.current = { yaw: 0, pitch: 0 };
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
        if (flight.arrive) dispatchExperience({ type: "arrived" });
      } else state.invalidate();
      return;
    }
    if (getSnapshot().experience.mode !== "room" || !pose.current) return;
    // Ease the view toward the drag, or the pointer once it ends (the spring
    // back); keep rendering until it settles.
    const dragged = drag.get();
    const yaw = dragged ? dragged.yaw : pointer.current.x * ORBIT_LIMITS.yaw * PARALLAX;
    const pitch = dragged ? dragged.pitch : pointer.current.y * ORBIT_LIMITS.pitch * PARALLAX;
    const k = 1 - Math.exp(-delta * (dragged ? FOLLOW_RATE : SPRING_RATE));
    view.current = { yaw: view.current.yaw + (yaw - view.current.yaw) * k, pitch: view.current.pitch + (pitch - view.current.pitch) * k };
    pose.current = roomFraming(state.size.width / state.size.height, view.current);
    apply(pose.current);
    if (Math.abs(yaw - view.current.yaw) + Math.abs(pitch - view.current.pitch) > 0.0004) state.invalidate();
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
        vec3 color = mix(vec3(0.09, 0.15, 0.42), vec3(0.24, 0.36, 0.78), vUv.y);
        vec3 tints[5];
        tints[0] = vec3(1.0, 0.79, 0.29);
        tints[1] = vec3(0.55, 0.8, 1.0);
        tints[2] = vec3(0.76, 0.65, 1.0);
        tints[3] = vec3(0.49, 0.86, 0.63);
        tints[4] = vec3(0.95, 0.55, 0.55);
        for (int i = 0; i < 5; i++) {
          color = mix(color, tints[i], rect(vUv, vec2(0.07, 0.86 - float(i) * 0.15), vec2(0.035, 0.055), 0.012));
        }
        float appWindow = rect(vUv, vec2(0.56, 0.55), vec2(0.3, 0.3), 0.02);
        color = mix(color, vec3(0.07, 0.1, 0.27), appWindow);
        color = mix(color, vec3(0.2, 0.26, 0.52), rect(vUv, vec2(0.56, 0.82), vec2(0.3, 0.035), 0.01));
        color = mix(color, vec3(0.06, 0.08, 0.2), rect(vUv, vec2(0.5, 0.035), vec2(0.5, 0.035), 0.0));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

/**
 * Buenos Aires at night, painted on one plane deep in the window opening. A
 * diorama floating in the dark cannot have real geometry behind its wall, so
 * each layer shifts with the view angle and the window still looks deep.
 */
const windowMaterial = () =>
  new ShaderMaterial({
    toneMapped: false,
    uniforms: {
      uRestSlope: { value: REST_VIEW_SLOPE },
      uOpening: { value: [WINDOW.x0, WINDOW.y0, WINDOW.x1, WINDOW.y1] },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec2 uRestSlope;
      uniform vec4 uOpening;
      varying vec3 vWorld;

      float random1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
      float random2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

      // One row of buildings: rgb color, alpha set where a building stands.
      vec4 buildings(vec2 p, float seed, float columnWidth, float tallest, vec3 wall) {
        float column = floor(p.x / columnWidth);
        float top = 0.12 + random1(column + seed) * tallest;
        if (p.y > top) return vec4(0.0);
        vec2 grid = vec2(p.x, p.y) / vec2(0.042, 0.05);
        vec2 cell = floor(grid);
        vec2 inside = fract(grid);
        float pane = step(0.25, inside.x) * step(inside.x, 0.75) * step(0.25, inside.y) * step(inside.y, 0.75);
        float lit = step(0.66, random2(cell + seed));
        return vec4(mix(wall, vec3(1.0, 0.78, 0.38), pane * lit), 1.0);
      }

      void main() {
        vec3 view = normalize(vWorld - cameraPosition);
        // Parallax relative to the resting view, so the skyline stays framed.
        vec2 slope = view.xy / max(-view.z, 0.05) - uRestSlope;
        vec2 size = uOpening.zw - uOpening.xy;
        vec2 local = (vWorld.xy - uOpening.xy) / size.y;

        vec2 skyUv = local + slope * 0.16;
        vec3 color = mix(vec3(0.33, 0.27, 0.56), vec3(0.05, 0.07, 0.24), smoothstep(0.0, 0.95, skyUv.y));

        vec2 starCell = floor(skyUv * 42.0);
        float star = step(0.93, random2(starCell)) * smoothstep(0.1, 0.0, distance(fract(skyUv * 42.0), vec2(0.5)));
        color += vec3(0.9, 0.88, 0.8) * star * smoothstep(0.3, 0.6, skyUv.y);

        float moon = smoothstep(0.075, 0.068, distance(skyUv, vec2(0.74, 0.76)));
        color = mix(color, vec3(0.98, 0.95, 0.84), moon);

        vec2 back = local + slope * 0.1;
        vec4 far = buildings(back, 3.0, 0.11, 0.42, vec3(0.1, 0.11, 0.32));
        color = mix(color, far.rgb, far.a);

        // The Obelisco, between the two rows of buildings.
        vec2 tower = local + slope * 0.07 - vec2(0.42, 0.0);
        float halfWidth = 0.022 - tower.y * 0.012;
        float shaft = step(abs(tower.x), halfWidth) * step(tower.y, 0.56);
        float tip = step(abs(tower.x), max(0.0, (0.62 - tower.y) * 0.25)) * step(0.56, tower.y);
        color = mix(color, vec3(0.86, 0.83, 0.76), max(shaft, tip));

        vec2 front = local + slope * 0.04;
        vec4 near = buildings(front, 11.0, 0.15, 0.24, vec3(0.05, 0.06, 0.2));
        color = mix(color, near.rgb, near.a);

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

/**
 * The light is baked into the vertex colors, so the room is unlit. The hover
 * glow reads the `objectId` attribute: highlighting costs no extra draw call.
 */
const roomMaterial = () => {
  const glow = { value: 0 };
  const material = new MeshBasicMaterial({ vertexColors: true, toneMapped: false });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uGlow = glow;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float objectId;\nvarying float vObjectId;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjectId = objectId;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uGlow;\nvarying float vObjectId;")
      .replace("#include <opaque_fragment>", "outgoingLight *= 1.0 + vec3(0.8, 0.55, 0.2) * uGlow * step(-0.5, vObjectId);\noutgoingLight += vec3(0.012, 0.008, 0.002) * uGlow * step(-0.5, vObjectId);\n#include <opaque_fragment>");
  };
  /** Decor has a negative id; the computer glows as one. */
  const setGlow = (on: boolean) => {
    glow.value = on ? 1 : 0;
  };
  return { material, setGlow };
};

/**
 * Builds the room a few milliseconds at a time: baking the light is too much
 * work for a single task, above all on a phone. Null until it is done.
 */
const useRoomGeometry = (settings: QualitySettings) => {
  const [room, setRoom] = useState<BufferGeometry | null>(null);
  useEffect(() => {
    const steps = buildRoomInSteps(settings);
    let timer: ReturnType<typeof setTimeout>;
    const work = () => {
      const deadline = performance.now() + BAKE_SLICE;
      let step = steps.next();
      while (!step.done && performance.now() < deadline) step = steps.next();
      if (step.done) setRoom(step.value);
      else timer = setTimeout(work);
    };
    timer = setTimeout(work);
    return () => clearTimeout(timer);
  }, [settings]);
  useEffect(() => () => room?.dispose(), [room]);
  return room;
};

type RoomSceneProps = {
  settings: QualitySettings;
  /** Called once the finished room's first frame is on its way to the screen. */
  onReady: () => void;
  highlight: boolean;
  /** Where the monitor is on screen, in CSS pixels. */
  onScreenMove: (x: number, y: number) => void;
  onHover: (hovering: boolean) => void;
  onActivate: () => void;
};

/** The diorama and the night in its window. Everything is procedural. */
const RoomScene = ({ settings, onReady, highlight, onScreenMove, onHover, onActivate }: RoomSceneProps) => {
  const invalidate = useThree((state) => state.invalidate);
  const { material: roomShader, setGlow } = useMemo(() => roomMaterial(), []);
  const drag = useMemo(() => createDragOrbit(), []);

  useEffect(() => {
    setGlow(highlight);
    invalidate();
  }, [highlight, setGlow, invalidate]);

  const room = useRoomGeometry(settings);
  const screen = useMemo(() => new PlaneGeometry(SCREEN.width, SCREEN.height), []);
  const sky = useMemo(() => new PlaneGeometry(WINDOW.x1 - WINDOW.x0, WINDOW.y1 - WINDOW.y0), []);
  const screenShader = useMemo(() => screenMaterial(), []);
  const skyShader = useMemo(() => windowMaterial(), []);

  useEffect(
    () => () => {
      for (const resource of [screen, sky, screenShader, skyShader, roomShader]) resource.dispose();
    },
    [screen, sky, screenShader, skyShader, roomShader],
  );

  useEffect(() => {
    if (!room) return;
    invalidate();
    const frame = requestAnimationFrame(onReady);
    return () => cancelAnimationFrame(frame);
  }, [room, invalidate, onReady]);

  return (
    <>
      {/* Must come before the rig: its effect re-enables rendering first. */}
      <FrameloopGate />
      <CameraRig drag={drag} onScreenMove={onScreenMove} />

      {room && (
        <>
          <mesh geometry={room} material={roomShader} />
          <RoomInteraction room={room} drag={drag} onHover={onHover} onActivate={onActivate} />
          <mesh geometry={screen} material={screenShader} position={SCREEN.center} />
          <mesh geometry={sky} material={skyShader} position={[(WINDOW.x0 + WINDOW.x1) / 2, (WINDOW.y0 + WINDOW.y1) / 2, WINDOW.z]} />
        </>
      )}
    </>
  );
};

export default RoomScene;
