"use client";

import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import AppIcon, { APP_TINTS } from "./AppIcon";
import type { AppId } from "../lib/apps";
import { dispatchDesktop } from "@/features/experience/store";

type WindowProps = {
  app: AppId;
  title: string;
  open: boolean;
  focused: boolean;
  zIndex: number;
  position: { x: number; y: number };
  children: React.ReactNode;
};

/**
 * A LucioOS window. Desktop: draggable by its title bar. Mobile: full-screen
 * sheet. `data-open` drives visibility; before hydration CSS `:target` opens
 * it, so every section is reachable without JavaScript.
 */
const Window = ({ app, title, open, focused, zIndex, position, children }: WindowProps) => {
  const t = useTranslations("os.window");
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const titleId = `${app}-title`;

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dispatchDesktop({ type: "open", app });
    if (event.pointerType !== "mouse" || (event.target as HTMLElement).closest("button")) return;
    const frame = event.currentTarget.parentElement!.getBoundingClientRect();
    drag.current = { dx: event.clientX - frame.left, dy: event.clientY - frame.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const frame = event.currentTarget.parentElement!.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - drag.current.dx, 0), window.innerWidth - frame.width);
    const y = Math.min(Math.max(event.clientY - drag.current.dy, 0), window.innerHeight - 96);
    dispatchDesktop({ type: "move", app, x, y });
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <section
      id={app}
      role="dialog"
      aria-labelledby={titleId}
      data-open={open}
      data-focused={focused}
      tabIndex={-1}
      onPointerDownCapture={() => !focused && dispatchDesktop({ type: "open", app })}
      style={{ zIndex, ["--x" as string]: `${position.x}px`, ["--y" as string]: `${position.y}px` }}
      className="os-window"
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="os-titlebar"
      >
        <a href="#desktop" className="os-back" aria-label={t("back")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" className="h-5 w-5">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </a>
        <span className={`flex h-6 w-6 items-center justify-center rounded-md ${APP_TINTS[app]}`}>
          <AppIcon app={app} className="h-4 w-4" />
        </span>
        <h2 id={titleId} className="flex-1 truncate font-display text-[15px] font-medium">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => dispatchDesktop({ type: "minimize", app })}
          aria-label={t("minimize", { title })}
          className="os-control hidden md:flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
            <path d="M6 12h12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => dispatchDesktop({ type: "close", app })}
          aria-label={t("close", { title })}
          className="os-control hidden hover:bg-[#F28C8C] hover:text-night md:flex"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
            <path d="M7 7l10 10M17 7 7 17" />
          </svg>
        </button>
      </div>
      <div className="os-window-body">{children}</div>
    </section>
  );
};

export default Window;
