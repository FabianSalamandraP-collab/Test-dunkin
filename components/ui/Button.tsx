"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl font-sans font-medium tracking-[-0.02em] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white shadow-lg hover:bg-primary-600 hover:shadow-xl focus:ring-primary-300",
        secondary:
          "border border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus:ring-neutral-300",
        quizCta:
          "rounded-full border border-transparent bg-[#EF6A00] text-[#F8F4F1] shadow-none hover:border-[#EF6A00] hover:bg-[#FFF8F1] hover:text-[#EF6A00] active:border-[#EF6A00] active:bg-[#FFF8F1] active:text-[#EF6A00] focus:ring-[rgba(239,106,0,0.22)]",
        quizSecondary:
          "rounded-full border border-[#E8DCCF] bg-white text-[#4A281B] shadow-none hover:bg-[#FFF8F2] focus:ring-[rgba(232,220,207,0.22)]",
        quizPill:
          "rounded-full border border-[#E6C8B3] bg-[#FFF3E8]/90 text-[#4A281B] shadow-[0_10px_26px_rgba(102,66,30,0.12)] hover:bg-[#FFF7F0]",
      },
      size: {
        sm: "px-5 py-2.5 text-sm",
        md: "px-8 py-4 text-lg",
        lg: "px-12 py-5 text-xl",
        quiz: "px-8 py-3 text-[1rem]",
        quizLg: "px-8 py-3.5 text-[1rem] sm:px-9",
        quizPill: "px-4 py-2 text-[0.9rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends HTMLMotionProps<"button">, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
