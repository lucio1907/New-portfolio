import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Projects from "@/json/projects.json";
import Image from "next/image";
import { StaggerContainer } from "../motion/Reveal";
import { ExternalIcon, FileIcon } from "../pr/Icons";
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

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ProjectCards = (): React.ReactElement => {
  const locale = useLocale() as Locale;
  const t = useTranslations("projects");

  return (
    <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Projects.projects.map((item: ProjectsTypes, index: number) => {
        const tags = item.techStack.split(",").map((tag) => tag.trim());

        return (
          <ProjectSlot key={item.id} index={index}>
            <article className="box group flex flex-col overflow-hidden transition-colors duration-150 hover:border-muted/60">
              <div className="box-header justify-between font-mono text-[13px]">
                <span className="flex min-w-0 items-center gap-2">
                  <FileIcon className="h-4 w-4 text-muted" />
                  <span className="truncate">projects/{slugify(item.projectName)}.md</span>
                </span>
                {!item.livePreview && (
                  <span className="label-chip border-merged/50 text-merged">API</span>
                )}
              </div>
              <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-subtle">
                <Image
                  src={item.image}
                  alt={item.projectName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1.5 text-lg font-semibold leading-snug">
                  {item.projectName}
                </h3>
                <p className="mb-4 flex-1 text-[14.5px] leading-relaxed text-muted">
                  {item.description[locale]}
                </p>
                <ul className="mb-4 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <li key={tag} className="label-chip border-link/40 font-mono font-medium text-link">
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {item.livePreview && (
                    <a
                      href={item.livePreview}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary min-h-[36px] px-3"
                    >
                      {t("liveLink")}
                      <ExternalIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <a
                    href={item.codeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn min-h-[36px] px-3"
                  >
                    {t("codeLink")}
                    <ExternalIcon className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </article>
          </ProjectSlot>
        );
      })}
    </StaggerContainer>
  );
};

export default ProjectCards;
