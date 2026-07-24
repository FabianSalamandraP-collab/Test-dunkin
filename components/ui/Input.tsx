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
          <label className="font-sans text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        {/* Campo de entrada con estilos responsive */}
        <input
          ref={ref}
          className={`w-full rounded-xl border px-4 py-4 font-sans text-neutral-900 transition-all placeholder:font-sans placeholder:text-neutral-400 focus:outline-none focus:ring-4 ${error ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-100" : "bg-white/82 border-[rgba(245,130,32,0.10)] shadow-[0_10px_22px_rgba(89,53,17,0.04)] focus:border-[#F59B53] focus:ring-[rgba(255,196,153,0.34)]"} ${className}`}
          {...props}
        />
        {/* Mostrar mensaje de error si existe */}
        {error && (
          <p className="text-red-500 font-sans text-sm font-medium">{error}</p>
        )}
      </div>
    );
  }
);

// Nombre del componente para desarrollo y herramientas de desarrollo
Input.displayName = "Input";

// Exportar componente para ser usado en otras partes del proyecto
export default Input;
