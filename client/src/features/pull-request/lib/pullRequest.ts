/**
 * Pure helpers behind the pull-request page. Everything here is deterministic
 * so server and client renders always match.
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

export const TAB_IDS = ["conversation", "commits", "checks", "files"] as const;
export type TabId = (typeof TAB_IDS)[number];

const fnv1a = (seed: string): number => {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/** 7-char "commit hash" derived from a seed. */
export const shortSha = (seed: string): string =>
  fnv1a(seed).toString(16).padStart(8, "0").slice(0, 7);

/** CI job duration in seconds (6–45) derived from a seed. */
export const jobDuration = (seed: string): number => 6 + (fnv1a(seed) % 40);

export const slugify = (name: string): string =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const tabFromHash = (hash: string): TabId => {
  const id = hash.replace(/^#/, "");
  return (TAB_IDS as readonly string[]).includes(id) ? (id as TabId) : "conversation";
};

/** Newest first, by the ISO-like `start` month. */
export const sortByNewest = (items: readonly Experience[]): Experience[] =>
  [...items].sort((a, b) => b.start.localeCompare(a.start));

export type CommitGroup = { label: string; items: Experience[] };

/** "Commits on <month>" groups, newest first, labelled by the start month. */
export const commitGroups = (
  items: readonly Experience[],
  locale: Locale,
): CommitGroup[] => {
  const groups: CommitGroup[] = [];
  for (const item of sortByNewest(items)) {
    const label = item.timelapse[locale].split(" - ")[0].trim();
    const last = groups.at(-1);
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
};

const LINK_LABELS: Record<Locale, { demo: string; code: string }> = {
  es: { demo: "Ver demo", code: "Código" },
  en: { demo: "Live demo", code: "Code" },
};

/** The project as the markdown file shown in "Files changed". */
export const projectSource = (project: Project, locale: Locale): string[] => {
  const labels = LINK_LABELS[locale];
  const links = [
    project.livePreview ? `[${labels.demo}](${project.livePreview})` : null,
    `[${labels.code}](${project.codeLink})`,
  ].filter(Boolean);

  return [
    `# ${project.projectName}`,
    "",
    project.description[locale],
    "",
    `**Stack:** ${project.techStack}`,
    "",
    links.join(" · "),
  ];
};

export const countAdditions = (files: readonly (readonly string[])[]): number =>
  files.reduce((total, lines) => total + lines.length, 0);

export const mailtoHref = (to: string, subject: string, body: string): string =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export type StackCategory = { key: string; items: readonly string[] };

/** The stack as pretty-printed JSON lines (shown as `stack.json`). */
export const stackSource = (categories: readonly StackCategory[]): string[] => [
  "{",
  ...categories.flatMap((category, index) => [
    `  "${category.key}": [`,
    ...category.items.map(
      (item, itemIndex) => `    "${item}"${itemIndex < category.items.length - 1 ? "," : ""}`,
    ),
    `  ]${index < categories.length - 1 ? "," : ""}`,
  ]),
  "}",
];
