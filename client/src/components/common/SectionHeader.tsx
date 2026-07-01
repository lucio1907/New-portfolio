import React from "react";
import { FadeIn } from "@/components/motion/Reveal";

type Props = {
  number: string;
  label: string;
  className?: string;
};

const SectionHeader = ({ number, label, className = "mb-5" }: Props) => (
  <FadeIn>
    <div className={`flex items-center gap-3.5 ${className}`}>
      <span className="font-mono text-[13px] text-accent">{number}</span>
      <span className="font-mono text-[13px] uppercase tracking-[0.12em] text-dim">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  </FadeIn>
);

export default SectionHeader;
