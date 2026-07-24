"use client";

import { motion } from "framer-motion";
import type { DashboardChartDatum } from "@/lib/admin-dashboard-types";

interface DistributionCardProps {
  title: string;
  caption: string;
  data: DashboardChartDatum[];
  accent?: "pink" | "orange" | "ink";
}

const accentMap = {
  pink: "bg-[#FF0068]",
  orange: "bg-[#EF6A00]",
  ink: "bg-[#3E342F]",
};

export function DistributionCard({
  title,
  caption,
  data,
  accent = "pink",
}: DistributionCardProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-white/70 rounded-[1.7rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(248,244,241,0.96)_100%)] p-5 shadow-[0_22px_54px_rgba(62,52,47,0.08)]"
    >
      <div className="mb-5">
        <p className="font-display text-[1.15rem] uppercase tracking-[-0.04em] text-[#3E342F]">
          {title}
        </p>
        <p className="mt-2 font-sans text-sm leading-6 text-[#6F6058]">
          {caption}
        </p>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <EmptyMessage />
        ) : (
          data.slice(0, 8).map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <p className="truncate font-sans text-sm text-[#4E433D]">
                  {item.label}
                </p>
                <span className="font-display text-sm uppercase text-[#3E342F]">
                  {item.value}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#F1E7DF]">
                <div
                  className={`h-full rounded-full ${accentMap[accent]}`}
                  style={{
                    width: `${Math.max((item.value / max) * 100, 8)}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </motion.article>
  );
}

function EmptyMessage() {
  return (
    <div className="bg-white/70 rounded-[1.2rem] border border-dashed border-[#E7D7CC] px-4 py-5 font-sans text-sm text-[#7A6A62]">
      No hay datos suficientes para esta visualización con los filtros activos.
    </div>
  );
}
