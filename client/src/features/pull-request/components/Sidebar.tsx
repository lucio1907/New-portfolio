import React from "react";
import { useTranslations } from "next-intl";
import { AuthorAvatar, VisitorAvatar } from "./Timeline";
import { CheckIcon, ExternalIcon, IssueIcon, MailIcon, PhoneIcon } from "./Icons";
import { AUTHOR, EMAIL, PHONE, SOCIAL_LINKS } from "../lib/constants";

export const LABELS = [
  { key: "fullStack", className: "border-link/40 bg-link/10 text-link" },
  { key: "aiNative", className: "border-done-fg/40 bg-done-fg/10 text-done-fg" },
  { key: "openToWork", className: "border-success-fg/40 bg-success-fg/10 text-success-fg" },
  { key: "remote", className: "border-attention/40 bg-attention/10 text-attention" },
] as const;

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-b border-line-muted pb-4 pt-1 last:border-b-0">
    <h2 className="mb-2 text-xs font-semibold text-muted">{title}</h2>
    {children}
  </div>
);

type SidebarProps = { merged: boolean };

/** Right column of the conversation: reviewers, labels, milestone, contact. */
const Sidebar = ({ merged }: SidebarProps): React.ReactElement => {
  const t = useTranslations("pr.sidebar");
  const tr = useTranslations("contact.rows");

  return (
    <aside aria-label={t("label")} className="flex flex-col gap-3 text-sm">
      <Block title={t("reviewers")}>
        <p className="flex items-center gap-2">
          <VisitorAvatar size={20} className="text-[10px]" />
          <span className="font-semibold">{t("you")}</span>
          {merged ? (
            <CheckIcon className="ml-auto h-4 w-4 text-success-fg" />
          ) : (
            <span aria-hidden="true" className="ml-auto h-2 w-2 rounded-full bg-attention" />
          )}
        </p>
        {!merged && <p className="mt-1.5 text-xs text-muted">{t("awaiting")}</p>}
      </Block>

      <Block title={t("assignees")}>
        <p className="flex items-center gap-2">
          <AuthorAvatar size={20} />
          <span className="font-semibold">{AUTHOR}</span>
        </p>
      </Block>

      <Block title={t("labels")}>
        <ul className="flex flex-wrap gap-1">
          {LABELS.map((label) => (
            <li key={label.key} className={`label ${label.className}`}>
              {t(`labelNames.${label.key}`)}
            </li>
          ))}
        </ul>
      </Block>

      <Block title={t("milestone")}>
        <p className="mb-1.5 font-semibold">{t("milestoneName")}</p>
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-line-muted">
          <div
            className={`h-full rounded-full bg-success-fg transition-[width] duration-500 ${merged ? "w-full" : "w-4/5"}`}
          />
        </div>
      </Block>

      <Block title={t("development")}>
        <p className="mb-1.5 text-xs text-muted">{t("developmentText")}</p>
        <p className="flex items-center gap-1.5">
          <IssueIcon className={`h-4 w-4 ${merged ? "text-done-fg" : "text-success-fg"}`} />
          <span className="font-semibold">{t("issue")}</span>
          <span className="text-muted">#1</span>
        </p>
      </Block>

      <Block title={t("contact")}>
        <ul className="flex flex-col gap-1.5">
          <li>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 break-all text-link hover:underline">
              <MailIcon className="h-4 w-4 shrink-0 text-muted" />
              {EMAIL}
            </a>
          </li>
          <li>
            <a href={PHONE.href} className="flex items-center gap-2 text-link hover:underline">
              <PhoneIcon className="h-4 w-4 text-muted" />
              {PHONE.label}
            </a>
          </li>
          {SOCIAL_LINKS.map((link) => (
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
