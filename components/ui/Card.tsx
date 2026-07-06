"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card = ({ children, className, hoverable = false }: CardProps) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)" } : {}}
      className={`bg-white rounded-3xl p-8 md:p-10 shadow-card border border-neutral-100 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
