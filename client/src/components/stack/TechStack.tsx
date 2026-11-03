import React from "react";
import { useTranslations } from "next-intl";
import TechStackData from "../../json/techStack.json";
import StackBug, { StackChip } from "@/features/debug-me/bugs/StackBug";
import { FileIcon } from "@/components/pr/Icons";

type Category = {
  id: number;
  key: string;
  items: string[];
};

/** Tech stack rendered as added files in the diff: one file per category. */
const TechStack = (): React.ReactElement => {
  const t = useTranslations("techStack");

  return (
    <div id="stack" className="scroll-mt-16">
      <h2 className="mb-1 text-lg font-semibold">{t("label")}</h2>
      <p className="mb-4 text-sm text-muted">{t("subtitle")}</p>

      <StackBug>
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          {TechStackData.categories.map((category: Category) => (
            <div key={category.id} className="box overflow-hidden">
              <div className="box-header justify-between font-mono text-[13px]">
                <span className="flex min-w-0 items-center gap-2">
                  <FileIcon className="h-4 w-4 text-muted" />
                  <span className="truncate">stack/{category.key}.json</span>
                </span>
                <span className="text-accent">+{category.items.length}</span>
              </div>
              <p className="border-b border-line px-3 py-1 font-mono text-xs text-muted">
                {"// "}
                {t(`categories.${category.key}`)}
              </p>
              <ul>
                {category.items.map((item, index) => (
                  <StackChip key={item} tech={item} line={index + 1} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </StackBug>
    </div>
  );
};

export default TechStack;
