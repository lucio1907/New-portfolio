import Link from "next/link";
import React from "react";

const Navigation = () => {
  return (
    <div className="hidden xl:block">
      <ul className="lg:flex gap-10 text-main-color text-[18px]">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#aboutMe">Sobre mí</a>
        </li>
        <li>
          <a href="#techStack">Tech Stack</a>
        </li>
        <li>
          <a href="#projects">Proyectos</a>
        </li>
        <li>
          <Link href="/contact">Contacto</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
