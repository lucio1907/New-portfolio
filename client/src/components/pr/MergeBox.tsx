"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { BUG_IDS, type BugId } from "@/features/debug-me/model/bugs";
import { useDebugMe } from "@/features/debug-me/useDebugMe";
import ContactBug from "@/features/debug-me/bugs/ContactBug";
import { BotAvatar } from "@/features/debug-me/components/BugNotice";
import TimelineEvent from "./TimelineEvent";
import { EMAIL } from "./PrHeader";
import { CheckIcon, ChecksIcon, CrossIcon, MailIcon, MergeIcon } from "./Icons";

/** Where each failing check's "Details" link takes the visitor. */
const DETAILS_HREF: Record<BugId, string> = {
  about: "#conversation",
  stack: "#stack",
  experience: "#commits",
  projects: "#projects",
  contact: "#deploy",
};

const StatusIcon = ({ passed }: { passed: boolean }) =>
  passed ? (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent">
      <CheckIcon className="h-3.5 w-3.5" />
    </span>
  ) : (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger/15 text-danger">
      <CrossIcon className="h-3.5 w-3.5" />
    </span>
  );

/** Checks list, the deploy terminal and the merge action (the contact finale). */
const MergeBox = (): React.ReactElement => {
  const t = useTranslations("pr.checks");
  const tc = useTranslations("contact");
  const { state, fixed, total, deployed, merged, merge, bypassAndMerge, reset } =
    useDebugMe();
  const failing = total - fixed;

  return (
    <section id="checks" aria-label={t("label")} className="relative scroll-mt-16">
      <TimelineEvent icon={<ChecksIcon />}>
        {t.rich("event", {
          bot: (chunks) => <span className="font-semibold text-fg">{chunks}</span>,
          count: total,
        })}
      </TimelineEvent>

      <div className="flex gap-3">
        <span className="relative z-10 hidden sm:block">
          <BotAvatar size="h-10 w-10" />
        </span>
        <div
          className={`box min-w-0 flex-1 overflow-hidden ${
            merged ? "border-merged/60" : deployed ? "border-accent/60" : "border-danger/50"
          }`}
        >
          <div className="flex items-start gap-3 border-b border-line p-4">
            <StatusIcon passed={deployed} />
            <div>
              <p role="status" className="font-semibold">
                {deployed ? t("allPassed") : t("someFailed")}
              </p>
              <p className="text-sm text-muted">
                {t("summary", { failing, passing: fixed })}
              </p>
            </div>
          </div>

          <ul className="divide-y divide-line border-b border-line">
            {BUG_IDS.map((id) => (
              <li key={id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <StatusIcon passed={state[id]} />
                <span className="min-w-0 flex-1">
                  <span className="font-mono font-semibold">ci / {id}</span>
                  <span className="text-muted">
                    {" — "}
                    {t(`items.${id}.${state[id] ? "passing" : "failing"}`)}
                  </span>
                </span>
                {!state[id] && (
                  <a
                    href={DETAILS_HREF[id]}
                    className="shrink-0 font-semibold text-link hover:underline"
                  >
                    {t("details")}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div id="deploy" className="scroll-mt-16 border-b border-line p-4">
            <ContactBug />
          </div>

          {merged ? (
            <div className="flex flex-col gap-5 p-5">
              <p className="flex items-center gap-2 text-lg font-semibold text-merged">
                <MergeIcon className="h-5 w-5" />
                {t("mergedTitle")}
              </p>
              <div>
                <h2 className="mb-2 text-[24px] font-semibold leading-tight md:text-[28px]">
                  {tc("heading")}
                </h2>
                <p className="mb-5 text-muted">{tc("subtitle")}</p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="btn btn-primary max-w-full break-all font-mono"
                >
                  <MailIcon />
                  {EMAIL}
                </a>
              </div>
              <blockquote className="border-l-4 border-line pl-4 text-sm italic text-muted">
                {tc("quote")} — Bill Gates
              </blockquote>
              <button type="button" onClick={reset} className="btn w-fit">
                {t("reset")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {deployed ? t("readyHint") : t("blockedHint")}
              </p>
              <div className="flex flex-wrap gap-2">
                {!deployed && (
                  <button
                    type="button"
                    onClick={bypassAndMerge}
                    className="btn border-merged/60 text-merged hover:border-merged"
                  >
                    {t("bypass")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={merge}
                  disabled={!deployed}
                  className="btn btn-primary"
                >
                  <MergeIcon />
                  {t("merge")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MergeBox;
