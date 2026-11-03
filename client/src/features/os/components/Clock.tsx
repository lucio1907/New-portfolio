"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

/** Buenos Aires time; rendered only after mount so server and client agree. */
const Clock = () => {
  const t = useTranslations("os.taskbar");
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);

  const label = now
    ? new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
      }).format(now)
    : "--:--";

  return (
    <time
      aria-label={t("clock", { time: label })}
      className="min-w-[3.25rem] text-center text-sm tabular-nums text-parchment"
    >
      {label}
    </time>
  );
};

export default Clock;
