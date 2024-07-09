import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <div className="hidden xl:block">
      <ul className="lg:flex gap-10 text-main-color text-[18px]">
        <li>
          <a href="#" className="hover:text-white transition-all ease-in duration-150">Home</a>
        </li>
        <li>
          <a href="#sobremí" className="hover:text-white transition-all ease-in duration-150">Sobre mí</a>
        </li>
        <li>
          <a href="#techstack" className="hover:text-white transition-all ease-in duration-150">Tech Stack</a>
        </li>
        <li>
          <a href="#proyectos" className="hover:text-white transition-all ease-in duration-150">Proyectos</a>
        </li>
        <li>
          <Link href="/contact" className="hover:text-white transition-all ease-in duration-150">Contacto</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
