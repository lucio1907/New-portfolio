import React from "react";
import Tech from "../../json/techStack.json";

type TechStack = {
  id: number;
  name: string;
  image: string;
};

const TechStack = (): React.ReactElement => {
  return (
    <div className="w-full h-full" id="techstack">
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-bold text-[#CCCCCC] text-xl md:text-2xl lg:text-3xl">
          Tech Stack
        </h2>
        <p className="text-main-color px-5 text-center mt-2 md:text-xl lg:mt-5">
          Tecnologías con las que estoy trabajando actualmente.
        </p>
      </div>

      <div className="w-full flex flex-col justify-center items-center">
        <div className="flex flex-wrap justify-center mx-10 gap-10 my-14 md:gap-16 lg:my-16 lg:gap-20 lg:w-[60%]">
          {Tech.stacks.map((item: TechStack) => (
            <div key={item.id} className="flex justify-center">
              <div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[100px] h-[100px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
