"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, checked: controlledChecked, onChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(false);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      onChange?.(e);
    };

    return (
      <label className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
          <motion.div
            initial={false}
            animate={{
              backgroundColor: checked ? "#FF671F" : "#FFFFFF",
              borderColor: checked ? "#FF671F" : "#D4D4D4",
            }}
            className="w-6 h-6 rounded-lg border-2 flex items-center justify-center"
          >
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
        {label && <span className="text-neutral-700 font-medium">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
