"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

const quizIconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full border transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF671F]/25",
  {
    variants: {
      tone: {
        cream:
          "border-white/70 bg-[linear-gradient(180deg,#FFF9F3_0%,#FFF1E7_100%)] text-[#4A281B] shadow-[0_18px_40px_rgba(116,75,33,0.2)] ring-1 ring-[#E6C8B3]/70 backdrop-blur-sm",
        soft:
          "border-[#E6C8B3] bg-[#FFF7F0]/95 text-[#4A281B] shadow-[0_14px_34px_rgba(116,75,33,0.18)]",
      },
      size: {
        md: "h-11 w-11",
        lg: "h-12 w-12",
        sm: "h-9 w-9",
      },
    },
    defaultVariants: {
      tone: "cream",
      size: "md",
    },
  }
);

export type QuizIconButtonProps = HTMLMotionProps<"button"> &
  VariantProps<typeof quizIconButtonVariants>;

export function QuizIconButton({
  className,
  tone,
  size,
  ...props
}: QuizIconButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={cn(quizIconButtonVariants({ tone, size }), className)}
      {...props}
    />
  );
}

