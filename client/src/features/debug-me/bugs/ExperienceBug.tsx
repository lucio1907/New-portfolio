"use client";

import React, { useRef, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import ExperienceEntry, {
  type Experience,
  type Locale,
  entryClassName,
} from "@/components/aboutme/ExperienceEntry";
import { StaggerContainer, StaggerItem } from "@/components/motion/Reveal";
import { useBug } from "../useDebugMe";
import { useFinePointer } from "../useFinePointer";
import BugNotice, {
  bugActionClassName,
  bugSecondaryActionClassName,
} from "../components/BugNotice";
import CodeChallenge from "../challenges/CodeChallenge";
import { EXPERIENCE_CHALLENGE } from "../challenges/jsChallenges";

/**
 * Deterministic shuffle (odd positions first, then even ones). It never returns
 * the original order for 2+ items and renders the same on server and client.
 */
const scramble = <T,>(items: readonly T[]): T[] => [
  ...items.filter((_, index) => index % 2 === 1),
  ...items.filter((_, index) => index % 2 === 0),
];

const sameOrder = (a: readonly Experience[], b: readonly Experience[]) =>
  a.length === b.length && a.every((item, index) => item.id === b[index].id);

const moveItem = <T,>(items: readonly T[], from: number, to: number): T[] => {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};

const controlClassName =
  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-btn border-2 border-ink bg-white font-mono text-sm font-bold text-ink shadow-brutal-sm transition-colors hover:bg-yellow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-30";

type ExperienceBugProps = {
  /** Experiences in the correct order (newest first). */
  items: Experience[];
};

/** Bug 3: the experience timeline ships shuffled; sort it by date. */
const ExperienceBug = ({ items }: ExperienceBugProps) => {
  const t = useTranslations("debug.experience");
  const tc = useTranslations("debug.challenge");
  const [showCode, setShowCode] = useState(false);
  const locale = useLocale() as Locale;
  const { fixed, fix } = useBug("experience");
  const finePointer = useFinePointer();
  const [order, setOrder] = useState(() => scramble(items));
  const latestOrder = useRef(order);
  const currentId = items[0]?.id;

  const update = (next: Experience[], checkNow: boolean) => {
    latestOrder.current = next;
    setOrder(next);
    if (checkNow && sameOrder(next, items)) fix();
  };

  const checkAfterDrag = () => {
    if (sameOrder(latestOrder.current, items)) fix();
  };

  const notice = (
    <BugNotice fixed={fixed} hint={t("hint")} fixedText={t("sorted")}>
      <button type="button" onClick={fix} className={bugActionClassName}>
        {t("sort")}
      </button>
      <button
        type="button"
        aria-expanded={showCode}
        aria-controls="challenge-experience"
        onClick={() => setShowCode((open) => !open)}
        className={bugSecondaryActionClassName}
      >
        <span aria-hidden="true">{"</>"}</span>
        {showCode ? tc("close") : tc("open")}
      </button>
    </BugNotice>
  );

  if (fixed) {
    return (
      <>
        {notice}
        <StaggerContainer className="flex flex-col">
          {items.map((item, index) => (
            <StaggerItem
              key={item.id}
              className={entryClassName(index === items.length - 1)}
            >
              <ExperienceEntry
                item={item}
                locale={locale}
                isCurrent={item.id === currentId}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </>
    );
  }

  return (
    <>
      {notice}
      {showCode && (
        <CodeChallenge
          challenge={EXPERIENCE_CHALLENGE}
          fileName="sortTimeline.js"
          onSolved={fix}
        />
      )}
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={(next) => update(next, false)}
        className="flex flex-col"
      >
        {order.map((item, index) => (
          <DraggableEntry
            key={item.id}
            item={item}
            locale={locale}
            isCurrent={item.id === currentId}
            isLast={index === order.length - 1}
            draggable={finePointer}
            onDragEnd={checkAfterDrag}
            reorderButtons={
              <>
                <button
                  type="button"
                  aria-label={t("moveUp", { company: item.company })}
                  disabled={index === 0}
                  onClick={() => update(moveItem(order, index, index - 1), true)}
                  className={controlClassName}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={t("moveDown", { company: item.company })}
                  disabled={index === order.length - 1}
                  onClick={() => update(moveItem(order, index, index + 1), true)}
                  className={controlClassName}
                >
                  ↓
                </button>
              </>
            }
          />
        ))}
      </Reorder.Group>
    </>
  );
};

type DraggableEntryProps = {
  item: Experience;
  locale: Locale;
  isCurrent: boolean;
  isLast: boolean;
  draggable: boolean;
  onDragEnd: () => void;
  reorderButtons: React.ReactNode;
};

const DraggableEntry = ({
  item,
  locale,
  isCurrent,
  isLast,
  draggable,
  onDragEnd,
  reorderButtons,
}: DraggableEntryProps) => {
  const t = useTranslations("debug.experience");
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      className={entryClassName(isLast)}
    >
      <ExperienceEntry
        item={item}
        locale={locale}
        isCurrent={isCurrent}
        controls={
          <>
            {reorderButtons}
            {draggable && (
              // Pointer-only affordance; keyboard users have the ↑/↓ buttons.
              <span
                aria-hidden="true"
                title={t("dragHandle", { company: item.company })}
                onPointerDown={(event) => dragControls.start(event)}
                className={`${controlClassName} cursor-grab touch-none select-none active:cursor-grabbing`}
              >
                ⋮⋮
              </span>
            )}
          </>
        }
      />
    </Reorder.Item>
  );
};

export default ExperienceBug;
