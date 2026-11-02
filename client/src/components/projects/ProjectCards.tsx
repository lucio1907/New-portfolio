import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Projects from "@/json/projects.json";
import Image from "next/image";
import { StaggerContainer } from "../motion/Reveal";
import HoverLiftCard from "../motion/HoverLiftCard";
import { ProjectSlot } from "@/features/debug-me/bugs/ProjectsBug";

type Locale = "es" | "en";

interface ProjectsTypes {
  id: number;
  projectName: string;
  description: Record<Locale, string>;
  image: string;
  techStack: string;
  codeLink: string;
  livePreview: string;
}

const ProjectCards = (): React.ReactElement => {
  const locale = useLocale() as Locale;
  const t = useTranslations("projects");

  return (
    <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Projects.projects.map((item: ProjectsTypes, index: number) => {
        const tags = item.techStack.split(",").map((tag) => tag.trim());

        return (
          <ProjectSlot key={item.id} index={index}>
            <HoverLiftCard className="brutal-card group flex flex-col overflow-hidden transition-shadow duration-150 hover:shadow-brutal-lg">
              <div className="relative aspect-[16/10] overflow-hidden border-b-3 border-ink bg-paper">
                <Image
                  src={item.image}
                  alt={item.projectName}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {!item.livePreview && (
                  <span className="sticker absolute right-3 top-3 rotate-6 bg-lilac font-mono text-xs">
                    API
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-xl font-bold leading-tight">
                  {item.projectName}
                </h3>
                <p className="mb-4 flex-1 text-[15px] leading-[1.6] text-ink-soft">
                  {item.description[locale]}
                </p>
                <ul className="mb-5 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag} className="brutal-chip bg-paper px-2.5 py-0.5 font-mono text-xs">
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  {item.livePreview && (
                    <a
                      href={item.livePreview}
                      target="_blank"
                      rel="noreferrer"
                      className="brutal-btn min-h-[42px] bg-yellow px-4 text-sm"
                    >
                      {t("liveLink")}
                    </a>
                  )}
                  <a
                    href={item.codeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="brutal-btn min-h-[42px] bg-white px-4 text-sm"
                  >
                    {t("codeLink")}
                  </a>
                </div>
              </div>
            </HoverLiftCard>
          </ProjectSlot>
        );
      })}
    </StaggerContainer>
  );
};

export default ProjectCards;
