/**
 * Pure content helpers for the portfolio. Deterministic so server and client
 * renders always match.
 */

export type Locale = "es" | "en";

export type Experience = {
  id: number;
  start: string;
  company: string;
  country: string;
  position: Record<Locale, string>;
  workModality: string;
  timelapse: Record<Locale, string>;
  highlights: Record<Locale, string[]>;
};

export type Project = {
  id: number;
  projectName: string;
  description: Record<Locale, string>;
  image: string;
  techStack: string;
  codeLink: string;
  livePreview: string;
};

/** Oldest first, by the ISO-like `start` month. Does not mutate the input. */
export const sortByOldest = (items: readonly Experience[]): Experience[] =>
  [...items].sort((a, b) => a.start.localeCompare(b.start));

/** Where a period like "Dic 2023 - Jul 2024" begins. */
export const periodStart = (period: string): string => period.split(" - ")[0];

export const projectById = (projects: readonly Project[], id: number): Project => {
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error(`No project with id ${id}`);
  return project;
};

/** Everything that does not get its own launch, in the same order. */
export const otherProjects = (projects: readonly Project[], launches: readonly number[]): Project[] =>
  projects.filter((project) => !launches.includes(project.id));

export const slugify = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const mailtoHref = (to: string, subject: string, body: string): string =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Comma-separated tech list from projects.json → trimmed tags. */
export const projectTags = (project: Project): string[] =>
  project.techStack
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
