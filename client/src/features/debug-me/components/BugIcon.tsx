import React from "react";

type BugIconProps = {
  className?: string;
};

/** Cartoon bug. Body color comes from `currentColor`; outlines are ink. */
const BugIcon = ({ className }: BugIconProps): React.ReactElement => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="#141414"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M17 10 13 4M31 10l4-6" />
    <path d="M12 24H4M44 24h-8M13 33l-6 5M35 33l6 5M13 17l-6-4M35 17l6-4" />
    <ellipse cx="24" cy="29" rx="12" ry="14" fill="currentColor" />
    <path d="M24 16v26" />
    <circle cx="24" cy="15" r="8" fill="#141414" />
    <circle cx="21" cy="14" r="2.6" fill="#fff" stroke="none" />
    <circle cx="27" cy="14" r="2.6" fill="#fff" stroke="none" />
    <circle cx="21.6" cy="14.4" r="1.1" fill="#141414" stroke="none" />
    <circle cx="27.6" cy="14.4" r="1.1" fill="#141414" stroke="none" />
    <circle cx="18" cy="27" r="2" fill="#141414" stroke="none" />
    <circle cx="30" cy="33" r="2" fill="#141414" stroke="none" />
  </svg>
);

export default BugIcon;
