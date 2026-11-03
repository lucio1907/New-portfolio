import React from "react";
import { useLocale, useTranslations } from "next-intl";
import WorkExperiences from "@/json/experiencies.json";
import Description from "./Description";
import PreviewBotComment from "./PreviewBotComment";
import MergeBox from "./MergeBox";
import CommentComposer from "./CommentComposer";
import { AuthorAvatar, BranchRef, Strong, TimelineEvent } from "../Timeline";
import { CommitIcon, EyeIcon, MergeIcon } from "../Icons";
import { LABELS } from "../Sidebar";
import { AUTHOR, BASE_BRANCH, HEAD_BRANCH } from "../../lib/constants";
import {
  type Experience,
  type Locale,
  shortSha,
  sortByNewest,
} from "../../lib/pullRequest";

// The merge commit hash is stable for this PR.
const MERGE_SHA = shortSha(`merge-${HEAD_BRANCH}`);

const commits = sortByNewest(WorkExperiences.experiencies as Experience[]);

type ConversationTabProps = {
  merged: boolean;
  onMerge: () => void;
  onRevert: () => void;
  onOpenCommits: () => void;
};

const Sha = (chunks: React.ReactNode) => (
  <code className="font-mono text-xs font-semibold text-fg">{chunks}</code>
);

/** Conversation tab: description, timeline events, bot comment, merge, comment box. */
const ConversationTab = ({ merged, onMerge, onRevert, onOpenCommits }: ConversationTabProps) => {
  const t = useTranslations("pr.conversation");
  const tl = useTranslations("pr.sidebar.labelNames");
  const locale = useLocale() as Locale;

  return (
    <div className="timeline">
      <Description />

      <TimelineEvent icon={<span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-muted" />}>
        <span className="mr-1.5">{t.rich("labeled", { author: Strong, authorName: AUTHOR })}</span>
        <span className="inline-flex flex-wrap gap-1 align-middle">
          {LABELS.map((label) => (
            <span key={label.key} className={`label ${label.className}`}>
              {tl(label.key)}
            </span>
          ))}
        </span>
      </TimelineEvent>

      <TimelineEvent icon={<EyeIcon className="h-4 w-4" />}>
        {t.rich("requestedReview", { author: Strong, you: Strong, authorName: AUTHOR })}
      </TimelineEvent>

      <TimelineEvent icon={<CommitIcon className="h-4 w-4" />}>
        <p className="mb-2">
          {t.rich("addedCommits", { author: Strong, authorName: AUTHOR, count: commits.length })}
        </p>
        <ul className="flex flex-col gap-1.5">
          {commits.map((commit) => (
            <li key={commit.id} className="flex items-center gap-2">
              <AuthorAvatar size={16} />
              <a
                href="#commits"
                onClick={onOpenCommits}
                className="min-w-0 flex-1 truncate text-fg hover:text-link hover:underline"
              >
                {commit.position[locale]} @ {commit.company}
              </a>
              <code className="shrink-0 font-mono text-xs text-muted">
                {shortSha(`${commit.company}-${commit.start}`)}
              </code>
            </li>
          ))}
        </ul>
      </TimelineEvent>

      <PreviewBotComment />

      {merged && (
        <TimelineEvent icon={<MergeIcon className="h-4 w-4" />} badgeClassName="bg-done text-white">
          {t.rich("mergedEvent", {
            author: Strong,
            sha: Sha,
            branch: BranchRef,
            authorName: AUTHOR,
            commit: MERGE_SHA,
            base: BASE_BRANCH,
          })}
        </TimelineEvent>
      )}

      <MergeBox merged={merged} onMerge={onMerge} onRevert={onRevert} />
      <CommentComposer />
    </div>
  );
};

export default ConversationTab;
