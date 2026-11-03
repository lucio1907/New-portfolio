"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import WorkExperiences from "@/json/experiencies.json";
import { AuthorAvatar, Strong } from "../Timeline";
import { CheckIcon, CommitIcon, CopyIcon, KebabIcon } from "../Icons";
import { AUTHOR } from "../../lib/constants";
import {
  type Experience,
  type Locale,
  commitGroups,
  shortSha,
} from "../../lib/pullRequest";

const experiences = WorkExperiences.experiencies as Experience[];

/** 40-char deterministic SHA for the clipboard; starts with the short one. */
const fullSha = (seed: string) =>
  [seed, ...Array.from({ length: 5 }, (_, index) => `${seed}#${index}`)]
    .map(shortSha)
    .join("")
    .slice(0, 40);

const CommitRow = ({ item, locale }: { item: Experience; locale: Locale }) => {
  const t = useTranslations("pr.commits");
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const seed = `${item.company}-${item.start}`;
  const bodyId = `commit-body-${item.id}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullSha(seed));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the SHA stays visible next to the button.
    }
  };

  return (
    <li className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">
            {item.position[locale]} @ {item.company}
          </span>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bodyId}
            aria-label={open ? t("less") : t("more")}
            title={open ? t("less") : t("more")}
            onClick={() => setOpen((value) => !value)}
            className="flex h-5 items-center rounded-md bg-btn px-1.5 text-muted hover:bg-btn-hover hover:text-fg"
          >
            <KebabIcon className="h-3.5 w-3.5" />
          </button>
        </p>
        {open && (
          <ul id={bodyId} className="mt-2 flex animate-fade-in flex-col gap-1 border-l-2 border-line-muted pl-3 font-mono text-[12.5px] text-muted">
            {item.highlights[locale].map((highlight) => (
              <li key={highlight}>- {highlight}</li>
            ))}
          </ul>
        )}
        <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <AuthorAvatar size={16} />
          {t.rich("authored", {
            author: Strong,
            authorName: AUTHOR,
            modality: item.workModality,
            country: item.country,
          })}
          <span>· {item.timelapse[locale]}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="label border-success-fg/50 text-success-fg">{t("verified")}</span>
        <span className="flex">
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? t("copied") : t("copy")}
            title={copied ? t("copied") : t("copy")}
            className="btn btn-sm rounded-r-none"
          >
            {copied ? (
              <CheckIcon className="h-3.5 w-3.5 text-success-fg" />
            ) : (
              <CopyIcon className="h-3.5 w-3.5" />
            )}
          </button>
          <code className="btn btn-sm -ml-px cursor-default rounded-l-none font-mono text-link hover:bg-btn">
            {shortSha(seed)}
          </code>
        </span>
      </div>
    </li>
  );
};

/** Commits tab: experience as commits, grouped by start month, newest first. */
const CommitsTab = (): React.ReactElement => {
  const t = useTranslations("pr.commits");
  const locale = useLocale() as Locale;
  const groups = commitGroups(experiences, locale);

  return (
    <div className="relative pl-8 before:absolute before:bottom-0 before:left-[7px] before:top-0 before:w-[2px] before:bg-line-muted">
      {groups.map((group) => (
        <section key={group.label} className="pb-6">
          <h2 className="relative flex items-center gap-2 py-2 text-sm text-muted">
            <span className="absolute -left-8 flex h-4 w-4 items-center justify-center bg-canvas">
              <CommitIcon className="h-4 w-4" />
            </span>
            {t("group", { date: group.label })}
          </h2>
          <ol className="box divide-y divide-line-muted">
            {group.items.map((item) => (
              <CommitRow key={item.id} item={item} locale={locale} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
};

export default CommitsTab;
