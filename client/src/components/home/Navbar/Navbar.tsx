import React from "react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import SocialMedia from "./SocialMedia";
import HamburgerMenu from "./HamburgerMenu";


const Navbar = () => {
  return (
    <div className="w-full h-[100px] flex justify-around items-center">
      <Logo />

      <HamburgerMenu />
      <Navigation/>

      <SocialMedia/>
    </div>
  );
};

export default Navbar;
