import React from "react";
import { useTranslations } from "next-intl";
import { AuthorAvatar, TimelineComment } from "../Timeline";
import { CheckIcon, KebabIcon } from "../Icons";
import { AUTHOR } from "../../lib/constants";

type EducationEntry = { title: string; place: string; period: string };

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 mt-6 border-b border-line-muted pb-1.5 text-[20px] font-semibold first:mt-0">
    {children}
  </h2>
);

/** The PR description written by the author: who Lucio is. */
const Description = (): React.ReactElement => {
  const t = useTranslations("pr.conversation");
  const ta = useTranslations("about");
  const tasks = t.raw("tasks") as string[];
  const education = ta.raw("education") as EducationEntry[];

  return (
    <TimelineComment
      avatar={<AuthorAvatar />}
      header={
        <>
          <span className="flex items-center gap-2 md:hidden">
            <AuthorAvatar size={20} />
          </span>
          <span className="font-semibold">{AUTHOR}</span>
          <span className="text-muted">{t("commented")}</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="label border-line text-muted">{t("owner")}</span>
            <KebabIcon className="h-4 w-4 text-muted" />
          </span>
        </>
      }
    >
      <div className="text-[15px] leading-relaxed">
        <p className="mb-1 font-mono text-[13px] text-success-fg">{t("role")}</p>
        <p className="mb-5 flex items-center gap-2 text-sm text-muted">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-success-fg" />
          {t("availability")}
        </p>

        <H2>{t("summary")}</H2>
        <p className="mb-3 font-semibold">{ta("heading")}</p>
        <p className="mb-3">{ta("bio1")}</p>
        <p>{ta("bio2")}</p>

        <H2>{t("included")}</H2>
        <ul className="flex flex-col gap-1.5">
          {tasks.map((task) => (
            <li key={task} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-link text-white"
              >
                <CheckIcon className="h-3 w-3" />
              </span>
              {task}
            </li>
          ))}
        </ul>

        <H2>{ta("educationLabel")}</H2>
        <ul className="flex list-disc flex-col gap-1 pl-6 marker:text-muted">
          {education.map((entry) => (
            <li key={entry.title}>
              <span className="font-semibold">{entry.title}</span>
              <span className="text-muted">
                {" "}
                · {entry.place} · <code className="font-mono text-[13px]">{entry.period}</code>
              </span>
            </li>
          ))}
        </ul>

        <H2>{ta("languagesLabel")}</H2>
        <p>{ta("languages")}</p>
      </div>
    </TimelineComment>
  );
};

export default Description;
