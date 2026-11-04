import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import PosScene from "../motion/PosScene";

/** Not a sale: an itemized account of the work, signed by the people who did it. */
const Receipt = () => {
  const t = useTranslations("pos.receipt");

  return (
    <div data-receipt className="receipt">
      <p className="text-center font-medium">{t("title")}</p>
      <p className="text-center">{t("subtitle")}</p>
      <hr className="receipt-rule" />
      <ul className="receipt-items">
        {(t.raw("items") as string[]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <hr className="receipt-rule" />
      <dl className="receipt-block">
        <dt>{t("stackLabel")}</dt>
        {(t.raw("stack") as string[]).map((line) => (
          <dd key={line}>{line}</dd>
        ))}
      </dl>
      <hr className="receipt-rule" />
      <dl className="receipt-block">
        <dt>{t("by")}</dt>
        <dd>{t("team")}</dd>
      </dl>
      <hr className="receipt-rule" />
      <p className="text-center">{t("thanks")}</p>
    </div>
  );
};

/** The strongest project, told by the team that built it: what we did, then the proof. */
const PosChapter = () => {
  const t = useTranslations("pos");

  return (
    <PosScene>
      <div data-pos-stage className="pos-stage">
        <div data-pos-bg className="pos-bg" />
        <div className="pos-main">
          <div className="pos-copy">
            <h2 data-pos-title className="pos-title display">
              <span data-pos-line className="block">{t("first")}</span>
              <span data-pos-line className="block">{t("second")}</span>
            </h2>
            <p data-pos-body className="pos-body">{t("body")}</p>
          </div>
          <div data-pos-shot className="pos-shot">
            <Image
              src="/projects/sitiohoy-pos.webp"
              alt={t("alt")}
              fill
              sizes="(min-width: 768px) 68vw, 100vw"
              quality={90}
              className="object-cover"
            />
          </div>
        </div>
        <div className="receipt-slot">
          <div className="receipt-slit md:hidden" />
          <div className="receipt-clip">
            <Receipt />
          </div>
        </div>
      </div>
    </PosScene>
  );
};

export default PosChapter;
