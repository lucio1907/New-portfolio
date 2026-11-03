import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import ProjectsData from "@/json/projects.json";
import Section from "./Section";
import { type Locale, type Project, projectTags, slugify } from "../lib/content";

const projects = ProjectsData.projects as Project[];

/** Projects as a list of rows (image, what it is, stack, links). */
const Projects = () => {
  const t = useTranslations("site");
  const locale = useLocale() as Locale;

  return (
    <Section id="projects" title={t("sections.projects")} intro={t("projects.intro")}>
      <ul className="max-w-[40rem] divide-y divide-orbit/70 border-y border-orbit/70">
        {projects.map((project) => {
          const slug = slugify(project.projectName);
          return (
            <li
              key={project.id}
              id={`project-${slug}`}
              data-project={slug}
              className="grid gap-4 py-6 sm:grid-cols-[176px_minmax(0,1fr)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-deep">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 176px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-[19px] font-medium leading-snug">{project.projectName}</h3>
                <p className="mt-1 text-[15.5px] text-haze">{project.description[locale]}</p>
                <p className="mt-2 text-sm text-haze">
                  {projectTags(project).join(", ")}
                </p>
                <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
                  {project.livePreview ? (
                    <a href={project.livePreview} target="_blank" rel="noreferrer" className="link">
                      {t("projects.demo")}
                      <span className="sr-only">: {project.projectName}</span>
                    </a>
                  ) : (
                    <span className="text-haze">{t("projects.apiOnly")}</span>
                  )}
                  <a href={project.codeLink} target="_blank" rel="noreferrer" className="link">
                    {t("projects.code")}
                    <span className="sr-only">: {project.projectName}</span>
                  </a>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-sm text-haze">{t("projects.more")}</p>
    </Section>
  );
};

export default Projects;
