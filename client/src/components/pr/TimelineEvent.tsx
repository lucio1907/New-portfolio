import React from "react";

type TimelineEventProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
};

/** Small event row on the PR timeline ("lucio1907 added 4 commits"). */
const TimelineEvent = ({ icon, children }: TimelineEventProps) => (
  <div className="relative z-10 mb-4 flex items-center gap-3 pl-1.5 text-sm text-muted">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-subtle text-muted">
      {icon}
    </span>
    <p>{children}</p>
  </div>
);

export default TimelineEvent;
