import React from "react";
import { useTranslations } from "next-intl";
import ManifestoScene from "../motion/ManifestoScene";
import { splitWords } from "../lib/motion";

/** Words are real text in separate spans, so readers get the whole sentence. */
const Manifesto = () => {
  const t = useTranslations();

  return (
    <ManifestoScene>
      <p>
        {splitWords(t("manifesto")).map((word, index) => (
          <React.Fragment key={index}>
            <span data-word>{word}</span>{" "}
          </React.Fragment>
        ))}
      </p>
    </ManifestoScene>
  );
};

export default Manifesto;
