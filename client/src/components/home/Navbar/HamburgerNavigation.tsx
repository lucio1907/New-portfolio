"use client";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect } from "react";

const navigation: string[] = ["Home", "Sobre mí", "Tech Stack", "Proyectos"];

const linkFormat = (item: string): string => item.replace(/\s+/g, "").toLowerCase();

const HamburgerNavigation = ({
  isClicked,
  setIsClicked,
}: {
  isClicked: boolean;
  setIsClicked: Dispatch<SetStateAction<boolean>>;
}) => {

  useEffect(() => {
    if (isClicked) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isClicked]);

  return (
    <div
      className={`w-full h-full bg-slate-800 absolute -bottom-[100px] md:-bottom-[120px] transition-all ease-in duration-500 xl:hidden ${
        isClicked ? "left-0" : "-left-[2000px]"
      }`}
    >
      <div className="w-full h-full flex justify-center">
        <ul className="w-1/2 h-full flex flex-col justify-center items-center gap-5 md:gap-10 text-xl md:text-2xl text-white">
          {navigation.map((item: string, index: number) => (
            <li key={index}>
              <a href={`#${linkFormat(item) === 'home' ? '' : linkFormat(item)}`} onClick={() => setIsClicked(false)}>{item}</a>
            </li>
          ))}
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HamburgerNavigation;
