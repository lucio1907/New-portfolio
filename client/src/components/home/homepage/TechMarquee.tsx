import React from "react";

const ITEMS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "FastAPI",
  "Python",
  "PostgreSQL",
  "Spring Boot",
  "Tailwind",
  "Claude Code",
  "MCP",
];

/** Decorative scrolling band; the real stack lives in the Tech stack section. */
const TechMarquee = (): React.ReactElement => (
  <div
    aria-hidden="true"
    className="-rotate-1 overflow-hidden border-y-3 border-ink bg-ink py-3.5"
  >
    <div className="flex w-max motion-safe:animate-marquee">
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0 items-center">
          {ITEMS.map((item) => (
            <li
              key={item}
              className="flex items-center gap-6 pr-6 font-mono text-lg font-bold uppercase text-yellow"
            >
              {item}
              <span className="text-pink">✦</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);

export default TechMarquee;
