import React from "react";
import { useTranslations } from "next-intl";
import ProjectsData from "@/json/projects.json";
import { BotAvatar, TimelineComment } from "../Timeline";
import { CheckIcon, ExternalIcon } from "../Icons";
import type { Project } from "../../lib/pullRequest";

const projects = ProjectsData.projects as Project[];

/** Deploy bot comment with the preview table: the projects, ready to visit. */
const PreviewBotComment = (): React.ReactElement => {
  const t = useTranslations("pr.conversation");

  return (
    <TimelineComment
      avatar={<BotAvatar />}
      header={
        <>
          <span className="md:hidden">
            <BotAvatar size={20} />
          </span>
          <span className="font-semibold">{t("bot")}</span>
          <span className="label border-line text-muted">{t("botBadge")}</span>
          <span className="text-muted">{t("commented")}</span>
        </>
      }
    >
      <p className="mb-3 text-[15px]">{t("botIntro")}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="text-left">
              {(["name", "status", "preview", "code"] as const).map((column) => (
                <th key={column} className="border border-line bg-subtle px-3 py-1.5 font-semibold">
                  {t(`table.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="even:bg-subtle/50">
                <td className="border border-line px-3 py-1.5 font-semibold">
                  {project.projectName}
                </td>
                <td className="border border-line px-3 py-1.5">
                  <span className="flex items-center gap-1.5 text-success-fg">
                    <CheckIcon className="h-3.5 w-3.5" />
                    {project.livePreview ? t("ready") : t("apiOnly")}
                  </span>
                </td>
                <td className="border border-line px-3 py-1.5">
                  {project.livePreview ? (
                    <a
                      href={project.livePreview}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-link hover:underline"
                    >
                      {t("visit")}
                      <ExternalIcon className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="border border-line px-3 py-1.5">
                  <a
                    href={project.codeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-link hover:underline"
                  >
                    {t("viewCode")}
                    <ExternalIcon className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TimelineComment>
  );
};

export default PreviewBotComment;
