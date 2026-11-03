import React from "react";
import { useLocale, useTranslations } from "next-intl";
import WorkExperiences from "@/json/experiencies.json";
import Section from "./Section";
import { type Experience as ExperienceItem, type Locale, sortByNewest } from "../lib/content";

const experiences = sortByNewest(WorkExperiences.experiencies as ExperienceItem[]);

/** Career timeline, newest first (a real sequence, so it gets a line and dots). */
const Experience = () => {
  const t = useTranslations("site");
  const locale = useLocale() as Locale;

  return (
    <Section id="experience" title={t("sections.experience")} intro={t("experience.intro")}>
      <ol className="relative max-w-prose border-l border-orbit">
        {experiences.map((item, index) => (
          <li key={item.id} className="relative pb-10 pl-7 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[6px] top-2 h-[11px] w-[11px] rounded-full border-2 border-night ${
                index === 0 ? "bg-sun" : "bg-haze"
              }`}
            />
            <p className="text-sm tabular-nums text-haze">{item.timelapse[locale]}</p>
            <h3 className="mt-1 text-[19px] font-medium leading-snug">{item.position[locale]}</h3>
            <p className="text-sky">
              {item.company}
              <span className="text-haze">, {item.workModality}</span>
            </p>
            <ul className="mt-3 space-y-1.5 text-[15.5px] text-haze">
              {item.highlights[locale].map((highlight) => (
                <li key={highlight} className="relative pl-4 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-orbit">
                  {highlight}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default Experience;
