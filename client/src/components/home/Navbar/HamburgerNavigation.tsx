"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslations } from "next-intl";
import { navLinks } from "./navLinks";

const HamburgerNavigation = ({
  isClicked,
  setIsClicked,
}: {
  isClicked: boolean;
  setIsClicked: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("nav");

  useEffect(() => {
    const root = document.documentElement;

    if (isClicked) {
      document.body.classList.add("overflow-hidden");
      root.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      root.classList.remove("overflow-hidden");
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsClicked(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      root.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isClicked, setIsClicked]);

  const colors = ["bg-pink", "bg-blue text-white", "bg-green", "bg-lilac"];

  return (
    <div
      className={`fixed inset-0 z-40 bg-yellow lg:hidden ${
        isClicked ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        clipPath: isClicked
          ? "circle(150% at calc(100% - 40px) 40px)"
          : "circle(0% at calc(100% - 40px) 40px)",
        transition: "clip-path 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="relative flex h-full w-full flex-col overflow-y-auto px-6 pb-10 pt-28 md:px-16">
        <ul className="flex flex-col gap-4">
          {navLinks.map((link, index) => (
            <li
              key={link.key}
              className="transition-all duration-300 ease-out"
              style={{
                transitionDelay: isClicked ? `${index * 60}ms` : "0ms",
                opacity: isClicked ? 1 : 0,
                transform: isClicked
                  ? `rotate(${index % 2 === 0 ? -1.5 : 1.5}deg)`
                  : "translateX(24px)",
              }}
            >
              <a
                href={link.href}
                onClick={() => setIsClicked(false)}
                className={`brutal-btn w-full justify-between px-5 py-4 text-3xl ${colors[index % colors.length]}`}
              >
                {t(link.key)}
                <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          <a href="https://github.com/lucio1907" target="_blank" rel="noreferrer" className="brutal-chip bg-white">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/luciogastellu/" target="_blank" rel="noreferrer" className="brutal-chip bg-white">
            LinkedIn
          </a>
          <a href="https://x.com/Lu_Gastellu" target="_blank" rel="noreferrer" className="brutal-chip bg-white">
            X / Twitter
          </a>
        </div>
      </div>
    </div>
  );
};

export default HamburgerNavigation;
