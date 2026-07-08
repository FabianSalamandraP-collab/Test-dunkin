"use client";

// Importación de bibliotecas necesarias
import { InputHTMLAttributes, forwardRef } from "react";

// Definición de tipos para las props del input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Etiqueta del campo (opcional)
  label?: string;
  // Mensaje de error (opcional)
  error?: string;
}

// Componente Input usando forwardRef para permitir referencias a elementos HTML
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {/* Mostrar etiqueta si existe */}
        {label && (
          <label className="text-sm font-semibold text-neutral-700">
            {label}
          </label>
        )}
        {/* Campo de entrada con estilos responsive */}
        <input
          ref={ref}
          className={`bg-white w-full rounded-xl border-2 px-4 py-4 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-neutral-200"} ${className}`}
          {...props}
        />
        {/* Mostrar mensaje de error si existe */}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      </div>
    );
  }
);

// Nombre del componente para desarrollo y herramientas de desarrollo
Input.displayName = "Input";

// Exportar componente para ser usado en otras partes del proyecto
export default Input;
