"use client";
import React, { useState } from "react";
import HamburgerNavigation from "./HamburgerNavigation";

const HamburgerMenu = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const onClickEvent = () => setIsClicked(!isClicked);

  return (
    <button onClick={onClickEvent} className="lg:hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 w-[40px] h-[40px]"
        color="#A7A7A7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
      {isClicked ? <HamburgerNavigation /> : ""}
    </button>
  );
};

export default HamburgerMenu;
