import React from "react";
import { useLocale, useTranslations } from "next-intl";
import WorkExperiences from "@/json/experiencies.json";
import TrajectoryScene from "../motion/TrajectoryScene";
import RiseTitle from "./RiseTitle";
import { type Experience, type Locale, periodStart, sortByNewest } from "../lib/content";

const roles = sortByNewest(WorkExperiences.experiencies as Experience[]);

/** The career, newest first. On desktop the date stays beside the roles and rolls. */
const Trajectory = () => {
  const t = useTranslations("trajectory");
  const locale = useLocale() as Locale;

  return (
    <TrajectoryScene>
      <div data-panel className="trajectory-panel" />
      <RiseTitle className="trajectory-title" lines={[t("first"), t("second")]} />
      <div className="trajectory-body">
        <div aria-hidden="true" className="trajectory-rail">
          <div className="rail-window">
            <div data-rail>
              {roles.map((role) => (
                <span key={role.id}>{periodStart(role.timelapse[locale])}</span>
              ))}
            </div>
          </div>
        </div>
        <ol>
          {roles.map((role) => (
            <li key={role.id} data-role className="role">
              <p className="role-date">{periodStart(role.timelapse[locale])}</p>
              <h3 className="role-name">{role.position[locale]}</h3>
              <p className="role-place">
                {role.company}, {role.timelapse[locale]}
              </p>
              <ul className="role-list">
                {role.highlights[locale].map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </TrajectoryScene>
  );
};

export default Trajectory;
