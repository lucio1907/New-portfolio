"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import TechStackData from "@/json/techStack.json";
import { CheckIcon, ChevronDownIcon, MailIcon, MergeIcon } from "../Icons";
import { EMAIL, HEAD_BRANCH, PR_NUMBER } from "../../lib/constants";
import { jobDuration } from "../../lib/pullRequest";

type MergeBoxProps = {
  merged: boolean;
  onMerge: () => void;
  onRevert: () => void;
};

const jobs = TechStackData.categories.map((category) => category.key);

const StatusDot = ({ className }: { className: string }) => (
  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${className}`}>
    <CheckIcon className="h-4 w-4" />
  </span>
);

/** Merge box at the end of the conversation: checks, conflicts, merge. */
const MergeBox = ({ merged, onMerge, onRevert }: MergeBoxProps): React.ReactElement => {
  const t = useTranslations("pr.merge");
  const tc = useTranslations("pr.checks");
  const ts = useTranslations("techStack.categories");
  const [showChecks, setShowChecks] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (merged) {
    return (
      <div className="relative flex gap-4 py-3 md:ml-14">
        <span className="relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-box bg-done text-white md:-ml-14 md:flex">
          <MergeIcon className="h-5 w-5" />
        </span>
        <div className="box flex-1 border-done/60 p-4">
          <p className="mb-1 text-base font-semibold">{t("mergedTitle")}</p>
          <p className="mb-4 text-sm text-muted">{t("mergedHint")}</p>
          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${EMAIL}`} className="btn btn-primary">
              <MailIcon className="h-4 w-4" />
              {t("email")}
            </a>
            <button type="button" onClick={onRevert} className="btn">
              {t("revert")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex gap-4 py-3 md:ml-14">
      <span className="relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-box bg-success text-white md:-ml-14 md:flex">
        <MergeIcon className="h-5 w-5" />
      </span>

      <div className="box flex-1 border-success/70">
        <div className="flex items-start gap-3 border-b border-line p-4">
          <StatusDot className="bg-success text-white" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{t("checksPassed")}</p>
            <p className="text-sm text-muted">{t("checksSummary", { count: jobs.length })}</p>
          </div>
          <button
            type="button"
            aria-expanded={showChecks}
            aria-controls="merge-checks"
            onClick={() => setShowChecks((open) => !open)}
            className="btn btn-sm shrink-0 border-transparent bg-transparent text-link hover:bg-btn"
          >
            {showChecks ? t("hideChecks") : t("showChecks")}
            <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${showChecks ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showChecks && (
          <ul id="merge-checks" className="divide-y divide-line-muted border-b border-line bg-subtle/40">
            {jobs.map((job) => (
              <li key={job} className="flex items-center gap-2 px-4 py-2 text-sm">
                <CheckIcon className="h-4 w-4 text-success-fg" />
                <span className="font-semibold">CI / {ts(job)}</span>
                <span className="text-muted">— {tc("succeeded", { seconds: jobDuration(job) })}</span>
                <a href="#checks" className="ml-auto text-link hover:underline">
                  {tc("jobs")}
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-start gap-3 border-b border-line p-4">
          <StatusDot className="bg-success text-white" />
          <div>
            <p className="font-semibold">{t("noConflicts")}</p>
            <p className="text-sm text-muted">{t("noConflictsHint")}</p>
          </div>
        </div>

        <div className="p-4">
          {confirming ? (
            <div className="flex animate-fade-in flex-col gap-3">
              <label htmlFor="merge-title" className="text-sm font-semibold">
                {t("commitTitle")}
              </label>
              <input
                id="merge-title"
                readOnly
                value={t("commitMessage", { number: PR_NUMBER, head: HEAD_BRANCH })}
                className="h-8 rounded-box border border-line bg-inset px-3 font-mono text-[13px] text-fg"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    onMerge();
                  }}
                  className="btn btn-primary"
                >
                  {t("confirm")}
                </button>
                <button type="button" onClick={() => setConfirming(false)} className="btn">
                  {t("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="btn btn-primary">
              <MergeIcon className="h-4 w-4" />
              {t("merge")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MergeBox;
