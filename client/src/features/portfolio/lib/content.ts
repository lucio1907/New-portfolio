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

/** Newest first, by the ISO-like `start` month. Does not mutate the input. */
export const sortByNewest = (items: readonly Experience[]): Experience[] =>
  [...items].sort((a, b) => b.start.localeCompare(a.start));

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
