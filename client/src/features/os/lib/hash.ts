import { type AppId, isAppId } from "./apps.ts";

/** `#projects` → "projects"; anything that is not an app → null. */
export const appFromHash = (hash: string): AppId | null => {
  const id = hash.replace(/^#/, "");
  return isAppId(id) ? id : null;
};

export const hashForApp = (app: AppId | null): string => (app ? `#${app}` : "");
