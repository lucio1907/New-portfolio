import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import AboutBug from "@/features/debug-me/bugs/AboutBug";
import { AUTHOR } from "./TopBar";

type EducationEntry = {
  title: string;
  place: string;
  period: string;
};

/** PR description written by the author: the About section. */
const Conversation = (): React.ReactElement => {
  const t = useTranslations("about");
  const tc = useTranslations("pr.conversation");
  const education = t.raw("education") as EducationEntry[];

  return (
    <section id="conversation" aria-label={tc("label")} className="relative scroll-mt-16">
      <AboutBug>
        <article className="flex gap-3">
          <Image
            src="/MeMemoji.webp"
            alt=""
            width={40}
            height={40}
            className="relative z-10 hidden h-10 w-10 shrink-0 rounded-full border border-line bg-subtle object-cover sm:block"
          />
          <div className="box min-w-0 flex-1 overflow-hidden">
            <div className="box-header">
              <span className="font-semibold">{AUTHOR}</span>
              <span className="text-muted">{tc("commented")}</span>
              <span className="label-chip ml-auto border-line text-muted">
                {tc("author")}
              </span>
            </div>

            <div className="p-5 md:p-6">
              <h2 className="mb-4 text-[22px] font-semibold leading-snug md:text-[24px]">
                {t("heading")}
              </h2>
              <p className="mb-4 leading-relaxed text-muted">{t("bio1")}</p>
              <p className="leading-relaxed text-muted">{t("bio2")}</p>

              <h3 className="mb-3 mt-7 border-b border-line pb-2 text-base font-semibold">
                {t("educationLabel")}
              </h3>
              <ul className="flex flex-col gap-2">
                {education.map((entry) => (
                  <li
                    key={entry.title}
                    className="flex flex-wrap items-center justify-between gap-2 text-[15px]"
                  >
                    <span>
                      <span className="font-semibold">{entry.title}</span>
                      <span className="text-muted"> · {entry.place}</span>
                    </span>
                    <code className="font-mono text-xs text-muted">{entry.period}</code>
                  </li>
                ))}
              </ul>

              <h3 className="mb-3 mt-7 border-b border-line pb-2 text-base font-semibold">
                {t("languagesLabel")}
              </h3>
              <p className="text-[15px] text-muted">{t("languages")}</p>
            </div>
          </div>
        </article>
      </AboutBug>
    </section>
  );
};

export default Conversation;
