import React from "react";
import { useTranslations } from "next-intl";
import HowScene from "../motion/HowScene";

const HowIWork = () => {
  const t = useTranslations("how");

  return (
    <HowScene>
      <h2 className="how-title display">{t("title")}</h2>
      <ul className="how-list">
        {(t.raw("lines") as string[]).map((line) => (
          <li key={line} data-line>
            {line}
          </li>
        ))}
      </ul>
    </HowScene>
  );
};

export default HowIWork;
