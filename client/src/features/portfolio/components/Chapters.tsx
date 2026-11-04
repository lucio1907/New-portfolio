import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ProjectsData from "@/json/projects.json";
import ChapterScene from "../motion/ChapterScene";
import CrmScene from "../motion/CrmScene";
import { type Project, projectById } from "../lib/content";

const projects = ProjectsData.projects as Project[];

/** Projects that get their own launch. */
export const LAUNCHES = { nadira: 5, sitiohoy: 6 } as const;

/** Two lines that rise into place: the launch and what it spares you. */
const Headline = ({ first, second }: { first: string; second: string }) => (
  <h2 className="chapter-title display">
    <span className="rise-mask">
      <span data-rise>{first}</span>
    </span>
    <span className="rise-mask">
      <span data-rise>{second}</span>
    </span>
  </h2>
);

/** No screenshot yet, so the layers of the system are the picture. */
export const CrmChapter = () => {
  const t = useTranslations("chapters.crm");

  return (
    <CrmScene>
      <div className="chapter-head">
        <Headline first={t("first")} second={t("second")} />
      </div>
      <ol className="layers">
        {(t.raw("layers") as string[]).map((layer) => (
          <li key={layer} data-layer className="layer">
            {layer}
          </li>
        ))}
      </ol>
      <div className="chapter-foot">
        <p className="chapter-body">{t("body")}</p>
      </div>
    </CrmScene>
  );
};

type ProjectChapterProps = { name: keyof typeof LAUNCHES; offset?: boolean };

/** A launch with a real screenshot: full width, then it settles into a frame. */
export const ProjectChapter = ({ name, offset = false }: ProjectChapterProps) => {
  const t = useTranslations("chapters");
  const project = projectById(projects, LAUNCHES[name]);

  return (
    <ChapterScene offset={offset}>
      <div className="chapter-head">
        <Headline first={t(`${name}.first`)} second={t(`${name}.second`)} />
      </div>
      <div data-frame className="chapter-frame">
        <Image data-picture src={project.image} alt={project.projectName} fill sizes="100vw" className="object-cover" />
      </div>
      <div className="chapter-foot">
        <p className="chapter-body">{t(`${name}.body`)}</p>
        <p className="flex flex-wrap gap-x-6 gap-y-2 text-[16px]">
          <a href={project.livePreview} target="_blank" rel="noreferrer" className="text-link">
            {t("visit")}
            <span className="sr-only">: {project.projectName}</span>
          </a>
          {project.codeLink && (
            <a href={project.codeLink} target="_blank" rel="noreferrer" className="text-link">
              {t("code")}
              <span className="sr-only">: {project.projectName}</span>
            </a>
          )}
        </p>
      </div>
    </ChapterScene>
  );
};
