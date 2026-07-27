"use client";

// Pantalla principal del quiz
import { useQuizStore } from "@/store/quizStore";
import { IntroScreen } from "./IntroScreen";
import { QuestionScreen } from "./QuestionScreen";
import { ResultScreen } from "./ResultScreen";

export default function QuizScreen() {
  const { hasStarted, isCompleted, questions, result } = useQuizStore();

  // Si no hay preguntas disponibles, mostrar un error
  if (questions.length === 0) {
    return (
      <div className="bg-white flex min-h-[100svh] items-center justify-center p-8">
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
  if (isCompleted && result) {
    return <ResultScreen />;
  }

  if (isCompleted && !result) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[#FBF6F0] p-8">
        <div className="text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-[#4A281B]">
            Estamos preparando tu resultado
          </h2>
          <p className="mt-3 font-sans text-sm font-medium text-[#7A5A46]">
            Espera un momento mientras cargamos tu match Dunkin'.
          </p>
        </div>
      </div>
    );
  }

  // Si el usuario aún no inicia, mostrar una introducción visual al test
  if (!hasStarted) {
    return <IntroScreen />;
  }

  // Si no, mostrar la pantalla de preguntas
  return <QuestionScreen />;
}
