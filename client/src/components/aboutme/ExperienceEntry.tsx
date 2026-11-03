import React from "react";
import { CommitIcon } from "@/components/pr/Icons";

export type Locale = "es" | "en";

export type Experience = {
  id: number;
  start: string;
  company: string;
  country: string;
  position: Record<Locale, string>;
  workModality: string;
  timelapse: Record<Locale, string>;
  highlights: Record<Locale, string[]>;
};

type ExperienceEntryProps = {
  item: Experience;
  locale: Locale;
  isCurrent: boolean;
  /** Optional controls rendered in the card header (e.g. reorder buttons). */
  controls?: React.ReactNode;
};

/** Deterministic 7-char "commit hash" so server and client render the same. */
export const shortSha = (seed: string): string => {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
};

const ExperienceEntry = ({
  item,
  locale,
  isCurrent,
  controls,
}: ExperienceEntryProps): React.ReactElement => (
  <div className="flex gap-3 px-4 py-4">
    <CommitIcon className="mt-1 h-4 w-4 text-muted" />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="font-semibold leading-snug">{item.position[locale]}</h4>
        <span className="flex items-center gap-2">
          {isCurrent && (
            <span className="label-chip border-accent/50 text-accent">HEAD</span>
          )}
          <code className="rounded-md border border-line bg-subtle px-1.5 py-0.5 font-mono text-xs text-link">
            {shortSha(`${item.company}-${item.start}`)}
          </code>
          {controls}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        <span className="font-semibold text-fg">{item.company}</span>
        {" · "}
        {item.timelapse[locale]} · {item.country} · {item.workModality}
      </p>
      <ul className="mt-2.5 flex flex-col gap-1">
        {item.highlights[locale].map((highlight) => (
          <li
            key={highlight}
            className="relative pl-4 text-[14.5px] leading-relaxed text-muted before:absolute before:left-0 before:text-accent before:content-['+']"
          >
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const entryClassName = (isLast: boolean): string =>
  isLast ? "relative bg-surface" : "relative border-b border-line bg-surface";

/** Newest first, by the ISO-like `start` month. */
export const sortByNewest = (items: readonly Experience[]): Experience[] =>
  [...items].sort((a, b) => b.start.localeCompare(a.start));

export default ExperienceEntry;
