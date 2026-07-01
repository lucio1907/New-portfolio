import React from "react";
import { useTranslations } from "next-intl";
import TechStackData from "../../json/techStack.json";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "../motion/Reveal";

type Category = {
  id: number;
  key: string;
  items: string[];
};

const TechStack = (): React.ReactElement => {
  const t = useTranslations("techStack");

  return (
    <section
      id="techstack"
      className="mx-auto max-w-[1200px] scroll-mt-20 px-5 py-[100px] md:px-10"
    >
      <SectionHeader number="02" label={t("label")} />
      <FadeIn>
        <p className="mb-12 max-w-[520px] text-lg text-muted">
          {t("subtitle")}
        </p>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {TechStackData.categories.map((category: Category) => (
          <StaggerItem
            key={category.id}
            className="rounded-panel border border-border bg-gradient-to-b from-white/[0.02] to-transparent p-6"
          >
            <div className="mb-[18px] font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {t(`categories.${category.key}`)}
            </div>
            <div className="flex flex-col gap-3">
              {category.items.map((item) => (
                <span key={item} className="font-mono text-sm text-[#d4d4d8]">
                  {item}
                </span>
              ))}
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
};

export default TechStack;
