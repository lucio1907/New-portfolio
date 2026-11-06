import React from "react";
import { useTranslations } from "next-intl";
import TechStackData from "@/json/techStack.json";
import SheetScene from "../motion/SheetScene";
import RiseTitle from "./RiseTitle";

type Study = { title: string; place: string; period: string };

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="sheet-row">
    <span data-rule aria-hidden="true" className="rule" />
    <dt>{label}</dt>
    <dd data-value>{children}</dd>
  </div>
);

/** Specs, the way a product page lists them: stack, studies and languages. */
const TechSheet = () => {
  const t = useTranslations("sheet");

  return (
    <SheetScene>
      <RiseTitle className="sheet-title" lines={[t("title")]} />
      <dl className="sheet-list">
        {TechStackData.categories.map((category) => (
          <Row key={category.key} label={t(`categories.${category.key}`)}>
            {category.items.join(", ")}
          </Row>
        ))}
        <Row label={t("education")}>
          {(t.raw("studies") as Study[]).map((study) => (
            <span key={study.title} className="block">
              {study.title}, {study.place} <span className="font-normal text-muted">{study.period}</span>
            </span>
          ))}
        </Row>
        <Row label={t("languages")}>{t("languagesValue")}</Row>
      </dl>
    </SheetScene>
  );
};

export default TechSheet;
