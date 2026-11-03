/** LucioOS apps, in the order their icons appear on the desktop. */
export const APPS = [
  { id: "about" },
  { id: "experience" },
  { id: "projects" },
  { id: "stack" },
  { id: "contact" },
  { id: "terminal" },
] as const;

export type AppId = (typeof APPS)[number]["id"];

const IDS: readonly string[] = APPS.map((app) => app.id);

export const isAppId = (value: string): value is AppId => IDS.includes(value);
