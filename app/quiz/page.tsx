"use client";

// Importamos el componente del quiz
import QuizScreen from "@/features/quiz/QuizScreen";

// Página principal del quiz
export default function QuizPage() {
  return (
    <div className="h-[100dvh] overflow-hidden lg:h-auto lg:overflow-visible">
      <QuizScreen />
    </div>
  );
}
