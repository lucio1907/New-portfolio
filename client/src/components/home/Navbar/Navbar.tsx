"use client";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import SocialMedia from "./SocialMedia";
import HamburgerButton from "./HamburgerButton";
import HamburgerNavigation from "./HamburgerNavigation";

const Navbar = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(true);
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = currentScrollPos < prevScrollPos;
      const nav = document.querySelector("nav");

      setPrevScrollPos(currentScrollPos);

      if (isScrollingUp) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollPos === 0) {
        nav?.classList.add("bg-transparent");
        nav?.classList.remove("bg-background-page-color");
      } else {
        nav?.classList.remove("bg-transparent");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const onClickEvent = () => setIsClicked(!isClicked);

  return (
    <nav className={`w-full h-[100px] bg-[#191919] flex justify-between px-5 md:px-20 items-center md:h-[120px] fixed top-0 transition-all duration-500  ${
      isScrolled
        ? "translate-y-0 z-10"
        : "-translate-y-full"
    }`}>
      <Logo />

      <HamburgerButton onClickEvent={onClickEvent} />
      <HamburgerNavigation isClicked={isClicked} setIsClicked={setIsClicked} />
      <Navigation />

      <SocialMedia />
    </nav>
  );
};

export default Navbar;
