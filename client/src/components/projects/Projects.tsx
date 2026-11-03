import React from "react";
import { useTranslations } from "next-intl";
import ProjectCards from "./ProjectCards";
import ProjectsBug from "@/features/debug-me/bugs/ProjectsBug";
import ProjectsData from "@/json/projects.json";

/** Projects rendered as added markdown files in the diff. */
const Projects = (): React.ReactElement => {
  const t = useTranslations("projects");

  return (
    <div id="projects" className="scroll-mt-16">
      <h2 className="mb-1 text-lg font-semibold">{t("label")}</h2>
      <p className="mb-4 text-sm text-muted">{t("subtitle")}</p>

      <ProjectsBug cardCount={ProjectsData.projects.length}>
        <ProjectCards />
      </ProjectsBug>

      <p className="mt-6 font-mono text-sm text-muted">{t("comingSoon")}</p>
    </div>
  );
};

export default Projects;
