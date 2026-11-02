"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { navLinks } from "./navLinks";

const Navigation = () => {
  const t = useTranslations("nav");

  return (
    <ul className="hidden items-center gap-1 lg:flex">
      {navLinks.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            className="rounded-btn border-2 border-transparent px-3 py-2 text-[15px] font-bold text-ink transition-colors duration-150 hover:border-ink hover:bg-yellow"
          >
            {t(link.key)}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
