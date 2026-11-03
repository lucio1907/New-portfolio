import ProjectsData from "@/json/projects.json";
import TechStackData from "@/json/techStack.json";
import {
  type Locale,
  type Project,
  countAdditions,
  projectSource,
  slugify,
  stackSource,
} from "./pullRequest";

export type DiffFile = {
  path: string;
  lines: string[];
  project?: Project;
};

const projects = ProjectsData.projects as Project[];

/** Every file shown in "Files changed": one markdown file per project + the stack. */
export const buildFiles = (locale: Locale): DiffFile[] => [
  ...projects.map((project) => ({
    path: `projects/${slugify(project.projectName)}.md`,
    lines: projectSource(project, locale),
    project,
  })),
  { path: "stack.json", lines: stackSource(TechStackData.categories) },
];

export const totalAdditions = (locale: Locale): number =>
  countAdditions(buildFiles(locale).map((file) => file.lines));
