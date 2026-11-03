import React from "react";
import { useTranslations } from "next-intl";
import TechStackData from "@/json/techStack.json";

/** Stack grouped by category as a plain definition list. */
const Stack = () => {
  const t = useTranslations("site");
  const tc = useTranslations("techStack.categories");

  return (
    <div>
      <p className="mb-6 text-haze">{t("stack.intro")}</p>
      <dl className="grid max-w-prose gap-x-8 gap-y-6 sm:grid-cols-2">
        {TechStackData.categories.map((category) => (
          <div key={category.key}>
            <dt className="mb-2 text-sm text-haze">{tc(category.key)}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {category.items.map((item) => (
                  <li key={item} className="rounded-full border border-orbit px-3 py-1 text-[15px]">
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Stack;
