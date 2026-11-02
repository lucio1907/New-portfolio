import React from "react";

type Props = {
  isOpen: boolean;
  onClickEvent: () => void;
};

const HamburgerButton = ({ isOpen, onClickEvent }: Props) => (
  <button
    type="button"
    onClick={onClickEvent}
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
    className="brutal-btn h-[42px] min-h-[42px] w-[42px] flex-col gap-[5px] bg-white px-0 lg:hidden"
  >
    <span
      className={`h-[3px] w-5 rounded-full bg-ink transition-transform duration-200 ${
        isOpen ? "translate-y-2 rotate-45" : ""
      }`}
    />
    <span
      className={`h-[3px] w-5 rounded-full bg-ink transition-opacity duration-200 ${
        isOpen ? "opacity-0" : "opacity-100"
      }`}
    />
    <span
      className={`h-[3px] w-5 rounded-full bg-ink transition-transform duration-200 ${
        isOpen ? "-translate-y-2 -rotate-45" : ""
      }`}
    />
  </button>
);

export default HamburgerButton;
