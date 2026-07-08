"use client";

// Pantalla principal del quiz
import { useQuizStore } from "@/store/quizStore";
import { IntroScreen } from "./IntroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ResultScreen } from "./ResultScreen";

export default function QuizScreen() {
  const { hasStarted, isCompleted, questions } = useQuizStore();

  // Si no hay preguntas disponibles, mostrar un error
  if (questions.length === 0) {
    return (
      <div className="bg-white flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-neutral-800">
            ¡No hay preguntas disponibles!
          </h2>
          <p className="text-neutral-600">Por favor, vuelve más tarde.</p>
        </div>
      </div>
    );
  }

  // Si el quiz está completado, mostrar la pantalla de resultados
  if (isCompleted) {
    return <ResultScreen />;
  }

  // Si el usuario aún no inicia, mostrar una introducción visual al test
  if (!hasStarted) {
    return <IntroScreen />;
  }

  // Si no, mostrar la pantalla de preguntas
  return <QuestionScreen />;
}
