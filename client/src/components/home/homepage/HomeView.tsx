import React from "react";
import Image from "next/image";
import "../../../app/globals.css";

const HomeView = (): React.ReactElement => {
  return (
    <div className="w-full h-full mt-5 md:mt-10 lg:mt-24" id="#">
      <div className="w-full h-full flex flex-col justify-center items-center lg:flex-row lg:gap-[100px]">
        <div className="p-5 sm:w-[70%] lg:w-[45%] lg:mt-5">
          <h1 className="text-[26px] font-bold text-[#D9D9D9] md:text-[35px] lg:text-[50px]">
            Hola!👋, mi nombre es{" "}
            <span className="text-gradient">Lucio Gastellu</span> y soy
            Desarrollador Full Stack.{" "}
          </h1>
          <div className="flex flex-col items-center lg:items-start gap-14">
            <p className="text-main-color text-[15px] mt-5 md:text-[18px]">
              Apasionado en crear aplicaciones y traerlas a la vida utilizando
              código.
            </p>
            <a
              href="#contacto"
              className="bg-gradient p-2 text-center w-[150px] max-w-[300px] font-semibold text-white rounded mb-5 md:w-[200px] md:p-4 md:mb-10 md:text-[21px] lg:mb-0 lg:text-[24px] lg:p-3 lg:rounded-lg"
            >
              Contactame
            </a>
          </div>
        </div>
        <div className="jump bg-gradient mt-5 border border-slate-300 z-[-1]">
          <Image
            src="/MeMemoji.webp"
            alt="me-emoji"
            width={250}
            height={250}
            className="w-[250px] h-[250px] max-w-[500px] max-h-[500px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px]"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
