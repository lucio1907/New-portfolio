import React from "react";
import WorkExperiences from "../../json/experiencies.json";
import { sortByNewest } from "./ExperienceEntry";
import ExperienceBug from "@/features/debug-me/bugs/ExperienceBug";

const Experiencies = () => (
  <ExperienceBug items={sortByNewest(WorkExperiences.experiencies)} />
);

export default Experiencies;
