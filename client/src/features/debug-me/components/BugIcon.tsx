import React from "react";

type BugIconProps = {
  className?: string;
};

const BugIcon = ({ className }: BugIconProps): React.ReactElement => (
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
    <path d="M9 7.5a3 3 0 0 1 6 0" />
    <rect x="7" y="8" width="10" height="12" rx="5" />
    <path d="M12 12v8" />
    <path d="M7 12H3.5M20.5 12H17M7.5 16.5 4.5 19M16.5 16.5l3 2.5M7.5 9.5 5 7M16.5 9.5 19 7" />
  </svg>
);

export default BugIcon;
