"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 130, damping: 18, mass: 0.7 },
  },
};

type HoverLiftCardProps = {
  children: React.ReactNode;
  className?: string;
};

const HoverLiftCard = ({ children, className }: HoverLiftCardProps) => (
  <motion.div
    variants={itemVariants}
    whileHover={{
      y: -6,
      transition: { type: "spring", stiffness: 260, damping: 24 },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default HoverLiftCard;
