"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import TechStackData from "@/json/techStack.json";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, PlayIcon } from "../Icons";
import { jobDuration } from "../../lib/pullRequest";

type Category = { id: number; key: string; items: string[] };

const categories = TechStackData.categories as Category[];

const SuccessIcon = () => (
  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3fb950] text-[#0d1117]">
    <CheckIcon className="h-3 w-3" />
  </span>
);

/** One expandable step of the selected job's log. */
const Step = ({
  name,
  seconds,
  lines,
  defaultOpen = false,
}: {
  name: string;
  seconds: number;
  lines?: string[];
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const expandable = Boolean(lines?.length);

  return (
    <li>
      <button
        type="button"
        disabled={!expandable}
        aria-expanded={expandable ? open : undefined}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 rounded-box px-3 py-2 text-left text-[13px] text-[#c9d1d9] hover:bg-white/5 disabled:cursor-default disabled:hover:bg-transparent"
      >
        {expandable ? (
          open ? <ChevronDownIcon className="h-3.5 w-3.5 text-[#8b949e]" /> : <ChevronRightIcon className="h-3.5 w-3.5 text-[#8b949e]" />
        ) : (
          <span className="w-3.5" />
        )}
        <SuccessIcon />
        <span className="flex-1">{name}</span>
        <span className="font-mono text-xs text-[#8b949e]">{seconds}s</span>
      </button>
      {open && lines && (
        <ol className="mb-2 ml-9 font-mono text-[12.5px] leading-6">
          {lines.map((line, index) => (
            <li key={line} className="grid grid-cols-[2.5rem_1fr] text-[#c9d1d9]">
              <span className="select-none pr-3 text-right text-[#6e7681]">{index + 1}</span>
              <span className="break-words">{line}</span>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
};

/** Checks tab: one CI job per stack category; its log lists the tech. */
const ChecksTab = (): React.ReactElement => {
  const t = useTranslations("pr.checks");
  const tc = useTranslations("techStack.categories");
  const [selected, setSelected] = useState(categories[0].key);
  const job = categories.find((category) => category.key === selected) ?? categories[0];
  const total = jobDuration(job.key);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
      <nav aria-label={t("jobsLabel")}>
        <p className="mb-2 flex items-center gap-2 px-2 text-sm font-semibold">
          <PlayIcon className="h-4 w-4 text-muted" />
          {t("workflow")}
          <span className="font-mono text-xs font-normal text-muted">{t("workflowFile")}</span>
        </p>
        <p className="mb-3 px-2 text-xs text-muted">{t("runs", { count: categories.length })}</p>
        <ul className="flex flex-col gap-0.5">
          {categories.map((category) => {
            const isActive = category.key === selected;
            return (
              <li key={category.key}>
                <button
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setSelected(category.key)}
                  className={`flex w-full items-center gap-2 rounded-box px-2 py-1.5 text-left text-sm transition-colors ${
                    isActive ? "bg-btn font-semibold" : "hover:bg-btn"
                  }`}
                >
                  <SuccessIcon />
                  <span className="flex-1 truncate">{tc(category.key)}</span>
                  <span className="font-mono text-xs text-muted">{jobDuration(category.key)}s</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logs always use the dark console look, like CI runners. */}
      <section aria-label={tc(job.key)} className="overflow-hidden rounded-box border border-line bg-[#010409]">
        <header className="border-b border-[#30363d] px-4 py-3">
          <h2 className="text-base font-semibold text-[#e6edf3]">{tc(job.key)}</h2>
          <p className="text-xs text-[#8b949e]">{t("succeeded", { seconds: total })}</p>
        </header>
        <ol key={job.key} className="p-2">
          <Step name={t("setup")} seconds={1} />
          <Step name={t("checkout")} seconds={2} />
          <Step
            name={t("install", { name: tc(job.key) })}
            seconds={Math.max(1, total - 4)}
            lines={job.items.map((item) => `✓ ${item}`)}
            defaultOpen
          />
          <Step name={t("complete")} seconds={1} />
        </ol>
      </section>
    </div>
  );
};

export default ChecksTab;
