"use client";

import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const Container = ({ children, className, size = "xl" }: ContainerProps) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div className={`w-full mx-auto px-6 py-12 md:py-20 ${maxWidthClasses[size]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
