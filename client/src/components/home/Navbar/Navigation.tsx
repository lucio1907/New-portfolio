"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { navLinks } from "./navLinks";

const Navigation = () => {
  const t = useTranslations("nav");

  return (
    <ul className="hidden items-center gap-7 font-mono text-[13px] lg:flex">
      {navLinks.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            className="text-dim transition-colors duration-200 hover:text-foreground"
          >
            {t(link.key)}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
