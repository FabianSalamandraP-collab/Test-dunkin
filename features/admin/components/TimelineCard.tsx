"use client";

import { motion } from "framer-motion";
import type { DashboardTimeSeriesDatum } from "@/lib/admin-dashboard-types";

interface TimelineCardProps {
  title: string;
  caption: string;
  data: DashboardTimeSeriesDatum[];
  accent?: string;
}

export function TimelineCard({
  title,
  caption,
  data,
  accent = "#FF0068",
}: TimelineCardProps) {
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-white/70 rounded-[1.7rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(248,244,241,0.98)_100%)] p-5 shadow-[0_22px_54px_rgba(62,52,47,0.08)]"
    >
      <div className="mb-6">
        <p className="font-display text-[1.15rem] uppercase tracking-[-0.04em] text-[#3E342F]">
          {title}
        </p>
        <p className="mt-2 font-sans text-sm leading-6 text-[#6F6058]">
          {caption}
        </p>
      </div>

      {data.length === 0 ? (
        <div className="bg-white/70 rounded-[1.2rem] border border-dashed border-[#E7D7CC] px-4 py-5 font-sans text-sm text-[#7A6A62]">
          No hay datos suficientes para construir esta serie temporal.
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-3 lg:grid-cols-8">
          {data.map((point) => (
            <div key={point.key} className="flex flex-col items-center gap-3">
              <div className="flex h-40 items-end">
                <div className="relative flex h-full w-8 items-end rounded-full bg-[#F1E7DF]">
                  <div
                    className="w-full rounded-full"
                    style={{
                      height: `${Math.max((point.value / max) * 100, point.value > 0 ? 10 : 0)}%`,
                      background: `linear-gradient(180deg, ${accent} 0%, rgba(62,52,47,0.88) 100%)`,
                    }}
                  />
                </div>
              </div>
              <p className="font-display text-[0.72rem] uppercase text-[#5A4C45]">
                {point.value}
              </p>
              <p className="text-center font-sans text-[0.68rem] uppercase tracking-[0.08em] text-[#8B776B]">
                {point.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.article>
  );
}
