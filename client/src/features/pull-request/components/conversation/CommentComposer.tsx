"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { VisitorAvatar } from "../Timeline";
import { EMAIL, PR_NUMBER } from "../../lib/constants";
import { mailtoHref } from "../../lib/pullRequest";

type Mode = "write" | "preview";

/** "Add a comment" box; commenting opens an email to Lucio with the text. */
const CommentComposer = (): React.ReactElement => {
  const t = useTranslations("pr.composer");
  const th = useTranslations("pr.header");
  const [mode, setMode] = useState<Mode>("write");
  const [text, setText] = useState("");
  const trimmed = text.trim();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    const subject = t("subject", { title: th("title"), number: PR_NUMBER });
    window.location.href = mailtoHref(EMAIL, subject, trimmed);
  };

  const tabClassName = (active: boolean) =>
    `h-10 rounded-t-box border border-b-0 px-4 text-sm transition-colors ${
      active ? "border-line bg-canvas font-medium text-fg" : "border-transparent text-muted hover:text-fg"
    }`;

  return (
    <div className="relative mt-4 border-t-2 border-line-muted pt-6 md:ml-14">
      <div className="absolute -left-14 top-6 hidden md:block">
        <VisitorAvatar />
      </div>
      <h2 className="mb-2 text-base font-semibold">{t("title")}</h2>
      <form onSubmit={submit} className="box comment-arrow-md">
        <div role="tablist" className="flex gap-1 rounded-t-box border-b border-line bg-subtle px-2 pt-2">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "write"}
            onClick={() => setMode("write")}
            className={`${tabClassName(mode === "write")} -mb-px`}
          >
            {t("write")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "preview"}
            onClick={() => setMode("preview")}
            className={`${tabClassName(mode === "preview")} -mb-px`}
          >
            {t("preview")}
          </button>
        </div>

        <div className="p-2">
          {mode === "write" ? (
            <textarea
              aria-label={t("label")}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={t("placeholder")}
              rows={5}
              className="block min-h-[110px] w-full resize-y rounded-box border border-line bg-inset p-2 text-sm text-fg placeholder:text-muted focus:border-link focus:outline-none"
            />
          ) : (
            <div className="min-h-[110px] whitespace-pre-wrap break-words border-b border-line-muted p-2 text-sm">
              {trimmed || <span className="text-muted">{t("nothing")}</span>}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
          <p className="text-xs text-muted">{t("markdown")}</p>
          <button type="submit" disabled={!trimmed} className="btn btn-primary">
            {t("comment")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentComposer;
