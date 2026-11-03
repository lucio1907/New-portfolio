"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useDebugMe } from "@/features/debug-me/useDebugMe";
import WorkExperiences from "@/json/experiencies.json";
import { AUTHOR, CV_HREF } from "./TopBar";
import { DownloadIcon, MailIcon, MergeIcon, PullRequestIcon } from "./Icons";

export const PR_NUMBER = "#0413";
export const BASE_BRANCH = "main";
export const HEAD_BRANCH = "feat/hire-lucio";
export const EMAIL = "luciogastellu.dev@gmail.com";

const branch = (chunks: React.ReactNode) => (
  <code className="rounded-md bg-link/15 px-1.5 py-0.5 font-mono text-[12.5px] text-link">
    {chunks}
  </code>
);

/** Open / Merged pill shown next to the PR title. */
export const StatusPill = ({ merged }: { merged: boolean }) => {
  const t = useTranslations("pr.header");
  return merged ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-merged px-3 py-1 text-sm font-semibold text-white">
      <MergeIcon />
      {t("merged")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-on-accent">
      <PullRequestIcon />
      {t("open")}
    </span>
  );
};

/** PR title, status, branch line and the essentials (role, availability, CTAs). */
const PrHeader = (): React.ReactElement => {
  const t = useTranslations("pr.header");
  const { merged } = useDebugMe();
  const commits = WorkExperiences.experiencies.length;

  return (
    <header id="top" className="scroll-mt-4 border-b border-line pb-6 pt-7 md:pt-9">
      <h1 className="text-[26px] leading-tight md:text-[32px]">
        <span className="font-semibold">{t("title")}</span>{" "}
        <span className="font-light text-muted">{PR_NUMBER}</span>
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted">
        <StatusPill merged={merged} />
        <span>
          {t.rich(merged ? "mergedLine" : "openLine", {
            commits,
            author: (chunks) => <span className="font-semibold text-fg">{chunks}</span>,
            branch,
            authorName: AUTHOR,
            base: BASE_BRANCH,
            head: HEAD_BRANCH,
          })}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[680px]">
          <p className="mb-2 font-mono text-sm text-accent">{t("role")}</p>
          <p className="text-[16px] leading-relaxed text-muted">{t("tagline")}</p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-accent motion-safe:animate-pulse"
            />
            {t("availability")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <a href={`mailto:${EMAIL}`} className="btn btn-primary">
            <MailIcon />
            {t("contact")}
          </a>
          <a href={CV_HREF} target="_blank" rel="noreferrer" className="btn">
            <DownloadIcon />
            {t("cv")}
          </a>
        </div>
      </div>
    </header>
  );
};

export default PrHeader;
