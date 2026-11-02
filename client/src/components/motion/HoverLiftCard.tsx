"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
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
      x: -3,
      y: -3,
      transition: { type: "spring", stiffness: 400, damping: 22 },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default HoverLiftCard;
