"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Menu, X } from "lucide-react";
import Button from "./Button";

interface NavbarProps {
  logo?: React.ReactNode;
  onLogoClick?: () => void;
}

const Navbar = ({ logo, onLogoClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogoClick}
            className="flex items-center gap-3"
          >
            {logo || (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-neutral-900">Dunkin</span>
              </div>
            )}
          </motion.button>

          <div className="hidden md:flex items-center gap-6">
            <Button variant="secondary" size="sm">
              Iniciar sesión
            </Button>
            <Button size="sm">Participar</Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-8 h-8 text-neutral-900" /> : <Menu className="w-8 h-8 text-neutral-900" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 flex flex-col gap-4">
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
