import React from "react";
import { useLocale } from "next-intl";
import WorkExperiences from "../../json/experiencies.json";
import { StaggerContainer, StaggerItem } from "../motion/Reveal";

type Locale = "es" | "en";

type ExperienciesTypes = {
  id: number;
  company: string;
  country: string;
  position: Record<Locale, string>;
  workModality: string;
  timelapse: Record<Locale, string>;
};

const Experiencies = () => {
  const locale = useLocale() as Locale;
  const reversedExperiences = [...WorkExperiences.experiencies].reverse();

  return (
    <StaggerContainer className="flex flex-col">
      {reversedExperiences.map((item: ExperienciesTypes, index: number) => {
        const isCurrent = index === 0;
        const isLast = index === reversedExperiences.length - 1;

        return (
          <StaggerItem
            key={item.id}
            className={`relative border-l border-white/10 pl-7 ${
              isLast ? "pb-1" : "pb-[30px]"
            }`}
          >
            <span
              className={`absolute -left-[5px] top-[5px] h-[9px] w-[9px] rounded-full ${
                isCurrent
                  ? "bg-accent shadow-[0_0_0_4px_rgba(79,140,255,0.15)]"
                  : "bg-[#3f3f46]"
              }`}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <span className="text-[17px] font-semibold text-foreground">
                {item.position[locale]}
              </span>
              <span className="whitespace-nowrap font-mono text-xs text-faint">
                {item.timelapse[locale]}
              </span>
            </div>
            <div
              className={`mt-1.5 font-mono text-[13px] ${
                isCurrent ? "text-accent" : "text-dim"
              }`}
            >
              {item.company}
            </div>
            <div className="mt-1 text-[13px] text-faint-2">
              {item.country} · {item.workModality}
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
};

export default Experiencies;
