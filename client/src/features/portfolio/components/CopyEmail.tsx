"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { EMAIL } from "../lib/constants";

/** Copies the email; the confirmation is announced to screen readers. */
const CopyEmail = () => {
  const t = useTranslations("site.contact");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the address stays visible and selectable.
    }
  };

  return (
    <button type="button" onClick={copy} className="btn min-h-[40px] px-4 text-sm">
      <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
};

export default CopyEmail;
