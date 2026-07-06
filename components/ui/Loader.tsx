"use client";

import { motion } from "framer-motion";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white";
}

const Loader = ({ size = "md", color = "primary" }: LoaderProps) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  const colors = {
    primary: "bg-primary-500",
    white: "bg-white",
  };

  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizes[size]} ${colors[color]} rounded-full`}
          variants={dotVariants}
          animate="animate"
          transition={{ delay: i * 0.2 }}
        />
      ))}
    </div>
  );
};

export default Loader;
