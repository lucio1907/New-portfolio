import React from "react";
import { useTranslations } from "next-intl";
import HeroScene from "../motion/HeroScene";

const Hero = () => {
  const t = useTranslations("hero");

  return (
    <HeroScene>
      <div data-hero-rest className="hero-lede grid gap-5 md:grid-cols-[1fr_minmax(0,34rem)] md:items-end md:gap-8">
        <p className="order-2 text-[15px] text-muted md:order-1">
          {t("available")} {t("location")}
        </p>
        <p className="order-1 text-[clamp(1.5rem,2.6vw,2.5rem)] font-semibold leading-[1.12] tracking-[-0.025em] md:order-2">
          {t("lede")}
        </p>
      </div>
      <h1 data-hero-name className="hero-name display">
        <span className="hero-rise">Lucio</span> <span className="hero-rise">Gastellu</span>
      </h1>
    </HeroScene>
  );
};

export default Hero;
