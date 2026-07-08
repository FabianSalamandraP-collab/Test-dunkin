"use client";

// Importaciones necesarias
import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";

// Interfaz que define las propiedades del modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  hideCloseButton?: boolean;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  hideCloseButton = false,
  className,
}: ModalProps) => {
  // Efecto para manejar el cierre con tecla Escape y bloquear el scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro del modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="bg-black/60 fixed inset-0 z-50 backdrop-blur-sm"
          />
          {/* Contenedor principal del modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 mx-4 w-full max-w-lg -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className={`bg-white rounded-3xl border border-neutral-100 shadow-2xl ${className}`}
            >
              {/* Cabecera del modal con título y botón de cerrar */}
              {(title || !hideCloseButton) && (
                <div className="flex items-center justify-between border-b border-neutral-100 p-8">
                  {title && (
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {title}
                    </h3>
                  )}
                  {!hideCloseButton && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onClose}
                      className="!p-3"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}
              {/* Contenido del modal */}
              <div className="p-8">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
