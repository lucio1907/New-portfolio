import React from "react";

/** A section title whose lines rise into place, each behind its own mask. */
const RiseTitle = ({ lines, className }: { lines: string[]; className: string }) => (
  <h2 className={`${className} display`}>
    {lines.map((line) => (
      <span key={line} className="rise-mask">
        <span data-rise>{line}</span>
      </span>
    ))}
  </h2>
);

export default RiseTitle;
