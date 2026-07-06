"use client";

// Pantalla de preguntas del quiz
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, ArrowLeft, ArrowRight } from "lucide-react";
import { ProgressBar, Button } from "@/components/ui";
import { useQuizStore } from "@/store/quizStore";

export function QuestionScreen() {
  const {
    questions,
    currentQuestionIndex,
    answers,
    currentQuestion,
    getAnswerForCurrentQuestion,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    completeQuiz,
  } = useQuizStore();

  const question = currentQuestion();
  const currentAnswer = getAnswerForCurrentQuestion();

  if (!question) {
    return null;
  }

  const handleAnswerSelect = (optionId: string) => {
    selectAnswer(question.id, optionId);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToNextQuestion();
    } else {
      // Si es la última pregunta, completar el quiz
      completeQuiz();
    }
  };

  const canGoNext = !!currentAnswer;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Barra de progreso */}
      <div className="px-6 pt-12 pb-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar
            progress={currentQuestionIndex + 1}
            max={questions.length}
            className="mb-6"
          />
        </div>
      </div>

      {/* Contenedor principal de la pregunta */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-10"
            >
              {/* Título de la pregunta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
                  {question.question}
                </h2>
              </motion.div>

              {/* Tarjetas de opciones */}
              <div className="grid gap-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                      currentAnswer?.selectedOptionId === option.id
                        ? "border-primary-500 bg-primary-50 shadow-xl shadow-primary-100"
                        : "border-neutral-200 bg-white hover:border-primary-300 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {option.emoji && (
                        <span className="text-4xl">{option.emoji}</span>
                      )}
                      <span className={`text-lg md:text-xl font-semibold flex-1 ${
                        currentAnswer?.selectedOptionId === option.id
                          ? "text-primary-700"
                          : "text-neutral-700"
                      }`}>
                        {option.label}
                      </span>
                      {currentAnswer?.selectedOptionId === option.id && (
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Botones de navegación */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 pt-4"
              >
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={goToPreviousQuestion}
                    className="flex-1 sm:flex-none"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Anterior
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className={`flex-1 sm:flex-auto ${
                    currentQuestionIndex === 0 ? "sm:ml-auto" : ""
                  }`}
                >
                  {isLastQuestion ? (
                    <>
                      Ver resultado
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
