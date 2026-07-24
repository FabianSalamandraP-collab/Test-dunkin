"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

const quizIconLinkVariants = cva(
  "inline-flex items-center justify-center rounded-full border transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF671F]/25",
  {
    variants: {
      tone: {
        cream:
          "border-white/70 bg-[#FFF8F1]/96 text-[#4A281B] shadow-[0_10px_24px_rgba(102,66,30,0.12)] ring-1 ring-white/60 backdrop-blur-sm",
        soft:
          "border-[#E6C8B3]/85 bg-[#FFF8F1]/96 text-[#4A281B] shadow-[0_10px_24px_rgba(102,66,30,0.12)] ring-1 ring-white/60",
      },
      size: {
        sm: "h-9 w-9",
        md: "h-11 w-11",
      },
    },
    defaultVariants: {
      tone: "soft",
      size: "sm",
    },
  }
);

export type QuizIconLinkProps = HTMLMotionProps<"a"> &
  VariantProps<typeof quizIconLinkVariants>;

export function QuizIconLink({
  className,
  tone,
  size,
  ...props
}: QuizIconLinkProps) {
  return (
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={cn(quizIconLinkVariants({ tone, size }), className)}
      {...props}
    />
  );
}

