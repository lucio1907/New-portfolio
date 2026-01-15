import React from "react";
import Navigation from "../home/Navbar/Navigation";
import SocialMediaFooter from "./SocialMediaFooter";
import FooterLogo from "./FooterLogo";

const Footer = (): React.ReactElement => {
  return (
    <div className="flex flex-col py-8 px-3 md:px-8 text-main-color bg-[#222222] mt-10">
      <FooterLogo />
      <div className="w-[100%] flex flex-col justify-center items-center">
        <div className="flex flex-col gap-8 border-b-2 border-[#56565666] w-[90%]">
          <div className="flex flex-col mt-5 w-[250px] md:text-xl">
            <a href="tel:+543329402087">+54 3329 402087</a>
            <a href="mailto:luciogastellu.dev@gmail.com">
              luciogastellu.dev@gmail.com
            </a>
          </div>
          <p className="text-main-color mb-5 lg:mb-10 md:text-xl">
            &quot;Un buen programador es alguien que siempre busca una forma más
            eficiente de hacer las cosas&quot;. - Bill Gates
          </p>
        </div>

        <div className="flex justify-center lg:items-center lg:justify-between w-full lg:px-24 lg:mt-5">
          <div className="flex justify-center mt-5">
            <SocialMediaFooter />
          </div>
          <div className="hidden lg:flex">
            <Navigation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
