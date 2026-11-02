import React from "react";
import { FadeIn } from "@/components/motion/Reveal";

type Props = {
  number: string;
  label: string;
  /** Tailwind background class for the number sticker. */
  color?: string;
  className?: string;
};

const SectionHeader = ({
  number,
  label,
  color = "bg-yellow",
  className = "mb-6",
}: Props) => (
  <FadeIn>
    <div className={`flex items-center gap-4 ${className}`}>
      <span
        aria-hidden="true"
        className={`sticker -rotate-6 font-mono text-xl ${color}`}
      >
        {number}
      </span>
      <h2 className="text-h2 text-ink">{label}</h2>
    </div>
  </FadeIn>
);

export default SectionHeader;
