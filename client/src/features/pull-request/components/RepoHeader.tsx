import React from "react";
import { useTranslations } from "next-intl";
import LanguageToggle from "./LanguageToggle";
import { CodeIcon, DownloadIcon, PlayIcon, PullRequestIcon, RepoIcon } from "./Icons";
import { AUTHOR, CV_HREF, GITHUB_URL, REPO } from "../lib/constants";

type RepoHeaderProps = {
  /** Opens the Checks tab from the "Actions" item. */
  onOpenChecks: () => void;
};

const navItemClassName =
  "flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-2 text-sm transition-colors";

/** Repository header: owner / repo, language + CV, and the repo navigation. */
const RepoHeader = ({ onOpenChecks }: RepoHeaderProps): React.ReactElement => {
  const t = useTranslations("pr.repo");

  return (
    <div className="border-b border-line bg-subtle">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 pt-4">
          <p className="flex min-w-0 items-center gap-2 text-[17px]">
            <RepoIcon className="h-4 w-4 text-muted" />
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="truncate text-link hover:underline">
              {AUTHOR}
            </a>
            <span className="text-muted">/</span>
            <a href="#conversation" className="font-semibold text-link hover:underline">
              {REPO}
            </a>
            <span className="label ml-1 hidden border-line text-muted sm:inline-flex">
              {t("visibility")}
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle />
            <a href={CV_HREF} target="_blank" rel="noreferrer" className="btn btn-sm" aria-label="CV">
              <DownloadIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CV</span>
            </a>
          </div>
        </div>

        <nav aria-label={t("nav")} className="-mb-px mt-2 overflow-x-auto">
          <ul className="flex gap-2">
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className={`${navItemClassName} border-transparent text-fg hover:border-line`}
              >
                <CodeIcon className="h-4 w-4 text-muted" />
                {t("code")}
              </a>
            </li>
            <li>
              <a
                href="#conversation"
                aria-current="page"
                className={`${navItemClassName} border-[#fd8c73] font-semibold text-fg`}
              >
                <PullRequestIcon className="h-4 w-4 text-muted" />
                {t("pullRequests")}
                <span className="counter">1</span>
              </a>
            </li>
            <li>
              <a
                href="#checks"
                onClick={onOpenChecks}
                className={`${navItemClassName} border-transparent text-fg hover:border-line`}
              >
                <PlayIcon className="h-4 w-4 text-muted" />
                {t("actions")}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default RepoHeader;
