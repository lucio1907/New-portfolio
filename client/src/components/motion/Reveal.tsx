"use client";

import { motion, Variants, Transition } from "framer-motion";
import React from "react";

const spring: Transition = {
  type: "spring",
  stiffness: 130,
  damping: 18,
  mass: 0.7,
};

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export const FadeIn = ({ children, className, delay = 0, y = 26 }: FadeInProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ ...spring, delay }}
  >
    {children}
  </motion.div>
);

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: spring },
};

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const StaggerContainer = ({ children, className }: ContainerProps) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.12 }}
    variants={containerVariants}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }: ContainerProps) => (
  <motion.div className={className} variants={itemVariants}>
    {children}
  </motion.div>
);
