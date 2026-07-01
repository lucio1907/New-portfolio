import React from "react";

type Props = {
  isOpen: boolean;
  onClickEvent: () => void;
};

const HamburgerButton = ({ isOpen, onClickEvent }: Props) => {
  return (
    <button
      onClick={onClickEvent}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="flex h-[26px] w-[26px] flex-col items-center justify-center gap-[6px] lg:hidden md:h-[30px] md:w-[30px]"
    >
      <span
        className={`h-[1.5px] w-[22px] bg-dim transition-all duration-300 ease-out ${
          isOpen ? "translate-y-[7.5px] rotate-45 bg-accent" : ""
        }`}
      />
      <span
        className={`h-[1.5px] w-[22px] bg-dim transition-all duration-300 ease-out ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`h-[1.5px] w-[22px] bg-dim transition-all duration-300 ease-out ${
          isOpen ? "-translate-y-[7.5px] -rotate-45 bg-accent" : ""
        }`}
      />
    </button>
  );
};

export default HamburgerButton;
