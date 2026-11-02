import React from "react";

const Logo = () => (
  <a
    href="#top"
    aria-label="Lucio Gastellu"
    className="group flex items-center gap-2.5"
  >
    <span className="flex h-10 w-10 -rotate-6 items-center justify-center rounded-btn border-3 border-ink bg-yellow font-mono text-[15px] font-bold text-ink shadow-brutal-sm transition-transform duration-200 group-hover:rotate-6">
      LG
    </span>
    <span className="hidden font-mono text-[15px] font-bold text-ink sm:inline">
      lucio<span className="text-pink">.</span>dev
    </span>
  </a>
);

export default Logo;
