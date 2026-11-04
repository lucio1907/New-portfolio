import React from "react";
import { useTranslations } from "next-intl";
import PosScene from "../motion/PosScene";

type ReceiptRow = [string, string];

/** Every line on the receipt is a fact from the CV, not invented sale data. */
const Receipt = () => {
  const t = useTranslations("pos.receipt");
  const rows = t.raw("rows") as ReceiptRow[];

  return (
    <div data-receipt className="receipt">
      <p className="text-center font-medium">{t("title")}</p>
      <p className="text-center">{t("subtitle")}</p>
      <hr className="receipt-rule" />
      <dl>
        {rows.map(([name, value]) => (
          <div key={name} className="receipt-row">
            <dt>{name}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <hr className="receipt-rule" />
      <p className="text-center">{t("thanks")}</p>
    </div>
  );
};

/** The launch of the strongest project: the receipt is the product shot. */
const PosChapter = () => {
  const t = useTranslations("pos");

  return (
    <PosScene>
      <div data-pos-stage className="pos-stage">
        <div data-pos-bg className="pos-bg" />
        <div className="pos-copy">
          <h2 className="pos-title display">
            <span data-pos-line className="block">{t("first")}</span>
            <span data-pos-line className="block">{t("second")}</span>
          </h2>
          <p data-pos-body className="pos-body">{t("body")}</p>
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
