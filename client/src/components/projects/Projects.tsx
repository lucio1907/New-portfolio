import React from "react";
import ProjectCards from "./ProjectCards";

const Projects = (): React.ReactElement => {
  return (
    <div className="flex flex-col justify-center items-center" id="proyectos">
      <h2 className="font-bold text-[#CCCCCC] text-2xl lg:text-3xl">
        Proyectos
      </h2>
      <p className="text-main-color px-5 text-center mt-2 md:text-xl lg:mt-5">
        Proyectos que he realizado.
      </p>

      <ProjectCards/>
      <h3 className="text-main-color px-5 text-center mt-2 md:text-xl lg:mt-5 animate-pulse">Más proyectos próximamente...</h3>
    </div>
  );
};

export default Projects;
