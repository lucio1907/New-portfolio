import React from "react";
import { useTranslations } from "next-intl";
import TechStackData from "../../json/techStack.json";
import SectionHeader from "@/components/common/SectionHeader";
import StackBug from "@/features/debug-me/bugs/StackBug";
import { FadeIn, StaggerContainer, StaggerItem } from "../motion/Reveal";

type Category = {
  id: number;
  key: string;
  items: string[];
};

const HEADER_COLORS = [
  "bg-yellow",
  "bg-pink",
  "bg-blue text-white",
  "bg-green",
  "bg-lilac",
  "bg-paper",
];

const TILTS = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]", "rotate-[0.5deg]"];

const TechStack = (): React.ReactElement => {
  const t = useTranslations("techStack");

  return (
    <section
      id="techstack"
      className="mx-auto max-w-[1240px] scroll-mt-28 px-5 py-24 md:px-10"
    >
      <SectionHeader number="02" label={t("label")} color="bg-blue text-white" />
      <FadeIn>
        <p className="mb-10 max-w-[560px] text-lg font-medium text-ink-soft">
          {t("subtitle")}
        </p>
      </FadeIn>

      <StackBug>
        <StaggerContainer className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {TechStackData.categories.map((category: Category, index: number) => (
            <StaggerItem key={category.id}>
              <div
                className={`brutal-card h-full overflow-hidden ${TILTS[index % TILTS.length]}`}
              >
                <h3
                  className={`border-b-3 border-ink px-5 py-3 font-mono text-sm font-bold uppercase tracking-[0.12em] ${HEADER_COLORS[index % HEADER_COLORS.length]}`}
                >
                  {t(`categories.${category.key}`)}
                </h3>
                <ul className="flex flex-wrap gap-2.5 p-5">
                  {category.items.map((item) => (
                    <li key={item} className="brutal-chip bg-white">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </StackBug>
    </section>
  );
};

export default TechStack;
