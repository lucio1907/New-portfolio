import React from "react";
import Image from "next/image";
import { RocketIcon } from "./Icons";

type AvatarProps = { size?: number; className?: string };

export const AuthorAvatar = ({ size = 40, className = "" }: AvatarProps) => (
  <Image
    src="/MeMemoji.webp"
    alt=""
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={`shrink-0 rounded-full border border-line bg-subtle object-cover ${className}`}
  />
);

/** Bots get square avatars, like on code hosts. */
export const BotAvatar = ({ size = 40, className = "" }: AvatarProps) => (
  <span
    aria-hidden="true"
    style={{ width: size, height: size }}
    className={`flex shrink-0 items-center justify-center rounded-box border border-line bg-done/20 text-done-fg ${className}`}
  >
    <RocketIcon className="h-[55%] w-[55%]" />
  </span>
);

export const VisitorAvatar = ({ size = 40, className = "" }: AvatarProps) => (
  <span
    aria-hidden="true"
    style={{ width: size, height: size }}
    className={`flex shrink-0 items-center justify-center rounded-full border border-line bg-subtle font-semibold text-muted ${className}`}
  >
    ?
  </span>
);

type TimelineCommentProps = {
  avatar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  highlighted?: boolean;
};

/**
 * Comment on the timeline. The avatar sits left of the rule on wide screens;
 * the box covers the rule so it reads as a card on the thread.
 */
export const TimelineComment = ({ avatar, header, children, highlighted }: TimelineCommentProps) => (
  <div className="relative mb-4 md:ml-14">
    <div className="absolute -left-14 top-0 hidden md:block">{avatar}</div>
    <div
      className={`box comment-arrow-md ${highlighted ? "border-link/60" : ""}`}
    >
      <div className={`box-header ${highlighted ? "border-link/40 bg-link/10" : ""}`}>
        {header}
      </div>
      <div className="min-w-0 px-4 py-4">{children}</div>
    </div>
  </div>
);

type TimelineEventProps = {
  icon: React.ReactNode;
  /** Badge colors, e.g. "bg-done text-white" for a merge. */
  badgeClassName?: string;
  children: React.ReactNode;
};

/** Small event on the rule ("lucio1907 added 4 commits"). */
export const TimelineEvent = ({ icon, badgeClassName, children }: TimelineEventProps) => (
  <div className="relative flex items-start gap-3 py-3 md:ml-14">
    <span
      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-canvas ${
        badgeClassName ?? "bg-btn text-muted"
      }`}
    >
      {icon}
    </span>
    <div className="min-w-0 flex-1 pt-1.5 text-sm text-muted">{children}</div>
  </div>
);

/** Bold name used inside rich event messages. */
export const Strong = (chunks: React.ReactNode) => (
  <span className="font-semibold text-fg">{chunks}</span>
);

export const BranchRef = (chunks: React.ReactNode) => (
  <code className="rounded-md bg-link/15 px-1.5 py-0.5 font-mono text-xs text-link">
    {chunks}
  </code>
);
