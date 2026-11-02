import React from "react";
import { useTranslations } from "next-intl";
import Experiencies from "./Experiencies";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeIn } from "@/components/motion/Reveal";
import AboutBug from "@/features/debug-me/bugs/AboutBug";

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
      className="mx-auto max-w-[1240px] scroll-mt-28 px-5 py-24 md:px-10"
    >
      <SectionHeader number="01" label={t("label")} color="bg-pink" className="mb-12" />

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-14">
        <FadeIn>
          <div className="brutal-card p-6 md:p-8">
            <AboutBug>
              <h3 className="mb-5 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[32px]">
                {t("heading")}
              </h3>
              <p className="mb-4 text-[17px] leading-[1.7] text-ink-soft">
                {t("bio1")}
              </p>
              <p className="text-[17px] leading-[1.7] text-ink-soft">
                {t("bio2")}
              </p>

              <h4 className="mb-4 mt-9 font-mono text-sm font-bold uppercase tracking-[0.12em]">
                {t("educationLabel")}
              </h4>
              <ul className="flex flex-col gap-3">
                {education.map((entry) => (
                  <li
                    key={entry.title}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-btn border-2 border-ink bg-paper px-4 py-3"
                  >
                    <span className="font-bold">
                      {entry.title}{" "}
                      <span className="font-medium text-ink-soft">
                        · {entry.place}
                      </span>
                    </span>
                    <span className="font-mono text-xs font-bold">
                      {entry.period}
                    </span>
                  </li>
                ))}
              </ul>

              <h4 className="mb-3 mt-7 font-mono text-sm font-bold uppercase tracking-[0.12em]">
                {t("languagesLabel")}
              </h4>
              <p className="brutal-chip bg-lilac">{t("languages")}</p>
            </AboutBug>
          </div>
        </FadeIn>

        <div>
          <FadeIn>
            <h3 className="mb-6 text-[28px] font-bold tracking-[-0.02em] md:text-[32px]">
              {t("experienceLabel")}
            </h3>
          </FadeIn>
          <Experiencies />
        </div>
      </div>
    </section>
  );
};

export default AboutMePage;
