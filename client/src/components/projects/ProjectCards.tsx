import React from "react";
import Projects from "@/json/projects.json";
import LinkChainSvg from "../svgs/LinkChainSvg";
import GithubSvg from "../svgs/GithubSvg";
import Image from "next/image";

interface ProjectsTypes {
  id: number;
  projectName: string;
  description: string;
  image: string;
  techStack: string;
  codeLink: string;
  livePreview: string;
}

const ProjectCards = (): React.ReactElement => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 p-5 mt-5">
      {Projects.projects.map((items: ProjectsTypes) => (
        <div
          key={items.id}
          className="bg-[#363636] rounded-2xl text-main-color md:max-w-[500px] h-full flex flex-col"
        >
          <div className="relative w-full h-64 rounded-t-2xl md:max-w-[500px]">
            <Image
              src={items.image}
              alt={items.projectName}
              layout="fill"
              objectFit="cover"
              className="rounded-t-2xl"
            />
          </div>

          <div className="p-5 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="text-[#CCCCCC] text-xl font-semibold my-5">
                {items.projectName}
              </h3>
              <p className="">{items.description}</p>
              <p className="mt-5">
                <span className="text-[#f5f5f5]">Tech stack:</span>{" "}
                {items.techStack}
              </p>
            </div>

            <div className="flex justify-between px-1 md:px-10 lg:pb-2 mt-5">
              <div className="flex gap-2">
                <LinkChainSvg />
                <a
                  href={items.livePreview}
                  target="_blank"
                  className="underline underline-offset-2 text-white"
                >
                  Link al proyecto
                </a>
              </div>
              <div className="flex gap-2">
                <GithubSvg />
                <a
                  href={items.codeLink}
                  target="_blank"
                  className="underline underline-offset-2 text-white"
                >
                  Ver código
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectCards;
