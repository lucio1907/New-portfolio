import React from "react";
import Experiencies from "./Experiencies";

const AboutMePage = () => {
  return (
    <div className="w-full h-full" id="sobremí">
      <div className="p-5 flex flex-col">
        <h2 className="font-bold text-[#CCCCCC] text-2xl text-center lg:text-3xl">
          Sobre mí
        </h2>
        <p className="mt-5 text-main-color px-3 md:px-5 lg:text-xl lg:px-32">
          ¡Hola! Soy Lucio, Desarrollador Full Stack. Desde siempre he sido un
          apasionado de la tecnología, lo que me llevó a sumergirme en este
          increíble mundo. Actualmente, me enfoco más en el lado del servidor
          (Backend), ya que es donde más destaco. Sin embargo, también poseo
          experiencia en el lado del cliente (Frontend), por lo que puedo
          trabajar en ambos aspectos sin problemas.
        </p>
        <p className="text-main-color px-5 mt-5 lg:text-xl lg:px-32">
          Estoy aquí para ayudarte con cualquier proyecto tecnológico que tengas
          en mente.
        </p>
      </div>
      <Experiencies />
    </div>
  );
};

export default AboutMePage;
