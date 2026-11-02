import React from "react";

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

const ExperienceEntry = ({
  item,
  locale,
  isCurrent,
  controls,
}: ExperienceEntryProps): React.ReactElement => (
  <div className="brutal-card p-5">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <span className="brutal-chip bg-yellow font-mono text-xs">
        {item.timelapse[locale]}
      </span>
      <span className="flex items-center gap-2">
        {isCurrent && (
          <span className="brutal-chip -rotate-3 bg-green font-mono text-xs">
            NOW
          </span>
        )}
        {controls}
      </span>
    </div>
    <h4 className="text-xl font-bold leading-tight">{item.position[locale]}</h4>
    <p className="mt-1 font-mono text-sm font-bold text-blue">
      {item.company}
      <span className="font-medium text-ink-soft">
        {" "}
        · {item.country} · {item.workModality}
      </span>
    </p>
    <ul className="mt-3 flex flex-col gap-1.5">
      {item.highlights[locale].map((highlight) => (
        <li
          key={highlight}
          className="relative pl-5 text-[15px] leading-[1.6] text-ink-soft before:absolute before:left-0 before:font-bold before:text-pink before:content-['✦']"
        >
          {highlight}
        </li>
      ))}
    </ul>
  </div>
);

export const entryClassName = (isLast: boolean): string =>
  isLast ? "relative" : "relative mb-5";

/** Newest first, by the ISO-like `start` month. */
export const sortByNewest = (items: readonly Experience[]): Experience[] =>
  [...items].sort((a, b) => b.start.localeCompare(a.start));

export default ExperienceEntry;
