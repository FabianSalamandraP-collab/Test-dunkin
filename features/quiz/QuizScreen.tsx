"use client";

// Pantalla principal del quiz
import { useQuizStore } from "@/store/quizStore";
import { QuestionScreen } from "./QuestionScreen";
import { ResultScreen } from "./ResultScreen";
import { Loader } from "@/components/ui";

export default function QuizScreen() {
  const { isCompleted, questions } = useQuizStore();

  // Si no hay preguntas disponibles, mostrar un error
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">
            ¡No hay preguntas disponibles!
          </h2>
          <p className="text-neutral-600">
            Por favor, vuelve más tarde.
          </p>
        </div>
      </div>
    );
  }

  // Si el quiz está completado, mostrar la pantalla de resultados
  if (isCompleted) {
    return <ResultScreen />;
  }

  // Si no, mostrar la pantalla de preguntas
  return <QuestionScreen />;
}
