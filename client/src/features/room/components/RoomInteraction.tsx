"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { type BufferGeometry, Raycaster, Vector2 } from "three";
import { type DragOrbit, dragToOrbit } from "../lib/camera";
import { hotspotIndex, pickHotspot } from "../lib/hotspots";
import { getSnapshot } from "@/features/experience/store";

type RoomInteractionProps = {
  room: BufferGeometry;
  drag: DragOrbit;
  onHover: (hovering: boolean) => void;
  onActivate: () => void;
};

/** A press that moves less than this (CSS px) is a click/tap, not a drag. */
const TAP_SLOP = 8;

/**
 * Pointer picking on the computer: its boxes narrow the search and its
 * triangles confirm the hit (no scene-wide raycast). Hovering makes it glow;
 * a click or a tap sits down. Dragging anywhere turns the room a little, and
 * letting go springs it back. Nothing else in the room reacts.
 */
const RoomInteraction = ({ room, drag, onHover, onActivate }: RoomInteractionProps) => {
  const get = useThree((state) => state.get);
  const index = useMemo(() => hotspotIndex(room), [room]);

  useEffect(() => {
    const { gl } = get();
    const element = gl.domElement;
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    let down: { x: number; y: number } | null = null;
    let dragging = false;
    // One finger turns the room instead of asking the browser to pan or zoom.
    element.style.touchAction = "none";

    const overComputer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, get().camera);
      return pickHotspot(raycaster.ray, index) !== null;
    };

    const inRoom = () => getSnapshot().experience.mode === "room";

    const onMove = (event: PointerEvent) => {
      if (!inRoom()) return;
      if (down) {
        const dx = event.clientX - down.x;
        const dy = event.clientY - down.y;
        if (!dragging && Math.hypot(dx, dy) <= TAP_SLOP) return;
        if (!dragging) {
          dragging = true;
          element.style.cursor = "grabbing";
          onHover(false);
        }
        drag.set(dragToOrbit(dx, dy));
        get().invalidate();
        return;
      }
      if (event.pointerType !== "mouse") return;
      const over = overComputer(event);
      element.style.cursor = over ? "pointer" : "";
      onHover(over);
    };

    const onDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY };
      element.setPointerCapture(event.pointerId);
    };

    const endDrag = () => {
      down = null;
      dragging = false;
      element.style.cursor = "";
      drag.set(null);
      get().invalidate();
    };

    const onUp = (event: PointerEvent) => {
      const tapped = down !== null && !dragging && inRoom() && overComputer(event);
      endDrag();
      if (tapped) onActivate();
    };

    const onLeave = () => {
      if (down) return;
      element.style.cursor = "";
      onHover(false);
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerdown", onDown);
    element.addEventListener("pointerup", onUp);
    element.addEventListener("pointercancel", endDrag);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerdown", onDown);
      element.removeEventListener("pointerup", onUp);
      element.removeEventListener("pointercancel", endDrag);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [get, index, drag, onHover, onActivate]);

  return null;
};

export default RoomInteraction;
