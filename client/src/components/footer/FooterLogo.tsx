import React from "react";

const FooterLogo = () => {
  return (
    <div className="flex justify-center lg:justify-start lg:px-20 lg:my-5">
      <a href="#" className="font-semibold text-2xl md:text-4xl ">
        <span className="md:hidden">{`<Lucio Gastellu />`}</span>{" "}
        <span className="hidden md:flex">{`<LG />`}</span>{" "}
      </a>
    </div>
  );
};

export default FooterLogo;
