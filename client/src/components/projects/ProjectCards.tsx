import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Projects from "@/json/projects.json";
import Image from "next/image";
import { StaggerContainer } from "../motion/Reveal";
import HoverLiftCard from "../motion/HoverLiftCard";

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
    <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Projects.projects.map((item: ProjectsTypes) => {
        const tags = item.techStack.split(",").map((tag) => tag.trim());

        return (
          <HoverLiftCard
            key={item.id}
            className="card-surface group flex flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 ease-out hover:border-border-hover hover:shadow-card"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-border-soft">
              <Image
                src={item.image}
                alt={item.projectName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {!item.livePreview && (
                <span className="absolute right-3 top-3 rounded-[5px] border border-accent/40 px-[7px] py-[3px] font-mono text-[10px] text-accent">
                  API
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-[22px]">
              <h3 className="mb-2.5 text-[19px] font-semibold text-foreground">
                {item.projectName}
              </h3>
              <p className="mb-[18px] flex-1 text-[14.5px] leading-[1.6] text-muted">
                {item.description[locale]}
              </p>
              <div className="mb-5 flex flex-wrap gap-[7px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[6px] border border-white/10 px-[9px] py-1 font-mono text-[11px] text-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-[18px]">
                {item.livePreview && (
                  <a
                    href={item.livePreview}
                    target="_blank"
                    className="font-mono text-[12.5px] text-accent"
                  >
                    {t("liveLink")}
                  </a>
                )}
                <a
                  href={item.codeLink}
                  target="_blank"
                  className="font-mono text-[12.5px] text-dim"
                >
                  {t("codeLink")}
                </a>
              </div>
            </div>
          </HoverLiftCard>
        );
      })}
    </StaggerContainer>
  );
};

export default ProjectCards;
