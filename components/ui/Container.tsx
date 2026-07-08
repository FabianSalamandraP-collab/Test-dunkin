"use client";

// Importaciones necesarias
import { ReactNode } from "react";

// Interfaz que define las propiedades del contenedor
interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const Container = ({ children, className, size = "xl" }: ContainerProps) => {
  // Mapeo de tamaños a clases CSS de ancho máximo
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    // Contenedor principal
    <div
      className={`mx-auto w-full px-6 py-12 md:py-20 ${maxWidthClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
