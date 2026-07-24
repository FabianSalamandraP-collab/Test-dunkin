"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const quizBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1.5",
  {
    variants: {
      tone: {
        glass: "bg-white/72",
        soft: "bg-white/60",
      },
      density: {
        roomy: "",
        compact: "px-2.5 py-1",
      },
    },
    defaultVariants: {
      tone: "glass",
      density: "roomy",
    },
  }
);

export type QuizBadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof quizBadgeVariants>;

export function QuizBadge({ className, tone, density, ...props }: QuizBadgeProps) {
  return (
    <span
      className={cn(quizBadgeVariants({ tone, density }), className)}
      {...props}
    />
  );
}
