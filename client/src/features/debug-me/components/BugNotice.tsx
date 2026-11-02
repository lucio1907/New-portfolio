import React from "react";
import BugIcon from "./BugIcon";

type BugNoticeProps = {
  fixed: boolean;
  hint: string;
  fixedText: string;
  /** Actions that fix the bug, shown only while it is still broken. */
  children?: React.ReactNode;
};

/** Sticky-note status shown at the top of a "broken" section. */
const BugNotice = ({
  fixed,
  hint,
  fixedText,
  children,
}: BugNoticeProps): React.ReactElement =>
  fixed ? (
    <p className="brutal-chip mb-8 bg-green font-mono">✓ {fixedText}</p>
  ) : (
    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-card border-3 border-ink bg-white p-3 pr-4 shadow-brutal-sm">
      <span className="flex items-center gap-2.5 font-mono text-sm font-bold">
        <BugIcon className="h-8 w-8 shrink-0 text-red motion-safe:animate-wiggle" />
        {hint}
      </span>
      {children}
    </div>
  );

export const bugActionClassName =
  "brutal-btn min-h-[44px] bg-pink px-4 font-mono text-sm";

export default BugNotice;
