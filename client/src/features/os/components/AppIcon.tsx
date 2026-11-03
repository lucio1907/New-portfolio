import React from "react";
import type { AppId } from "../lib/apps";

type IconKey = AppId | "cv";

const PATHS: Record<IconKey, React.ReactNode> = {
  about: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18" />
    </>
  ),
  projects: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  stack: (
    <>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M12 15h5" />
    </>
  ),
  cv: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
};

/** Tile color per app, from the star-chart palette. */
export const APP_TINTS: Record<IconKey, string> = {
  about: "bg-[#FFC94A] text-night",
  experience: "bg-[#8CCBFF] text-night",
  projects: "bg-[#C3A6FF] text-night",
  stack: "bg-[#7DDBA0] text-night",
  contact: "bg-[#F28C8C] text-night",
  terminal: "bg-[#1B2354] text-[#7DDBA0] ring-1 ring-orbit",
  cv: "bg-parchment text-night",
};

const AppIcon = ({ app, className = "h-6 w-6" }: { app: IconKey; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {PATHS[app]}
  </svg>
);

export default AppIcon;
