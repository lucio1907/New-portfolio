import React from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import ProjectsData from "@/json/projects.json";
import MoreScene from "../motion/MoreScene";
import { LAUNCHES } from "./Chapters";
import { type Locale, type Project, otherProjects } from "../lib/content";

const rows = otherProjects(ProjectsData.projects as Project[], Object.values(LAUNCHES)).reverse();

/** Newest first, as plain rows. A preview follows the cursor where there is one. */
const MoreProjects = () => {
  const t = useTranslations("more");
  const locale = useLocale() as Locale;

  return (
    <MoreScene>
      <h2 className="more-title display">{t("title")}</h2>
      <ul className="more-list">
        {rows.map((project) => (
          <li key={project.id} data-row={project.image ? project.id : undefined} className="more-row">
            <span data-rule aria-hidden="true" className="rule" />
            <h3 className="more-name">{project.projectName}</h3>
            <p className="text-[16px] leading-snug text-muted">{project.description[locale]}</p>
            <p className="more-links">
              {project.livePreview ? (
                <a href={project.livePreview} target="_blank" rel="noreferrer" className="text-link">
                  {t("demo")}
                  <span className="sr-only">: {project.projectName}</span>
                </a>
              ) : (
                <span className="text-muted">{t("apiOnly")}</span>
              )}
              <a href={project.codeLink} target="_blank" rel="noreferrer" className="text-link">
                {t("code")}
                <span className="sr-only">: {project.projectName}</span>
              </a>
            </p>
          </li>
        ))}
      </ul>
      <div data-preview aria-hidden="true" className="more-preview">
        {rows
          .filter((project) => project.image)
          .map((project) => (
            <Image key={project.id} data-preview-image={project.id} src={project.image} alt="" fill sizes="420px" className="object-cover opacity-0" />
          ))}
      </div>
    </MoreScene>
  );
};

export default MoreProjects;
