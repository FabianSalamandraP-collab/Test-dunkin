"use client";

// Importaciones necesarias para el componente
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

// Interfaz que define las propiedades del checkbox
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

// Componente Checkbox con forwardRef para pasar la referencia al input interno
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, checked: controlledChecked, onChange, ...props }, ref) => {
    // Estado interno para el modo no controlado
    const [internalChecked, setInternalChecked] = useState(false);
    // Determina si el componente está en modo controlado
    const isControlled = controlledChecked !== undefined;
    // Valor del estado (usa el controlado si existe, si no el interno)
    const checked = isControlled ? controlledChecked : internalChecked;

    // Manejador del cambio de estado
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Si no es controlado, actualiza el estado interno
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      // Llama a la función onChange proporcionada (si existe)
      onChange?.(e);
    };

    return (
      // Etiqueta que envuelve el checkbox y el texto
      <label className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
        <div className="relative">
          {/* Input real (oculto visualmente pero funcional) */}
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
          {/* Contenedor visual del checkbox con animaciones */}
          <motion.div
            initial={false}
            animate={{
              backgroundColor: checked ? "#FF671F" : "#FFFFFF",
              borderColor: checked ? "#FF671F" : "#D4D4D4",
            }}
            className="w-6 h-6 rounded-lg border-2 flex items-center justify-center"
          >
            {/* Animación de entrada/salida del ícono de check */}
            <AnimatePresence>
              {checked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        {/* Texto de la etiqueta si se proporciona */}
        {label && <span className="text-neutral-700 font-medium">{label}</span>}
      </label>
    );
  }
);

// Nombre del componente para herramientas de desarrollo
Checkbox.displayName = "Checkbox";

export default Checkbox;
