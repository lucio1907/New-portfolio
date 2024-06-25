import Link from "next/link";
import React from "react";

//! CONTINUAR ACA!!!
const HamburgerNavigation = () => {
  return (
    <div className="w-full h-full absolute">
      <ul>
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
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
};

export default HamburgerNavigation;
