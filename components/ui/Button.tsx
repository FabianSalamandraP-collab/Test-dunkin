"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "primary", size = "md", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300 shadow-lg hover:shadow-xl",
      secondary:
        "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus:ring-neutral-300 border border-neutral-200",
    };

    const sizeClasses = {
      sm: "px-5 py-2.5 text-sm",
      md: "px-8 py-4 text-lg",
      lg: "px-12 py-5 text-xl",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
