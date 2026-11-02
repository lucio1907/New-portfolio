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
  /** Optional controls rendered next to the title (e.g. reorder buttons). */
  controls?: React.ReactNode;
};

const ExperienceEntry = ({
  item,
  locale,
  isCurrent,
  controls,
}: ExperienceEntryProps): React.ReactElement => (
  <>
    <span
      className={`absolute -left-[5px] top-[5px] h-[9px] w-[9px] rounded-full ${
        isCurrent
          ? "bg-accent shadow-[0_0_0_4px_rgba(79,140,255,0.15)]"
          : "bg-[#3f3f46]"
      }`}
    />
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <span className="text-[17px] font-semibold text-foreground">
        {item.position[locale]}
      </span>
      <span className="flex items-center gap-2">
        <span className="whitespace-nowrap font-mono text-xs text-faint">
          {item.timelapse[locale]}
        </span>
        {controls}
      </span>
    </div>
    <div
      className={`mt-1.5 font-mono text-[13px] ${
        isCurrent ? "text-accent" : "text-dim"
      }`}
    >
      {item.company}
    </div>
    <div className="mt-1 text-[13px] text-faint-2">
      {item.country} · {item.workModality}
    </div>
    <ul className="mt-3 flex flex-col gap-1.5">
      {item.highlights[locale].map((highlight) => (
        <li
          key={highlight}
          className="relative pl-4 text-[14px] leading-[1.6] text-muted before:absolute before:left-0 before:text-faint before:content-['›']"
        >
          {highlight}
        </li>
      ))}
    </ul>
  </>
);

export const entryClassName = (isLast: boolean): string =>
  `relative border-l border-white/10 pl-7 ${isLast ? "pb-1" : "pb-[30px]"}`;

/** Newest first, by the ISO-like `start` month. */
export const sortByNewest = (items: readonly Experience[]): Experience[] =>
  [...items].sort((a, b) => b.start.localeCompare(a.start));

export default ExperienceEntry;
