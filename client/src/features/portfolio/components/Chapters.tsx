import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ProjectsData from "@/json/projects.json";
import ChapterScene from "../motion/ChapterScene";
import CrmScene from "../motion/CrmScene";
import RiseTitle from "./RiseTitle";
import { type Project, projectById } from "../lib/content";

const projects = ProjectsData.projects as Project[];

/** Projects that get their own launch. */
export const LAUNCHES = { nadira: 5, sitiohoy: 6 } as const;

/** No screenshot yet, so the layers of the system are the picture. */
export const CrmChapter = () => {
  const t = useTranslations("chapters.crm");

  return (
    <CrmScene>
      <div className="chapter-head">
        <RiseTitle className="chapter-title" lines={[t("first"), t("second")]} />
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

/** A launch with a real screenshot, which lifts and grows into place as it arrives. */
export const ProjectChapter = ({ name, offset = false }: ProjectChapterProps) => {
  const t = useTranslations("chapters");
  const project = projectById(projects, LAUNCHES[name]);

  return (
    <ChapterScene offset={offset}>
      <div className="chapter-head">
        <RiseTitle className="chapter-title" lines={[t(`${name}.first`), t(`${name}.second`)]} />
      </div>
      <div data-frame className="chapter-frame">
        {/*
          The desktop sizes are about twice the frame on purpose: a picture only
          slightly larger than its frame blurs when resampled, and small text in a
          screenshot shows it. The cap matches an optimizer width, so standard
          screens get 2048 rather than jumping to the next one, 3840.
        */}
        <Image
          data-picture
          src={project.image}
          alt={project.projectName}
          fill
          sizes="(min-width: 768px) min(142vw, 2048px), 100vw"
          quality={90}
          className="object-cover"
        />
      </div>
      <div className="chapter-foot">
        <p className="chapter-body">{t(`${name}.body`)}</p>
        <p className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
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
