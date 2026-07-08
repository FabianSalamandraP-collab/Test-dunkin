"use client";

// Importaciones necesarias
import { ReactNode } from "react";
import { motion } from "framer-motion";

// Interfaz que define las propiedades del Hero
interface HeroProps {
  title: string | ReactNode;
  subtitle?: string;
  image?: ReactNode;
  cta?: ReactNode;
  className?: string;
}

const Hero = ({ title, subtitle, image, cta, className }: HeroProps) => {
  return (
    // Contenedor principal del Hero
    <section className={`py-20 md:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Contenido del lado izquierdo (texto y botón) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              {/* Título del Hero (texto o ReactNode) */}
              {typeof title === "string" ? (
                <h1 className="text-4xl font-bold leading-tight text-neutral-900 md:text-6xl">
                  {title}
                </h1>
              ) : (
                title
              )}
              {/* Subtítulo del Hero */}
              {subtitle && (
                <p className="max-w-md text-xl leading-relaxed text-neutral-600 md:text-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            {/* Botón o sección de CTA */}
            {cta && <div>{cta}</div>}
          </motion.div>

          {/* Contenido del lado derecho (imagen) */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                {/* Glow effect detrás de la imagen */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-primary-200 to-secondary-200 opacity-30 blur-3xl" />
                <div className="relative">{image}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
