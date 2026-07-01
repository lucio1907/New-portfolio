import React from "react";
import { useTranslations } from "next-intl";
import ProjectCards from "./ProjectCards";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeIn } from "@/components/motion/Reveal";

const Projects = (): React.ReactElement => {
  const t = useTranslations("projects");

  return (
    <section
      id="proyectos"
      className="mx-auto max-w-[1200px] scroll-mt-20 px-5 py-[100px] md:px-10"
    >
      <SectionHeader number="03" label={t("label")} />
      <FadeIn>
        <p className="mb-12 max-w-[520px] text-lg text-muted">
          {t("subtitle")}
        </p>
      </FadeIn>

      <ProjectCards />

      <FadeIn>
        <p className="mt-10 text-center font-mono text-[13px] text-faint">
          {t("comingSoon")}
        </p>
      </FadeIn>
    </section>
  );
};

export default Projects;
