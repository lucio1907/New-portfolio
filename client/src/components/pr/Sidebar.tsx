"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDebugMe } from "@/features/debug-me/useDebugMe";
import { AUTHOR } from "./TopBar";
import { EMAIL } from "./PrHeader";
import { CheckIcon, ExternalIcon, MailIcon, PhoneIcon } from "./Icons";

const LABELS = [
  { key: "fullStack", className: "border-link/50 text-link" },
  { key: "aiNative", className: "border-merged/50 text-merged" },
  { key: "openToWork", className: "border-accent/50 text-accent" },
  { key: "remote", className: "border-attention/50 text-attention" },
] as const;

const LINKS = [
  { key: "github", href: "https://github.com/lucio1907", value: "@lucio1907" },
  { key: "linkedin", href: "https://www.linkedin.com/in/luciogastellu/", value: "luciogastellu" },
  { key: "twitter", href: "https://x.com/Lu_Gastellu", value: "@Lu_Gastellu" },
] as const;

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-line pb-4 last:border-b-0">
    <h2 className="mb-2.5 text-xs font-semibold text-muted">{title}</h2>
    {children}
  </div>
);

/** PR sidebar: reviewer, assignee, labels, milestone (progress) and contact. */
const Sidebar = (): React.ReactElement => {
  const t = useTranslations("pr.sidebar");
  const tr = useTranslations("contact.rows");
  const { fixed, total, merged } = useDebugMe();
  const percent = Math.round((fixed / total) * 100);

  return (
    <aside aria-label={t("label")} className="flex flex-col gap-4 text-sm lg:sticky lg:top-16 lg:self-start">
      <Block title={t("reviewers")}>
        <p className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-subtle text-[10px] font-bold"
            >
              ?
            </span>
            {t("you")}
          </span>
          {merged ? (
            <span className="flex items-center gap-1 text-accent">
              <CheckIcon className="h-3.5 w-3.5" />
              {t("approved")}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-attention">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-attention" />
              {t("pending")}
            </span>
          )}
        </p>
      </Block>

      <Block title={t("assignees")}>
        <p className="flex items-center gap-2">
          <Image
            src="/MeMemoji.webp"
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 rounded-full bg-subtle object-cover"
          />
          <span className="font-semibold">{AUTHOR}</span>
        </p>
      </Block>

      <Block title={t("labels")}>
        <ul className="flex flex-wrap gap-1.5">
          {LABELS.map((label) => (
            <li key={label.key} className={`label-chip ${label.className}`}>
              {t(`labelNames.${label.key}`)}
            </li>
          ))}
        </ul>
      </Block>

      <Block title={t("milestone")}>
        <p className="mb-2 font-semibold">{t("milestoneName")}</p>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={fixed}
          aria-label={t("progress", { fixed, total })}
          className="h-2 overflow-hidden rounded-full bg-subtle"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted">{t("progress", { fixed, total })}</p>
      </Block>

      <Block title={t("contact")}>
        <ul className="flex flex-col gap-2">
          <li>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 break-all text-link hover:underline">
              <MailIcon className="h-4 w-4 text-muted" />
              {EMAIL}
            </a>
          </li>
          <li>
            <a href="tel:+543329402087" className="flex items-center gap-2 text-link hover:underline">
              <PhoneIcon className="h-4 w-4 text-muted" />
              +54 3329 402087
            </a>
          </li>
          {LINKS.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-link hover:underline"
              >
                <ExternalIcon className="h-4 w-4 text-muted" />
                <span>
                  <span className="text-muted">{tr(link.key)}: </span>
                  {link.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Block>
    </aside>
  );
};

export default Sidebar;
