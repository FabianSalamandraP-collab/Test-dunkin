"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { quizTypography } from "../quizVisualSystem";

const answerCardVariants = cva(
  "group relative w-full overflow-hidden rounded-[1.6rem] border text-left transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF671F]/25",
  {
    variants: {
      density: {
        default: "px-4 py-4 sm:px-5 sm:py-5 lg:px-6",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
);

export type AnswerCardTheme = {
  accent: string;
  border: string;
  soft: string;
  text: string;
  glow: string;
};

export type AnswerCardProps = Omit<HTMLMotionProps<"button">, "children"> &
  VariantProps<typeof answerCardVariants> & {
    label: string;
    letter: string;
    selected: boolean;
    theme: AnswerCardTheme;
  };

export function AnswerCard({
  className,
  label,
  letter,
  selected,
  theme,
  density,
  ...props
}: AnswerCardProps) {
  return (
    <motion.button
      type="button"
      animate={
        selected
          ? {
              y: -2,
              scale: 1.012,
            }
          : {
              y: 0,
              scale: 1,
            }
      }
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.975 }}
      className={cn(answerCardVariants({ density }), className)}
      aria-pressed={selected}
      style={{
        borderColor: selected ? theme.accent : theme.border,
        background: selected
          ? `linear-gradient(180deg, color-mix(in srgb, ${theme.accent} 16%, white) 0%, ${theme.soft} 56%, color-mix(in srgb, ${theme.accent} 30%, white) 100%)`
          : "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,250,244,0.9) 100%)",
        boxShadow: selected
          ? `0 30px 60px ${theme.glow}, 0 0 0 2px ${theme.accent}`
          : "0 12px 24px rgba(89,53,17,0.05)",
      }}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-100"
        animate={
          selected
            ? { opacity: 1, scale: [1, 1.018, 1] }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.28, ease: "easeOut" }}
        style={{
          background: selected
            ? `radial-gradient(circle at 12% 18%, ${theme.accent}32 0%, rgba(255,255,255,0) 34%), radial-gradient(circle at 86% 82%, ${theme.accent}24 0%, rgba(255,255,255,0) 36%)`
            : `radial-gradient(circle at 10% 16%, ${theme.accent}0D 0%, rgba(255,255,255,0) 24%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[4px]"
        style={{
          background: `linear-gradient(90deg, ${theme.accent} 0%, rgba(255,255,255,0) 100%)`,
          opacity: selected ? 1 : 0.72,
        }}
      />

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-[12%] left-[-28%] w-[34%] rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.18)_30%,rgba(255,255,255,0.4)_52%,rgba(255,255,255,0)_72%)] blur-md transition-transform duration-500",
          selected ? "translate-x-[320%]" : "group-hover:translate-x-[320%]"
        )}
      />
      <motion.span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300",
          selected ? "opacity-100" : "opacity-0"
        )}
        animate={
          selected
            ? { opacity: 1, boxShadow: `inset 0 0 0 2px ${theme.accent}` }
            : { opacity: 0, boxShadow: "inset 0 0 0 0 rgba(0,0,0,0)" }
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          boxShadow: selected ? `inset 0 0 0 2px ${theme.accent}` : "none",
        }}
      />
      <motion.span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-[-1.1rem] top-[-1.1rem] h-16 w-16 rounded-full blur-2xl transition-opacity duration-300",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-70"
        )}
        animate={
          selected
            ? { opacity: 1, scale: [0.9, 1.08, 1] }
            : { opacity: 0, scale: 0.92 }
        }
        transition={{ duration: 0.32, ease: "easeOut" }}
        style={{ backgroundColor: `${theme.accent}26` }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[-18%] w-[22%] rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.26)_38%,rgba(255,255,255,0.62)_52%,rgba(255,255,255,0)_72%)] blur-md"
        initial={false}
        animate={
          selected
            ? { x: ["0%", "520%"] }
            : { x: "-8%" }
        }
        transition={
          selected
            ? { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.2, ease: "easeOut" }
        }
      />

      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <motion.span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-display text-[0.78rem] font-extrabold uppercase tracking-[0.08em] sm:h-10 sm:w-10"
            animate={
              selected
                ? { scale: [1, 1.08, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.24, ease: "easeOut" }}
            style={{
              borderColor: selected ? theme.accent : theme.border,
              backgroundColor: selected ? `${theme.accent}26` : `${theme.accent}12`,
              color: theme.text,
            }}
          >
            {letter}
          </motion.span>
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={quizTypography.optionLabel}
            style={{ color: selected ? "#211711" : "#3E3129" }}
          >
            {label}
          </p>
        </div>

        {selected ? (
          <motion.span
            layoutId="answer-check"
            aria-hidden="true"
            initial={{ scale: 0.6, opacity: 0, rotate: -14 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 28 }}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: theme.accent }}
          >
            <Check className="h-4.5 w-4.5" strokeWidth={2.6} />
          </motion.span>
        ) : (
          <span aria-hidden="true" className="h-8 w-8 shrink-0" />
        )}
      </div>
    </motion.button>
  );
}
