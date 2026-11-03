"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import WorkExperiences from "@/json/experiencies.json";
import TechStackData from "@/json/techStack.json";
import RepoHeader from "./RepoHeader";
import PrHeader from "./PrHeader";
import PrTabs from "./PrTabs";
import Sidebar from "./Sidebar";
import Confetti from "./Confetti";
import ConversationTab from "./conversation/ConversationTab";
import CommitsTab from "./commits/CommitsTab";
import ChecksTab from "./checks/ChecksTab";
import FilesTab from "./files/FilesTab";
import { type Locale, type TabId, tabFromHash } from "../lib/pullRequest";
import { buildFiles, totalAdditions } from "../lib/files";

const COMMIT_COUNT = WorkExperiences.experiencies.length;

/** Client root of the page: owns the active tab (URL hash) and the merge state. */
const PullRequestPage = (): React.ReactElement => {
  const t = useTranslations("footer");
  const locale = useLocale() as Locale;
  const [tab, setTab] = useState<TabId>("conversation");
  const [merged, setMerged] = useState(false);
  const [confettiShot, setConfettiShot] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  // The hash is the source of truth, so tabs deep-link and Back/Forward work.
  useEffect(() => {
    const sync = () => setTab(tabFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Keep the tab bar in view when switching tabs from far down the page.
  useEffect(() => {
    const tabs = tabsRef.current;
    if (tabs && tabs.getBoundingClientRect().top < 0) {
      tabs.scrollIntoView({ block: "start" });
    }
  }, [tab]);

  const openTab = useCallback((id: TabId) => setTab(id), []);

  const merge = () => {
    setMerged(true);
    setConfettiShot((shot) => shot + 1);
  };

  const counts: Record<TabId, number | null> = {
    conversation: null,
    commits: COMMIT_COUNT,
    checks: TechStackData.categories.length,
    files: buildFiles(locale).length,
  };

  return (
    <>
      <RepoHeader onOpenChecks={() => openTab("checks")} />

      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        <PrHeader merged={merged} commits={COMMIT_COUNT} />
        <div ref={tabsRef} className="scroll-mt-0">
          <PrTabs active={tab} counts={counts} additions={totalAdditions(locale)} />
        </div>

        <div role="tabpanel" aria-label={tab} id={`panel-${tab}`}>
          {tab === "conversation" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_256px]">
              <ConversationTab
                merged={merged}
                onMerge={merge}
                onRevert={() => setMerged(false)}
                onOpenCommits={() => openTab("commits")}
              />
              <Sidebar merged={merged} />
            </div>
          )}
          {tab === "commits" && <CommitsTab />}
          {tab === "checks" && <ChecksTab />}
          {tab === "files" && <FilesTab />}
        </div>
      </div>

      <footer className="mt-16 border-t border-line">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted md:px-6 lg:px-8">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-fg font-mono text-[10px] font-bold text-canvas"
            >
              LG
            </span>
            Lucio Gastellu
          </span>
          <span>{t("note")}</span>
        </div>
      </footer>

      <Confetti shot={confettiShot} />
    </>
  );
};

export default PullRequestPage;
