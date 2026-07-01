"use client";

import { MotionConfig } from "framer-motion";
import React from "react";

const MotionProvider = ({ children }: { children: React.ReactNode }) => (
  <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

export default MotionProvider;
