import React from "react";
import { useTranslations } from "next-intl";
import HowScene from "../motion/HowScene";
import RiseTitle from "./RiseTitle";

const HowIWork = () => {
  const t = useTranslations("how");

  return (
    <HowScene>
      <RiseTitle className="how-title" lines={[t("title")]} />
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
