import React from "react";
import { useTranslations } from "next-intl";
import Experiencies from "@/components/aboutme/Experiencies";
import WorkExperiences from "@/json/experiencies.json";
import TimelineEvent from "./TimelineEvent";
import { CommitIcon } from "./Icons";
import { AUTHOR } from "./TopBar";

/** Commits tab: the work experience, newest commit first. */
const Commits = (): React.ReactElement => {
  const t = useTranslations("pr.commits");

  return (
    <section id="commits" aria-label={t("label")} className="relative scroll-mt-16">
      <TimelineEvent icon={<CommitIcon />}>
        {t.rich("event", {
          author: (chunks) => <span className="font-semibold text-fg">{chunks}</span>,
          authorName: AUTHOR,
          count: WorkExperiences.experiencies.length,
        })}
      </TimelineEvent>
      <Experiencies />
    </section>
  );
};

export default Commits;
