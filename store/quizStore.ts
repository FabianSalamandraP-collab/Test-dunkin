import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { QuizAnswer, QuizQuestion, QuizResult } from "@/types/quiz";
import { QUIZ_QUESTIONS, QUIZ_RESULTS } from "@/constants/quizQuestions";

// Tipo para el estado del quiz
interface QuizStore {
  // Estado del quiz
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  hasStarted: boolean;
  isCompleted: boolean;
  result: QuizResult | null;
  formSubmitted: boolean;

  // Acciones
  setQuestions: (questions: QuizQuestion[]) => void;
  startQuiz: () => void;
  selectAnswer: (questionId: string, selectedOptionId: string) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  resetQuiz: () => void;
  completeQuiz: (result?: QuizResult) => void;
  setFormSubmitted: (submitted: boolean) => void;

  // Datos derivados
  currentQuestion: () => QuizQuestion | null;
  getAnswerForCurrentQuestion: () => QuizAnswer | null;
  progressPercentage: () => number;
}

// Función para generar un resultado basado en las respuestas
const generateResult = (
  answers: QuizAnswer[],
  questions: QuizQuestion[]
): QuizResult => {
  // Obtenemos todas las respuestas y sus valores
  const allValues = questions
    .map((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      if (!answer) return null;
      const option = q.options.find((o) => o.id === answer.selectedOptionId);
      return option?.value as string;
    })
    .filter(Boolean) as string[];

  // Contamos las ocurrencias de cada valor
  const valueCount: Record<string, number> = {};
  allValues.forEach((value) => {
    valueCount[value] = (valueCount[value] || 0) + 1;
  });

  // Obtenemos el valor con más ocurrencias
  let maxCount = 0;
  let topValue = "energetic";
  for (const [value, count] of Object.entries(valueCount)) {
    if (count > maxCount) {
      maxCount = count;
      topValue = value;
    }
  }

  // Buscamos el resultado correspondiente
  const result = QUIZ_RESULTS.find((r) => r.id === topValue) || QUIZ_RESULTS[0];
  return result;
};

// Store principal del quiz con persistencia
export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      questions: QUIZ_QUESTIONS,
      currentQuestionIndex: 0,
      answers: [],
      hasStarted: false,
      isCompleted: false,
      result: null,
      formSubmitted: false,

      // Acciones
      setQuestions: (questions: QuizQuestion[]) => {
        set({ questions });
      },

      startQuiz: () => {
        set({
          currentQuestionIndex: 0,
          answers: [],
          hasStarted: true,
          isCompleted: false,
          result: null,
          formSubmitted: false,
        });
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
          hasStarted: false,
          isCompleted: false,
          result: null,
          formSubmitted: false,
        });
      },

      completeQuiz: (result?: QuizResult) => {
        const { answers, questions } = get();
        const finalResult = result || generateResult(answers, questions);
        set({
          isCompleted: true,
          result: finalResult,
        });
      },

      setFormSubmitted: (submitted: boolean) => {
        set({ formSubmitted: submitted });
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
      version: 4,
      // Persistimos solo el avance parcial del quiz.
      // No persistimos el contenido de preguntas, el resultado final ni el estado
      // del formulario para evitar contenido viejo o saltos de flujo al volver.
      partialize: (state) => ({
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<QuizStore> | undefined;
        const hasStoredProgress =
          (typeof state?.currentQuestionIndex === "number" &&
            state.currentQuestionIndex > 0) ||
          (Array.isArray(state?.answers) && state.answers.length > 0);

        return {
          questions: QUIZ_QUESTIONS,
          currentQuestionIndex:
            typeof state?.currentQuestionIndex === "number"
              ? state.currentQuestionIndex
              : 0,
          answers: Array.isArray(state?.answers) ? state.answers : [],
          hasStarted: hasStoredProgress,
          isCompleted: false,
          result: null,
          formSubmitted: false,
        };
      },
    }
  )
);
