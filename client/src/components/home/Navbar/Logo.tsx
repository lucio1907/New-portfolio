import React from "react";

const Logo = () => {
  return (
    <a
      href="#top"
      className="flex items-center gap-0.5 font-mono text-base font-semibold tracking-[0.02em] text-foreground md:text-lg"
    >
      <span className="text-accent">&lt;</span>LG
      <span className="text-accent">/&gt;</span>
    </a>
  );
};

export default Logo;
