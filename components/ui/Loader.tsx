"use client";

// Importación de la librería de animaciones
import { motion, type Variants } from "framer-motion";

// Interfaz que define las propiedades del cargador
interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white";
  className?: string;
}

const Loader = ({
  size = "md",
  color = "primary",
  className = "",
}: LoaderProps) => {
  // Mapeo de tamaños a clases CSS
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  // Mapeo de colores a clases CSS
  const colors = {
    primary: "bg-primary-500",
    white: "bg-white",
  };

  // Variantes de animación para los puntos
  const dotVariants: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    // Contenedor principal del cargador
    <div className={`flex items-center gap-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        // Cada punto con animación escalonada
        <motion.div
          key={i}
          className={`${sizes[size]} ${colors[color]} rounded-full`}
          variants={dotVariants}
          animate="animate"
          transition={{ delay: i * 0.2 }}
        />
      ))}
    </div>
  );
};

export default Loader;
