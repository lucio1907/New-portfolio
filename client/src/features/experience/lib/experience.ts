/**
 * Where the visitor is: looking at the room, sitting down (camera moving
 * into the monitor) or using the desktop.
 */
export type Mode = "room" | "sitting" | "desktop";

export type ExperienceState = { mode: Mode };

export type ExperienceAction =
  | { type: "sit"; animate: boolean }
  | { type: "arrived" }
  | { type: "stand" };

export const INITIAL_EXPERIENCE: ExperienceState = { mode: "room" };

export const initialExperience = ({ deepLink, can3D }: { deepLink: boolean; can3D: boolean }): ExperienceState =>
  deepLink || !can3D ? { mode: "desktop" } : INITIAL_EXPERIENCE;

export const experienceReducer = (state: ExperienceState, action: ExperienceAction): ExperienceState => {
  switch (action.type) {
    case "sit":
      return { mode: action.animate ? "sitting" : "desktop" };
    case "arrived":
      return state.mode === "sitting" ? { mode: "desktop" } : state;
    case "stand":
      return state.mode === "room" ? state : { mode: "room" };
  }
};
