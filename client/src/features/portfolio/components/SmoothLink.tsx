"use client";

import React from "react";

type SmoothLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` };

/**
 * Glides to a section on request only. A global CSS smooth scroll would fight
 * the scenes, which measure the page by scrolling it instantly.
 */
const SmoothLink = ({ href, onClick, ...props }: SmoothLinkProps) => (
  <a
    href={href}
    onClick={(event) => {
      onClick?.(event);
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: still ? "auto" : "smooth" });
      window.history.pushState(null, "", href);
    }}
    {...props}
  />
);

export default SmoothLink;
