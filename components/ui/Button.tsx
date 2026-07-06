"use client";

// Importación de bibliotecas necesarias
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

// Definición de tipos para las props del botón
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Tipo de botón: principal (naranja Dunkin) o secundario (neutral)
  variant?: "primary" | "secondary";
  // Tamaño del botón: pequeño, mediano o grande
  size?: "sm" | "md" | "lg";
}

// Componente Button usando forwardRef para permitir referencias a elementos HTML
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "primary", size = "md", ...props }, ref) => {
    // Clases base que todos los botones comparten
    const baseClasses =
      "inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // Clases específicas según la variante del botón
    const variantClasses = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300 shadow-lg hover:shadow-xl",
      secondary:
        "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus:ring-neutral-300 border border-neutral-200",
    };

    // Clases específicas según el tamaño del botón
    const sizeClasses = {
      sm: "px-5 py-2.5 text-sm",
      md: "px-8 py-4 text-lg",
      lg: "px-12 py-5 text-xl",
    };

    return (
      // Botón con animaciones suaves al pasar el cursor y al hacer clic
      <motion.button
        ref={ref as any}
        whileHover={{ scale: 1.02 }} // Aumenta ligeramente el tamaño al pasar el cursor
        whileTap={{ scale: 0.98 }} // Reduce ligeramente el tamaño al hacer clic
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.button>
    );
  }
);

// Nombre del componente para desarrollo y herramientas de desarrollo
Button.displayName = "Button";

// Exportar componente para ser usado en otras partes del proyecto
export default Button;
