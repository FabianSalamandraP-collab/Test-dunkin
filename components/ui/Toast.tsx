"use client";

// Importaciones necesarias
import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

// Tipos de notificaciones (toasts)
type ToastType = "success" | "error" | "warning" | "info";

// Interfaz que define la estructura de una notificación
interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

// Interfaz del contexto de las notificaciones
interface ToastContextType {
  addToast: (toast: Omit<ToastData, "id">) => void;
}

// Creación del contexto
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de notificaciones
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Proveedor del contexto de notificaciones
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  // Estado para almacenar las notificaciones activas
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Función para agregar una nueva notificación
  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  // Función para eliminar una notificación
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Contenedor fijo para las notificaciones */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {/* Renderiza cada notificación */}
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Componente individual de notificación
const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: ToastData;
  onRemove: (id: string) => void;
}) => {
  // Efecto para autoeliminar la notificación después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  // Mapeo de tipos de notificación a íconos
  const icons = {
    success: <CheckCircle2 className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-500" />,
    info: <AlertCircle className="w-6 h-6 text-blue-500" />,
  };

  // Mapeo de tipos de notificación a colores de fondo
  const bgColors = {
    success: "bg-green-50 border-green-100",
    error: "bg-red-50 border-red-100",
    warning: "bg-yellow-50 border-yellow-100",
    info: "bg-blue-50 border-blue-100",
  };

  return (
    // Contenedor animado de la notificación
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className={`pointer-events-auto bg-white border rounded-2xl shadow-card p-4 flex items-start gap-4 min-w-[320px] ${bgColors[toast.type]}`}
    >
      {icons[toast.type]}
      <p className="flex-1 text-neutral-800 font-medium">{toast.message}</p>
      {/* Botón para cerrar manualmente la notificación */}
      <button
        onClick={() => onRemove(toast.id)}
        className="text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default ToastItem;
