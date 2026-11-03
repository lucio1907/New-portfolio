import React from "react";
import { useTranslations } from "next-intl";
import TechStack from "@/components/stack/TechStack";
import Projects from "@/components/projects/Projects";
import TechStackData from "@/json/techStack.json";
import ProjectsData from "@/json/projects.json";
import TimelineEvent from "./TimelineEvent";
import { FileIcon } from "./Icons";
import { AUTHOR } from "./TopBar";

/** Files changed tab: tech stack and projects as added files. */
const FilesChanged = (): React.ReactElement => {
  const t = useTranslations("pr.files");
  const count = TechStackData.categories.length + ProjectsData.projects.length;

  return (
    <section id="files" aria-label={t("label")} className="relative scroll-mt-16">
      <TimelineEvent icon={<FileIcon />}>
        {t.rich("event", {
          author: (chunks) => <span className="font-semibold text-fg">{chunks}</span>,
          authorName: AUTHOR,
          count,
        })}
      </TimelineEvent>
      <div className="flex flex-col gap-12">
        <TechStack />
        <Projects />
      </div>
    </section>
  );
};

export default FilesChanged;
