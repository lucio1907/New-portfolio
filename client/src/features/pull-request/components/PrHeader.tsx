import React from "react";
import { useTranslations } from "next-intl";
import { DownloadIcon, MailIcon, MergeIcon, PullRequestIcon } from "./Icons";
import { BranchRef, Strong } from "./Timeline";
import {
  AUTHOR,
  BASE_BRANCH,
  CV_HREF,
  EMAIL,
  HEAD_BRANCH,
  PR_NUMBER,
} from "../lib/constants";

type PrHeaderProps = {
  merged: boolean;
  commits: number;
};

export const StatePill = ({ merged }: { merged: boolean }) => {
  const t = useTranslations("pr.header");
  return merged ? (
    <span className="state-pill bg-done">
      <MergeIcon className="h-4 w-4" />
      {t("merged")}
    </span>
  ) : (
    <span className="state-pill bg-success">
      <PullRequestIcon className="h-4 w-4" />
      {t("open")}
    </span>
  );
};

/** PR title, state pill and the "wants to merge" line. */
const PrHeader = ({ merged, commits }: PrHeaderProps): React.ReactElement => {
  const t = useTranslations("pr.header");

  return (
    <header id="top" className="pt-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <h1 className="text-[26px] leading-tight md:text-[32px]">
          <bdi>{t("title")}</bdi>{" "}
          <span className="font-light text-muted">{PR_NUMBER}</span>
        </h1>
        <div className="flex shrink-0 gap-2">
          <a href={`mailto:${EMAIL}`} className="btn">
            <MailIcon className="h-4 w-4" />
            {t("contact")}
          </a>
          <a href={CV_HREF} target="_blank" rel="noreferrer" className="btn btn-primary">
            <DownloadIcon className="h-4 w-4" />
            {t("cv")}
          </a>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 border-b border-line pb-4 text-sm text-muted">
        <StatePill merged={merged} />
        <span>
          {t.rich(merged ? "mergedLine" : "openLine", {
            author: Strong,
            branch: BranchRef,
            authorName: AUTHOR,
            commits,
            base: BASE_BRANCH,
            head: HEAD_BRANCH,
          })}
        </span>
      </div>
    </header>
  );
};

export default PrHeader;
