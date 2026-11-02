import React from "react";

type BugNoticeProps = {
  fixed: boolean;
  hint: string;
  fixedText: string;
  /** Actions that fix the bug, shown only while it is still broken. */
  children?: React.ReactNode;
};

/** Inline status line shown at the top of a "broken" section. */
const BugNotice = ({
  fixed,
  hint,
  fixedText,
  children,
}: BugNoticeProps): React.ReactElement => (
  <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3 font-mono text-[13px]">
    {fixed ? (
      <span className="text-success">✓ {fixedText}</span>
    ) : (
      <>
        <span className="text-warn">{hint}</span>
        {children}
      </>
    )}
  </div>
);

export const bugActionClassName =
  "min-h-[44px] rounded-btn border border-warn/40 bg-warn/[0.06] px-4 font-mono text-[12.5px] font-medium text-warn transition-colors duration-200 hover:bg-warn/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn disabled:cursor-wait disabled:opacity-60";

export default BugNotice;
