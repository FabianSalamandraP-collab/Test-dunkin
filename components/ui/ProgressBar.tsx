"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  max: number;
  className?: string;
}

const ProgressBar = ({ progress, max, className }: ProgressBarProps) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm font-semibold mb-3">
        <span className="text-neutral-600">
          Paso {progress} de {max}
        </span>
        <span className="text-primary-600">{Math.round(percentage)}%</span>
      </div>
      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
