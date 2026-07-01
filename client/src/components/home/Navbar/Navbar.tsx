"use client";
import React, { useState } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import HamburgerButton from "./HamburgerButton";
import HamburgerNavigation from "./HamburgerNavigation";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const [isClicked, setIsClicked] = useState(false);
  const onClickEvent = () => setIsClicked((prev) => !prev);

  return (
    <>
      <nav className="glass fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-border-soft px-5 py-5 md:px-10">
        <Logo />
        <div className="flex items-center gap-2 md:gap-3">
          <Navigation />
          <LanguageToggle />
          <HamburgerButton isOpen={isClicked} onClickEvent={onClickEvent} />
        </div>
      </nav>
      <HamburgerNavigation isClicked={isClicked} setIsClicked={setIsClicked} />
    </>
  );
};

export default Navbar;
