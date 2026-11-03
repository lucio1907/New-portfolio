"use client";

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { type BufferGeometry, Raycaster, Vector2 } from "three";
import { hotspotIndex, pickHotspot } from "../lib/hotspots";
import { getSnapshot } from "@/features/experience/store";

type RoomInteractionProps = {
  room: BufferGeometry;
  highlight: number | null;
  onHover: (id: number | null, x: number, y: number) => void;
  onActivate: (id: number) => void;
};

/** A press that moves less than this (CSS px) is a click/tap, not a drag. */
const TAP_SLOP = 8;

/**
 * Pointer picking: hotspot boxes narrow it down, the object's triangles
 * confirm it (no scene-wide raycast). Mouse:
 * hover highlights, click opens. Touch: first tap labels, second tap opens.
 */
const RoomInteraction = ({ room, highlight, onHover, onActivate }: RoomInteractionProps) => {
  const get = useThree((state) => state.get);
  const index = useMemo(() => hotspotIndex(room), [room]);
  // Latest highlight for the listeners, without re-subscribing on every change.
  const highlightRef = useRef(highlight);
  useEffect(() => {
    highlightRef.current = highlight;
  }, [highlight]);

  useEffect(() => {
    const { gl } = get();
    const element = gl.domElement;
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    let down: { x: number; y: number } | null = null;

    const pick = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, get().camera);
      return pickHotspot(raycaster.ray, index);
    };

    const inRoom = () => getSnapshot().experience.mode === "room";

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !inRoom()) return;
      const id = pick(event);
      element.style.cursor = id === null ? "" : "pointer";
      onHover(id, event.clientX, event.clientY);
    };

    const onDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY };
    };

    const onUp = (event: PointerEvent) => {
      if (!down || !inRoom()) return;
      const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
      down = null;
      if (moved > TAP_SLOP) return;
      const id = pick(event);
      if (id === null) {
        onHover(null, 0, 0);
        return;
      }
      if (event.pointerType === "mouse" || highlightRef.current === id) onActivate(id);
      else onHover(id, event.clientX, event.clientY);
    };

    const onLeave = () => {
      element.style.cursor = "";
      onHover(null, 0, 0);
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [get, index, onHover, onActivate]);

  return null;
};

export default RoomInteraction;
