"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-semibold text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-4 rounded-xl border-2 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "border-neutral-200"} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
