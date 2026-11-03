"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useDebugMe } from "@/features/debug-me/useDebugMe";
import WorkExperiences from "@/json/experiencies.json";
import TechStackData from "@/json/techStack.json";
import ProjectsData from "@/json/projects.json";
import { ChecksIcon, CommentIcon, CommitIcon, FileIcon } from "./Icons";

export const SECTION_IDS = ["conversation", "commits", "files", "checks"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const FILE_COUNT =
  TechStackData.categories.length + ProjectsData.projects.length;

/** Highlights the tab whose section crosses the upper part of the viewport. */
const useActiveSection = (): SectionId => {
  const [active, setActive] = useState<SectionId>("conversation");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return active;
};

/** Sticky PR tab bar: section navigation, counters and the recruiter bypass. */
const PrTabs = (): React.ReactElement => {
  const t = useTranslations("pr.tabs");
  const { fixed, total, deployed, merged, bypassAndMerge, reset } = useDebugMe();
  const active = useActiveSection();

  const tabs: { id: SectionId; icon: React.ReactNode; count: React.ReactNode }[] = [
    { id: "conversation", icon: <CommentIcon />, count: null },
    { id: "commits", icon: <CommitIcon />, count: WorkExperiences.experiencies.length },
    { id: "files", icon: <FileIcon />, count: FILE_COUNT },
    {
      id: "checks",
      icon: <ChecksIcon className={`h-4 w-4 ${deployed ? "text-accent" : "text-danger"}`} />,
      count: `${fixed}/${total}`,
    },
  ];

  return (
    <div className="sticky top-0 z-40 -mx-4 border-b border-line bg-canvas/90 px-4 backdrop-blur md:-mx-6 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <nav aria-label={t("label")} className="-mb-px min-w-0 overflow-x-auto">
          <ul className="flex">
            {tabs.map((tab) => {
              const isActive = active === tab.id;
              return (
                <li key={tab.id}>
                  <a
                    href={`#${tab.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`flex min-h-[48px] items-center gap-1.5 whitespace-nowrap border-b-2 px-2 text-sm sm:gap-2 sm:px-3 transition-colors ${
                      isActive
                        ? "border-attention font-semibold text-fg"
                        : "border-transparent text-muted hover:text-fg"
                    }`}
                  >
                    {tab.icon}
                    <span className="sr-only sm:not-sr-only">{t(tab.id)}</span>
                    {tab.count !== null && <span className="counter">{tab.count}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {merged ? (
          <button type="button" onClick={reset} className="btn min-h-[36px] shrink-0 px-3 text-xs">
            {t("reset")}
          </button>
        ) : (
          <button
            type="button"
            onClick={bypassAndMerge}
            className="btn min-h-[36px] shrink-0 border-merged/60 px-3 text-xs text-merged hover:border-merged"
          >
            <span className="sm:hidden">{t("bypassShort")}</span>
            <span className="hidden sm:inline">{t("bypass")}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PrTabs;
