"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import SocialMedia from "./SocialMedia";
import HamburgerButton from "./HamburgerButton";
import HamburgerNavigation from "./HamburgerNavigation";


const Navbar = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const onClickEvent = () => setIsClicked(!isClicked);

  return (
    <div className="w-full h-[100px] flex justify-around items-center md:gap-20 md:h-[120px]">
      <Logo />

      <HamburgerButton onClickEvent={onClickEvent}/>
      <HamburgerNavigation isClicked={isClicked} setIsClicked={setIsClicked}/>
      <Navigation/>

      <SocialMedia/>
    </div>
  );
};

export default Navbar;
