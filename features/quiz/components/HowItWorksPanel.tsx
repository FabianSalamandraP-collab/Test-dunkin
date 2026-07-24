"use client";

import { motion } from "framer-motion";
import { CircleHelp } from "lucide-react";

export type HowItWorksPanelProps = {
  open: boolean;
  steps: string[];
  info: string[];
};

export function HowItWorksPanel({ open, steps, info }: HowItWorksPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <motion.div
      id="how-it-works-panel"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative z-10 mt-4 rounded-[1.5rem] border border-[#EDD6C4] bg-[linear-gradient(180deg,rgba(255,248,240,0.94)_0%,rgba(255,244,236,0.98)_100%)] p-4 shadow-[0_18px_42px_rgba(102,66,30,0.08)] sm:p-5 lg:max-w-[940px]"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF0E0] text-[#C9833A]">
          <CircleHelp className="h-4.5 w-4.5" />
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="font-display text-[0.8rem] font-extrabold uppercase tracking-[0.08em] text-[#B86B2C]">
              ¿Cómo funciona?
            </p>
            <h2 className="font-display text-[1.16rem] font-extrabold uppercase leading-[0.96] tracking-[-0.04em] text-[#4A281B] sm:text-[1.24rem]">
              Descubre tu bebida Dunkin' en solo 4 pasos.
            </h2>
          </div>
          <div className="space-y-3 font-display text-[0.94rem] font-extrabold uppercase leading-[1.45] tracking-[-0.025em] text-[#6B5448] sm:text-[1rem]">
            <ol className="space-y-2.5">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-2.5 rounded-[1rem] bg-white/55 px-3 py-2.5"
                >
                  <span className="mt-0.5 inline-flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-[#FFE7D2] font-display text-[0.76rem] font-extrabold text-[#B86B2C]">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="space-y-2 rounded-[1rem] border border-[#F0DDCF] bg-white/52 px-3.5 py-3">
              <h3 className="font-display text-[0.86rem] font-extrabold uppercase tracking-[0.08em] text-[#8E5A31]">
                Información importante
              </h3>
              <div className="space-y-2.5">
                {info.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
