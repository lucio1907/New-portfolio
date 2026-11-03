import React from "react";
import { useTranslations } from "next-intl";
import { ChecksIcon, CommentIcon, CommitIcon, FileIcon } from "./Icons";
import { TAB_IDS, type TabId } from "../lib/pullRequest";

type PrTabsProps = {
  active: TabId;
  counts: Record<TabId, number | null>;
  additions: number;
};

const ICONS: Record<TabId, React.ReactNode> = {
  conversation: <CommentIcon />,
  commits: <CommitIcon />,
  checks: <ChecksIcon />,
  files: <FileIcon />,
};

const DIFF_BLOCKS = 5;

/** PR tab bar (real tabs, deep-linked through the URL hash) and the diffstat. */
const PrTabs = ({ active, counts, additions }: PrTabsProps): React.ReactElement => {
  const t = useTranslations("pr.tabs");

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-line bg-canvas px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <nav aria-label={t("label")} className="-mb-px min-w-0 overflow-x-auto">
          <ul className="flex">
            {TAB_IDS.map((id) => {
              const isActive = id === active;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex h-12 items-center gap-2 whitespace-nowrap rounded-t-box border border-b-0 px-3 text-sm transition-colors md:px-4 ${
                      isActive
                        ? "border-line bg-canvas font-medium text-fg"
                        : "border-transparent text-muted hover:text-fg"
                    }`}
                  >
                    <span className="text-muted">{ICONS[id]}</span>
                    <span className={isActive ? "" : "sr-only sm:not-sr-only"}>{t(id)}</span>
                    {counts[id] !== null && <span className="counter">{counts[id]}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <p
          aria-label={t("diffstat", { additions })}
          className="hidden shrink-0 items-center gap-1.5 font-mono text-xs font-semibold md:flex"
        >
          <span className="text-success-fg">+{additions}</span>
          <span className="text-danger">−0</span>
          <span aria-hidden="true" className="ml-1 flex gap-px">
            {Array.from({ length: DIFF_BLOCKS }, (_, index) => (
              <span key={index} className="h-2 w-2 rounded-[1px] bg-success-fg" />
            ))}
          </span>
        </p>
      </div>
    </div>
  );
};

export default PrTabs;
