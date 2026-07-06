"use client";

import { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4"
          >
            <div className={`bg-white rounded-3xl shadow-2xl border border-neutral-100 ${className}`}>
              {(title || !hideCloseButton) && (
                <div className="flex items-center justify-between p-8 border-b border-neutral-100">
                  {title && (
                    <h3 className="text-2xl font-bold text-neutral-900">{title}</h3>
                  )}
                  {!hideCloseButton && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onClose}
                      className="!p-3"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}
              <div className="p-8">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
