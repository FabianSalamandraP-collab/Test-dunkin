"use client";

// Importaciones necesarias
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Menu, X } from "lucide-react";
import Button from "./Button";

// Interfaz que define las propiedades de la barra de navegación
interface NavbarProps {
  logo?: React.ReactNode;
  onLogoClick?: () => void;
}

const Navbar = ({ logo, onLogoClick }: NavbarProps) => {
  // Estado para controlar el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // Contenedor fijo de la barra de navegación
    <nav className="bg-white/80 fixed left-0 right-0 top-0 z-40 border-b border-neutral-100 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo de la barra de navegación */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogoClick}
            className="flex items-center gap-3"
          >
            {logo || (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600">
                  <Coffee className="text-white h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-neutral-900">
                  {"Dunkin'"}
                </span>
              </div>
            )}
          </motion.button>

          {/* Botones de la barra de navegación (desktop) */}
          <div className="hidden items-center gap-6 md:flex">
            <Button variant="secondary" size="sm">
              Iniciar sesión
            </Button>
            <Button size="sm">Participar</Button>
          </div>

          {/* Botón para abrir/cerrar el menú móvil */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-8 w-8 text-neutral-900" />
            ) : (
              <Menu className="h-8 w-8 text-neutral-900" />
            )}
          </button>
        </div>

        {/* Menú móvil animado */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-4 py-6">
                <Button variant="secondary" className="w-full">
                  Iniciar sesión
                </Button>
                <Button className="w-full">Participar</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
