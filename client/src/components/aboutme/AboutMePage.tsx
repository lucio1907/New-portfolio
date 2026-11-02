import React from "react";
import { useTranslations } from "next-intl";
import Experiencies from "./Experiencies";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeIn } from "@/components/motion/Reveal";

type EducationEntry = {
  title: string;
  place: string;
  period: string;
};

const AboutMePage = () => {
  const t = useTranslations("about");
  const education = t.raw("education") as EducationEntry[];

  return (
    <section
      id="sobremí"
      className="mx-auto max-w-[1200px] scroll-mt-20 px-5 py-[100px] md:px-10"
    >
      <SectionHeader number="01" label={t("label")} className="mb-14" />

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-[72px]">
        <FadeIn>
          <div>
            <h2 className="mb-7 text-h2 text-foreground">{t("heading")}</h2>
            <p className="mb-5 text-[17px] leading-[1.7] text-muted">
              {t("bio1")}
            </p>
            <p className="text-[17px] leading-[1.7] text-muted">
              {t("bio2")}
            </p>

            <div className="mt-10 font-mono text-xs uppercase tracking-[0.12em] text-faint">
              {t("educationLabel")}
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {education.map((entry) => (
                <li
                  key={entry.title}
                  className="flex flex-wrap items-baseline justify-between gap-3"
                >
                  <span className="text-[15px] text-foreground">
                    {entry.title}{" "}
                    <span className="font-mono text-[13px] text-dim">
                      · {entry.place}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-faint">
                    {entry.period}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 font-mono text-xs uppercase tracking-[0.12em] text-faint">
              {t("languagesLabel")}
            </div>
            <p className="mt-3 text-[15px] text-muted">{t("languages")}</p>
          </div>
        </FadeIn>

        <div>
          <FadeIn>
            <div className="mb-[26px] font-mono text-xs uppercase tracking-[0.12em] text-faint">
              {t("experienceLabel")}
            </div>
          </FadeIn>
          <Experiencies />
        </div>
      </div>
    </section>
  );
};

export default AboutMePage;
