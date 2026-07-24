"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "pink" | "orange" | "ink";
  hint?: string;
}

const toneClassMap = {
  pink: "from-[#FFF2F8] to-white text-[#B74274] border-[#FFD8E8]",
  orange: "from-[#FFF5EC] to-white text-[#B86935] border-[#F4D5BE]",
  ink: "from-[#F7F2EE] to-white text-[#3E342F] border-[#E8D9CF]",
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "ink",
  hint,
}: MetricCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-[1.6rem] border bg-gradient-to-b p-5 shadow-[0_18px_48px_rgba(62,52,47,0.07)] ${toneClassMap[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#8A7569]">
            {label}
          </p>
          <p className="mt-3 font-display text-[2rem] uppercase leading-none tracking-[-0.06em] text-[#3E342F]">
            {value}
          </p>
        </div>
        <div className="bg-white/80 flex h-11 w-11 items-center justify-center rounded-[1rem] shadow-[0_12px_24px_rgba(62,52,47,0.08)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {hint ? (
        <p className="mt-4 font-sans text-sm leading-6 text-[#6D5F57]">
          {hint}
        </p>
      ) : null}
    </motion.article>
  );
}
