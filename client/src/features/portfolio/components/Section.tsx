import React from "react";
import { useTranslations } from "next-intl";
import { SECTIONS, type SectionId, formatCoordinate } from "../lib/sections";

type SectionProps = {
  id: Exclude<SectionId, "home">;
  title: string;
  intro?: string;
  children: React.ReactNode;
};

/**
 * Content section. `data-section` lets the planet follow the reading
 * position; the coordinate is where this section lives on the planet.
 */
const Section = ({ id, title, intro, children }: SectionProps) => {
  const t = useTranslations("site");
  const { lat, lon } = SECTIONS.find((section) => section.id === id)!;

  return (
    <section
      id={id}
      data-section={id}
      aria-labelledby={`${id}-title`}
      className="flex min-h-[80svh] flex-col justify-center py-20"
    >
      <header className="mb-8">
        <h2 id={`${id}-title`} className="text-[30px] font-medium leading-tight tracking-[-0.01em] md:text-[38px]">
          {title}
        </h2>
        <p className="coordinate mt-2">
          <span className="sr-only">{t("coordinateLabel")}: </span>
          {formatCoordinate(lat, lon)}
        </p>
        {intro && <p className="mt-4 max-w-prose text-haze">{intro}</p>}
      </header>
      {children}
    </section>
  );
};

export default Section;
