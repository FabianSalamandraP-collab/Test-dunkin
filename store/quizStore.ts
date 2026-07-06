import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { QuizAnswer, QuizQuestion, QuizResult } from "@/types/quiz";
import { QUIZ_QUESTIONS } from "@/constants/quizQuestions";

// Tipo para el estado del quiz
interface QuizStore {
  // Estado del quiz
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isCompleted: boolean;
  result: QuizResult | null;

  // Acciones
  setQuestions: (questions: QuizQuestion[]) => void;
  selectAnswer: (questionId: string, selectedOptionId: string) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  resetQuiz: () => void;
  completeQuiz: (result: QuizResult) => void;

  // Datos derivados
  currentQuestion: () => QuizQuestion | null;
  getAnswerForCurrentQuestion: () => QuizAnswer | null;
  progressPercentage: () => number;
}

// Función para generar un resultado de ejemplo
// En producción, esto estaría basado en las respuestas del usuario
const generateResult = (): QuizResult => {
  return {
    personalityType: "Enérgico y Creativo",
    title: "¡Eres un Dunkin Sunrise!",
    description: "Tu energía es contagiosa y siempre encuentras la manera de hacer del día algo especial. Un café con leche y un toque de naranja es tu bebida ideal para mantener el ritmo.",
    recommendedDrink: "Iced Coffee with Caramel",
  };
};

// Store principal del quiz con persistencia
export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      questions: QUIZ_QUESTIONS,
      currentQuestionIndex: 0,
      answers: [],
      isCompleted: false,
      result: null,

      // Acciones
      setQuestions: (questions: QuizQuestion[]) => {
        set({ questions });
      },

      selectAnswer: (questionId: string, selectedOptionId: string) => {
        const { answers } = get();
        // Si ya existe una respuesta para esta pregunta, la actualizamos
        const existingAnswerIndex = answers.findIndex(
          (a) => a.questionId === questionId
        );

        if (existingAnswerIndex >= 0) {
          const updatedAnswers = [...answers];
          updatedAnswers[existingAnswerIndex] = {
            questionId,
            selectedOptionId,
          };
          set({ answers: updatedAnswers });
        } else {
          // Si no existe, la agregamos
          set({
            answers: [...answers, { questionId, selectedOptionId }],
          });
        }
      },

      goToNextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      goToPreviousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      resetQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: [],
          isCompleted: false,
          result: null,
        });
      },

      completeQuiz: (result?: QuizResult) => {
        const finalResult = result || generateResult();
        set({
          isCompleted: true,
          result: finalResult,
        });
      },

      // Métodos derivados
      currentQuestion: () => {
        const { questions, currentQuestionIndex } = get();
        return questions[currentQuestionIndex] || null;
      },

      getAnswerForCurrentQuestion: () => {
        const { answers, currentQuestion } = get();
        const question = currentQuestion();
        if (!question) return null;
        return answers.find((a) => a.questionId === question.id) || null;
      },

      progressPercentage: () => {
        const { questions, answers } = get();
        if (questions.length === 0) return 0;
        return Math.round((answers.length / questions.length) * 100);
      },
    }),
    {
      name: "dunkin-quiz-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
