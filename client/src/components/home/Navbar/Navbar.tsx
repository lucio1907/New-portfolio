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
      <nav className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-[1240px] items-center justify-between rounded-card border-3 border-ink bg-white px-3 py-2.5 shadow-brutal md:inset-x-6 md:px-4">
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
