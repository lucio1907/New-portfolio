import React from "react";
import { useLocale, useTranslations } from "next-intl";
import WorkExperiences from "@/json/experiencies.json";
import TrajectoryScene from "../motion/TrajectoryScene";
import RiseTitle from "./RiseTitle";
import { type Experience, type Locale, periodStart, sortByOldest } from "../lib/content";

const roles = sortByOldest(WorkExperiences.experiencies as Experience[]);

/** The career along a road, from its start to the current role: each role on one side, the next on the other. */
const Trajectory = () => {
  const t = useTranslations("trajectory");
  const locale = useLocale() as Locale;

  return (
    <TrajectoryScene>
      <div data-panel className="trajectory-panel" />
      <RiseTitle className="trajectory-title" lines={[t("first"), t("second")]} />
      <div className="trajectory-body">
        <div data-road-list className="road-list">
          {/* The scene measures the roles and draws the road through them. */}
          <svg data-road aria-hidden="true" className="road">
            <path data-road-track className="road-track" />
            <path data-road-line className="road-line" />
            {roles.map((role) => (
              <g key={role.id} data-road-stop>
                <circle r="7" className="road-stop-pulse" />
                <circle r="7" className="road-stop-ring" />
                <circle r="4" className="road-stop-dot" />
              </g>
            ))}
            <g data-road-head>
              <circle r="11" className="road-head-glow" />
              <circle r="5" className="road-head-core" />
            </g>
          </svg>
          <ol>
            {roles.map((role) => (
              <li key={role.id} data-role className="role">
                <p className="role-date">{periodStart(role.timelapse[locale])}</p>
                <div className="role-body">
                  <h3 className="role-name">{role.position[locale]}</h3>
                  <p className="role-place">
                    {role.company}, {role.timelapse[locale]}
                  </p>
                  <ul className="role-list">
                    {role.highlights[locale].map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </TrajectoryScene>
  );
};

export default Trajectory;
