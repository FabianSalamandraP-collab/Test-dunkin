"use client";

// Importaciones necesarias
import { motion } from "framer-motion";
import Button from "./Button";

// Interfaz para las opciones de la pregunta
interface Option {
  id: string;
  label: string;
  emoji?: string;
}

// Interfaz que define las propiedades de la tarjeta de pregunta
interface QuestionCardProps {
  question: string;
  options: Option[];
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onBack?: () => void;
  canGoNext?: boolean;
  isLast?: boolean;
}

const QuestionCard = ({
  question,
  options,
  selectedOptionId,
  onSelectOption,
  onNext,
  onBack,
  canGoNext = true,
  isLast = false,
}: QuestionCardProps) => {
  return (
    // Contenedor principal de la tarjeta con animación
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl p-8 md:p-12 shadow-card border border-neutral-100 max-w-2xl w-full"
    >
      {/* Título de la pregunta */}
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8 leading-tight">
        {question}
      </h2>

      {/* Lista de opciones */}
      <div className="space-y-4 mb-10">
        {options.map((option, index) => (
          // Botón de opción con animación escalonada
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectOption(option.id)}
            className={`w-full text-left px-6 py-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
              selectedOptionId === option.id
                ? "border-primary-500 bg-primary-50 shadow-lg"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            {/* Emoji de la opción (si existe) */}
            {option.emoji && <span className="text-3xl">{option.emoji}</span>}
            <span className={`text-lg font-semibold flex-1 ${
              selectedOptionId === option.id ? "text-primary-700" : "text-neutral-700"
            }`}>
              {option.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-4">
        {onBack && (
          <Button variant="secondary" onClick={onBack} className="flex-1">
            Atrás
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className={onBack ? "flex-1" : "w-full"}
        >
          {isLast ? "Ver resultado" : "Siguiente"}
        </Button>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
