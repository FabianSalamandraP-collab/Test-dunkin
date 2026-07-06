"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface HeroProps {
  title: string | ReactNode;
  subtitle?: string;
  image?: ReactNode;
  cta?: ReactNode;
  className?: string;
}

const Hero = ({ title, subtitle, image, cta, className }: HeroProps) => {
  return (
    <section className={`py-20 md:py-32 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              {typeof title === "string" ? (
                <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight">
                  {title}
                </h1>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-xl md:text-2xl text-neutral-600 max-w-lg leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {cta && <div>{cta}</div>}
          </motion.div>

          {image && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-[3rem] blur-3xl opacity-30" />
                <div className="relative">
                  {image}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
