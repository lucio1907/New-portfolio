import React from "react";
import { useTranslations } from "next-intl";
import Experiencies from "./Experiencies";
import SectionHeader from "@/components/common/SectionHeader";
import { FadeIn } from "@/components/motion/Reveal";

const AboutMePage = () => {
  const t = useTranslations("about");

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
