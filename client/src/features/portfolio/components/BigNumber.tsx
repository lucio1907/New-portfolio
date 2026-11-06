import React from "react";
import { useTranslations } from "next-intl";
import NumberScene from "../motion/NumberScene";

/** The one measured result in the CV gets the whole screen. */
const BigNumber = () => {
  const t = useTranslations("number");

  return (
    <NumberScene>
      <p className="display number-value" aria-label="35%">
        <span aria-hidden="true">
          <span data-count>35</span>%
        </span>
      </p>
      <p className="number-text">{t("text")}</p>
    </NumberScene>
  );
};

export default BigNumber;
