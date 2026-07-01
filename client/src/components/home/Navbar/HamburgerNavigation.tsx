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

  return (
    <div
      className={`fixed inset-0 z-40 bg-background lg:hidden ${
        isClicked ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        clipPath: isClicked
          ? "circle(150% at calc(100% - 32px) 32px)"
          : "circle(0% at calc(100% - 32px) 32px)",
        transition: "clip-path 550ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-fade" aria-hidden />

      <div className="relative flex h-full w-full flex-col overflow-y-auto px-8 pb-10 pt-24 md:px-16">
        <p className="mb-8 font-mono text-xs tracking-[0.16em] text-accent">
          {"// MENU"}
        </p>

        <ul className="flex flex-col">
          {navLinks.map((link, index) => (
            <li
              key={link.key}
              className="border-b border-border-soft transition-all duration-500 ease-out"
              style={{
                transitionDelay: isClicked ? `${index * 60}ms` : "0ms",
                opacity: isClicked ? 1 : 0,
                transform: isClicked ? "translateX(0)" : "translateX(16px)",
              }}
            >
              <a
                href={link.href}
                onClick={() => setIsClicked(false)}
                className="group flex items-baseline gap-4 py-4"
              >
                <span className="font-mono text-xs text-accent">
                  0{index + 1}
                </span>
                <span className="text-3xl font-semibold text-foreground transition-colors duration-200 group-hover:text-accent md:text-4xl">
                  {t(link.key)}
                </span>
                <span className="ml-auto font-mono text-lg text-accent opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:-translate-x-2">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div
          className="mt-14 flex flex-wrap items-center gap-4 transition-all duration-500 ease-out"
          style={{
            transitionDelay: isClicked ? `${navLinks.length * 60}ms` : "0ms",
            opacity: isClicked ? 1 : 0,
            transform: isClicked ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <span className="font-mono text-xs text-faint">FIND ME —</span>
          <a
            href="https://github.com/lucio1907"
            target="_blank"
            className="font-mono text-[13px] text-dim transition-colors duration-200 hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://x.com/Lu_Gastellu"
            target="_blank"
            className="font-mono text-[13px] text-dim transition-colors duration-200 hover:text-foreground"
          >
            Twitter
          </a>
          <a
            href="https://www.linkedin.com/in/luciogastellu/"
            target="_blank"
            className="font-mono text-[13px] text-dim transition-colors duration-200 hover:text-foreground"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default HamburgerNavigation;
