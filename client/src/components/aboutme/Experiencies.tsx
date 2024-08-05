import React from "react";
import WorkExperiences from "../../json/experiencies.json";
import BuildingSvg from "../svgs/BuildingSvg";
import LocationSvg from "../svgs/LocationSvg";

type ExperienciesTypes = {
  id: number;
  company: string;
  country: string;
  position: string;
  workModality: string;
  timelapse: string;
};

const Experiencies = () => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col gap-10 py-3 px-8 lg:items-center lg:flex-row lg:px-36">
        {WorkExperiences.experiencies.map((item: ExperienciesTypes) => (
          <div
            key={item.id}
            className="flex flex-col bg-[#242424] p-3 rounded-lg lg:w-1/2 lg:p-8 lg:hover:shadow-sm lg:hover:shadow-[#E70FAA] transition-all ease-in duration-150"
          >
            <p className="text-[#CCCCCC] text-[18px] lg:text-[21px]">
              {item.position}
            </p>

            <div className="flex text-main-color gap-5 mt-2 lg:mt-3">
              <p className="flex justify-center gap-2 lg:text-[18px]">
                <BuildingSvg />
                {item.company}
              </p>
              <p className="flex justify-center gap-2 lg:text-[18px]">
                <LocationSvg />
                {item.country}
              </p>
            </div>

            <div className="flex flex-col text-main-color lg:text-[18px] lg:mt-2">
              <p>{item.workModality}</p>
              <p>{item.timelapse}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiencies;
