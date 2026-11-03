"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBug } from "../useDebugMe";
import { useFinePointer } from "../useFinePointer";
import BugNotice from "../components/BugNotice";

// Deterministic offsets: random values would differ between server and client.
const OFFSETS = [
  { x: -18, y: 14, rotate: -3 },
  { x: 26, y: -22, rotate: 2.5 },
  { x: -10, y: 30, rotate: 4 },
  { x: 30, y: 8, rotate: -2 },
  { x: -24, y: -12, rotate: 1.5 },
  { x: 14, y: 24, rotate: -3.5 },
];

const ALIGNED = { x: 0, y: 0, rotate: 0 };

type ProjectsBugContextValue = {
  isAligned: (index: number) => boolean;
  align: (index: number) => void;
  draggable: boolean;
};

const ProjectsBugContext = createContext<ProjectsBugContextValue | null>(null);

type ProjectsBugProps = {
  cardCount: number;
  children: React.ReactNode;
};

/** Bug 4: project cards ship misaligned; drag (or tap) each one home. */
const ProjectsBug = ({ cardCount, children }: ProjectsBugProps) => {
  const t = useTranslations("debug.projects");
  const { fixed, fix } = useBug("projects");
  const finePointer = useFinePointer();
  const [aligned, setAligned] = useState<ReadonlySet<number>>(new Set());

  const align = (index: number) => {
    if (aligned.has(index)) return;
    const next = new Set(aligned).add(index);
    setAligned(next);
    if (next.size >= cardCount) fix();
  };

  const value: ProjectsBugContextValue = {
    isAligned: (index) => fixed || aligned.has(index),
    align,
    draggable: finePointer && !fixed,
  };

  return (
    <div className="-mx-4 overflow-x-clip px-4 py-1">
      <BugNotice
        fixed={fixed}
        riddle={t("riddle", { count: cardCount })}
        hints={[t("hint1"), t("hint2", { remaining: cardCount - aligned.size })]}
        fixedText={t("applied")}
      />
      <ProjectsBugContext.Provider value={value}>
        {children}
      </ProjectsBugContext.Provider>
    </div>
  );
};

type ProjectSlotProps = {
  index: number;
  children: React.ReactNode;
};

/** Grid cell that renders its card out of place until it is aligned. */
export const ProjectSlot = ({ index, children }: ProjectSlotProps) => {
  const context = useContext(ProjectsBugContext);
  if (!context) {
    throw new Error("ProjectSlot must be rendered inside <ProjectsBug>");
  }
  const { isAligned, align, draggable } = context;
  const aligned = isAligned(index);
  const canDrag = draggable && !aligned;
  // A drag ends with a click on the card's link; swallow it so the card only
  // snaps home instead of also navigating.
  const draggedAt = useRef(0);

  return (
    <motion.div
      animate={aligned ? ALIGNED : OFFSETS[index % OFFSETS.length]}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      drag={canDrag}
      dragMomentum={false}
      onDragEnd={() => {
        draggedAt.current = Date.now();
        align(index);
      }}
      // Touch and keyboard path: tapping (or pressing Enter on) a stray card
      // sends it home instead of following its links.
      onClickCapture={(event: React.MouseEvent) => {
        const justDragged = Date.now() - draggedAt.current < 400;
        if (aligned && !justDragged) return;
        event.preventDefault();
        event.stopPropagation();
        align(index);
      }}
      // Images and links start a native HTML5 drag that cancels the pointer
      // gesture and leaves framer-motion's drag lock stuck.
      onDragStartCapture={(event: React.DragEvent) => {
        if (canDrag) event.preventDefault();
      }}
      className={`flex [&>*]:w-full ${canDrag ? "cursor-grab select-none active:cursor-grabbing" : ""}`}
    >
      {children}
    </motion.div>
  );
};

export default ProjectsBug;
