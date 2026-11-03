import React from "react";
import { useTranslations } from "next-intl";

type EducationEntry = { title: string; place: string; period: string };

const About = () => {
  const t = useTranslations("site");
  const ta = useTranslations("about");
  const education = ta.raw("education") as EducationEntry[];

  return (
    <div>
      <div className="max-w-prose space-y-4">
        <p className="text-[19px] font-medium leading-snug">{ta("heading")}</p>
        <p className="text-haze">{ta("bio1")}</p>
        <p className="text-haze">{ta("bio2")}</p>
      </div>

      <div className="mt-10 grid max-w-prose gap-8 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-base font-medium">{ta("educationLabel")}</h3>
          <ul className="space-y-3">
            {education.map((entry) => (
              <li key={entry.title}>
                <p className="font-medium">{entry.title}</p>
                <p className="text-sm text-haze">
                  {entry.place}, <span className="tabular-nums">{entry.period}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-base font-medium">{ta("languagesLabel")}</h3>
          <p className="text-haze">{ta("languages")}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
