"use client";

// Importaciones necesarias para el componente
import { InputHTMLAttributes, ReactNode, forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

// Interfaz que define las propiedades del checkbox
interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: ReactNode;
  error?: string;
}

// Componente Checkbox con forwardRef para pasar la referencia al input interno
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, error, className, checked: controlledChecked, onChange, ...props },
    ref
  ) => {
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
      <div className="space-y-2">
        {/* Etiqueta que envuelve el checkbox y el texto */}
        <label
          className={`flex cursor-pointer select-none items-start gap-3 ${className}`}
        >
          <div className="relative pt-0.5">
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
                backgroundColor: checked ? "#FF671F" : "rgba(255,255,255,0.78)",
                borderColor: checked ? "#FF671F" : "rgba(245,130,32,0.14)",
              }}
              className="flex h-6 w-6 items-center justify-center rounded-lg border shadow-[0_8px_18px_rgba(89,53,17,0.05)]"
            >
              {/* Animación de entrada/salida del ícono de check */}
              <AnimatePresence>
                {checked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <Check className="text-white h-4 w-4" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          {/* Texto de la etiqueta si se proporciona */}
          {label && (
            <span className="block font-sans font-medium leading-6 text-[#4A281B]">
              {label}
            </span>
          )}
        </label>
        {error ? (
          <p className="text-red-600 font-sans text-sm font-medium">{error}</p>
        ) : null}
      </div>
    );
  }
);

// Nombre del componente para herramientas de desarrollo
Checkbox.displayName = "Checkbox";

export default Checkbox;
