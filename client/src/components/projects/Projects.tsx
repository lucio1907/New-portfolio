import React from "react";
import { useTranslations } from "next-intl";
import ProjectCards from "./ProjectCards";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeIn } from "@/components/motion/Reveal";
import ProjectsBug from "@/features/debug-me/bugs/ProjectsBug";
import ProjectsData from "@/json/projects.json";

const Projects = (): React.ReactElement => {
  const t = useTranslations("projects");

  return (
    <section
      id="proyectos"
      className="mx-auto max-w-[1240px] scroll-mt-28 px-5 py-24 md:px-10"
    >
      <SectionHeader number="03" label={t("label")} color="bg-green" />
      <FadeIn>
        <p className="mb-10 max-w-[560px] text-lg font-medium text-ink-soft">
          {t("subtitle")}
        </p>
      </FadeIn>

      <ProjectsBug cardCount={ProjectsData.projects.length}>
        <ProjectCards />
      </ProjectsBug>

      <FadeIn>
        <p className="mt-14 text-center font-mono text-sm font-bold text-ink-soft">
          {t("comingSoon")}
        </p>
      </FadeIn>
    </section>
  );
};

export default Projects;
