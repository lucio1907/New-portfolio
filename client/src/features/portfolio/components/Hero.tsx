import React from "react";
import { useTranslations } from "next-intl";
import HeroScene from "../motion/HeroScene";
import { OWNER_NAME } from "../lib/constants";

const WORDS = OWNER_NAME.split(" ");

/** Where each word starts counting, so the letters rise as one single wave. */
const firstLetter = (wordIndex: number) => WORDS.slice(0, wordIndex).join("").length;

const Hero = () => {
  const t = useTranslations("hero");

  return (
    <HeroScene>
      <div data-hero-rest className="hero-lede grid gap-4 md:grid-cols-[1fr_minmax(0,27rem)] md:items-end md:gap-8">
        <p className="order-2 text-[14px] text-muted md:order-1">
          {t("available")} {t("location")}
        </p>
        <p className="order-1 text-[clamp(1.25rem,1.9vw,1.75rem)] font-semibold leading-[1.16] tracking-[-0.022em] md:order-2">
          {t("lede")}
        </p>
      </div>
      {/* The letters are split for the entrance: readers get the name as one label. */}
      <h1 data-hero-name aria-label={OWNER_NAME} className="hero-name display">
        {WORDS.map((word, wordIndex) => (
          <React.Fragment key={word}>
            {wordIndex > 0 && " "}
            <span aria-hidden="true" className="hero-rise">
              {Array.from(word).map((letter, index) => (
                <span
                  key={index}
                  className="hero-letter"
                  style={{ "--i": firstLetter(wordIndex) + index } as React.CSSProperties}
                >
                  {letter}
                </span>
              ))}
            </span>
          </React.Fragment>
        ))}
      </h1>
    </HeroScene>
  );
};

export default Hero;
