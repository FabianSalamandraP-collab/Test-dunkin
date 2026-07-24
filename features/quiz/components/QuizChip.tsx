"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const quizChipVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1.5",
  {
    variants: {
      tone: {
        glass: "bg-white/72",
        soft: "bg-white/58",
      },
    },
    defaultVariants: {
      tone: "glass",
    },
  }
);

export type QuizChipProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof quizChipVariants>;

export function QuizChip({ className, tone, ...props }: QuizChipProps) {
  return <span className={cn(quizChipVariants({ tone }), className)} {...props} />;
}
