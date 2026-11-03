"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CodeIcon,
  ExternalIcon,
  FileIcon,
  FolderIcon,
} from "../Icons";
import { type Locale, type Project, slugify } from "../../lib/pullRequest";
import { type DiffFile, buildFiles } from "../../lib/files";

const fileAnchor = (path: string) => `file-${slugify(path)}`;

const DiffBlocks = ({ count }: { count: number }) => (
  <span className="flex items-center gap-1.5 font-mono text-xs font-semibold">
    <span className="text-success-fg">+{count}</span>
    <span aria-hidden="true" className="flex gap-px">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className="h-2 w-2 rounded-[1px] bg-success-fg" />
      ))}
    </span>
  </span>
);

const SourceDiff = ({ lines }: { lines: string[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse font-mono text-[12.5px] leading-5">
      <tbody>
        {lines.map((line, index) => (
          <tr key={index} className="bg-diff-add">
            <td className="w-12 select-none bg-diff-add-num px-2 text-right text-muted">{index + 1}</td>
            <td className="w-5 select-none text-center text-success-fg">+</td>
            <td className="whitespace-pre pr-4">{line || " "}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RichProject = ({ project, locale }: { project: Project; locale: Locale }) => {
  const t = useTranslations("pr.conversation");
  const tags = project.techStack.split(",").map((tag) => tag.trim());

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,240px)_1fr]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-box border border-line bg-subtle">
        <Image
          src={project.image}
          alt={project.projectName}
          fill
          sizes="(max-width: 640px) 100vw, 240px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h3 className="mb-1 border-b border-line-muted pb-1.5 text-[20px] font-semibold">
          {project.projectName}
        </h3>
        <p className="mb-3 text-[15px] leading-relaxed">{project.description[locale]}</p>
        <ul className="mb-3 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <li key={tag} className="label border-link/40 bg-link/10 text-link">
              {tag}
            </li>
          ))}
        </ul>
        <p className="flex flex-wrap gap-2">
          {project.livePreview && (
            <a href={project.livePreview} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
              {t("visit")}
              <ExternalIcon className="h-3 w-3" />
            </a>
          )}
          <a href={project.codeLink} target="_blank" rel="noreferrer" className="btn btn-sm">
            {t("viewCode")}
            <ExternalIcon className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
};

/** Files changed tab: file tree, viewed state and rich/source diffs. */
const FilesTab = (): React.ReactElement => {
  const t = useTranslations("pr.files");
  const locale = useLocale() as Locale;
  const files = buildFiles(locale);
  const [filter, setFilter] = useState("");
  const [viewed, setViewed] = useState<ReadonlySet<string>>(new Set());
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const [source, setSource] = useState<ReadonlySet<string>>(new Set());

  const setShowSource = (path: string, value: boolean) =>
    setSource((current) => {
      const next = new Set(current);
      if (value) next.add(path);
      else next.delete(path);
      return next;
    });

  const toggle = (set: ReadonlySet<string>, path: string) => {
    const next = new Set(set);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    return next;
  };

  const markViewed = (path: string) => {
    const nowViewed = !viewed.has(path);
    setViewed(toggle(viewed, path));
    // Like on code hosts, marking a file as viewed folds it away.
    setCollapsed((current) => {
      const next = new Set(current);
      if (nowViewed) next.add(path);
      else next.delete(path);
      return next;
    });
  };

  const query = filter.trim().toLowerCase();
  const visible = files.filter((file) => file.path.toLowerCase().includes(query));
  const projectFiles = visible.filter((file) => file.project);
  const rootFiles = visible.filter((file) => !file.project);

  const treeLink = (file: DiffFile, nested: boolean) => (
    <li key={file.path}>
      <a
        href={`#${fileAnchor(file.path)}`}
        className={`flex items-center gap-2 rounded-box py-1 pr-2 text-sm hover:bg-btn ${nested ? "pl-7" : "pl-2"}`}
      >
        <FileIcon className="h-4 w-4 text-muted" />
        <span className={`truncate ${viewed.has(file.path) ? "text-muted line-through" : ""}`}>
          {file.path.split("/").pop()}
        </span>
      </a>
    </li>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={t("filter")}
          aria-label={t("filter")}
          className="h-8 w-full rounded-box border border-line bg-inset px-3 text-sm text-fg placeholder:text-muted focus:border-link focus:outline-none sm:w-64"
        />
        <p className="flex items-center gap-2 text-xs text-muted">
          <span aria-hidden="true" className="h-1.5 w-24 overflow-hidden rounded-full bg-line-muted">
            <span
              className="block h-full bg-success-fg transition-[width] duration-300"
              style={{ width: `${(viewed.size / files.length) * 100}%` }}
            />
          </span>
          {t("viewedCount", { viewed: viewed.size, total: files.length })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav aria-label={t("tree")} className="hidden lg:block">
          <ul className="sticky top-16 flex flex-col">
            {projectFiles.length > 0 && (
              <li>
                <p className="flex items-center gap-2 px-2 py-1 text-sm">
                  <ChevronDownIcon className="h-3.5 w-3.5 text-muted" />
                  <FolderIcon className="h-4 w-4 text-link" />
                  projects
                </p>
                <ul>{projectFiles.map((file) => treeLink(file, true))}</ul>
              </li>
            )}
            {rootFiles.map((file) => treeLink(file, false))}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-4">
          {visible.length === 0 && <p className="text-sm text-muted">{t("noMatch")}</p>}
          {visible.map((file) => {
            const isCollapsed = collapsed.has(file.path);
            const showSource = !file.project || source.has(file.path);
            const bodyId = `${fileAnchor(file.path)}-body`;
            return (
              <section
                key={file.path}
                id={fileAnchor(file.path)}
                aria-label={file.path}
                className="box scroll-mt-16"
              >
                <div className={`flex flex-wrap items-center gap-2 bg-subtle px-2 py-1.5 ${isCollapsed ? "rounded-box" : "rounded-t-box border-b border-line"}`}>
                  <button
                    type="button"
                    aria-expanded={!isCollapsed}
                    aria-controls={bodyId}
                    aria-label={file.path}
                    onClick={() => setCollapsed(toggle(collapsed, file.path))}
                    className="flex h-7 w-7 items-center justify-center rounded-box text-muted hover:bg-btn"
                  >
                    {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                  </button>
                  <DiffBlocks count={file.lines.length} />
                  <code className="min-w-0 flex-1 truncate font-mono text-[13px] font-semibold">{file.path}</code>
                  {file.project && (
                    <span className="flex">
                      <button
                        type="button"
                        aria-pressed={showSource}
                        title={t("source")}
                        aria-label={t("source")}
                        onClick={() => setShowSource(file.path, true)}
                        className={`btn btn-sm rounded-r-none ${showSource ? "bg-btn-hover" : ""}`}
                      >
                        <CodeIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-pressed={!showSource}
                        title={t("rich")}
                        aria-label={t("rich")}
                        onClick={() => setShowSource(file.path, false)}
                        className={`btn btn-sm -ml-px rounded-l-none ${!showSource ? "bg-btn-hover" : ""}`}
                      >
                        <FileIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  )}
                  <label className="btn btn-sm cursor-pointer gap-1.5">
                    <input
                      type="checkbox"
                      checked={viewed.has(file.path)}
                      onChange={() => markViewed(file.path)}
                      className="h-3.5 w-3.5 accent-[rgb(var(--c-link))]"
                    />
                    {t("viewed")}
                  </label>
                </div>
                {!isCollapsed && (
                  <div id={bodyId}>
                    {showSource || !file.project ? (
                      <SourceDiff lines={file.lines} />
                    ) : (
                      <RichProject project={file.project} locale={locale} />
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilesTab;
