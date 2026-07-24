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
  sessionId: string | null;
  sessionStartedAt: string | null;
  hasStarted: boolean;
  isCompleted: boolean;
  result: QuizResult | null;
  formSubmitted: boolean;

  // Acciones
  setQuestions: (questions: QuizQuestion[]) => void;
  startQuiz: (tracking?: {
    sessionId?: string | null;
    sessionStartedAt?: string | null;
  }) => void;
  setTrackingSession: (tracking: {
    sessionId?: string | null;
    sessionStartedAt?: string | null;
  }) => void;
  selectAnswer: (questionId: string, selectedOptionId: string) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  resetQuiz: () => void;
  completeQuiz: (result?: QuizResult) => QuizResult;
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
  const answerValues = answers
    .map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      const option = question?.options.find(
        (candidate) => candidate.id === answer.selectedOptionId
      );
      return typeof option?.value === "string" ? option.value : null;
    })
    .filter(Boolean) as string[];

  // Cada respuesta suma un punto al resultado asociado.
  const valueCount: Record<string, number> = {};
  answerValues.forEach((value) => {
    valueCount[value] = (valueCount[value] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(valueCount), 0);
  const tiedValues = Object.entries(valueCount)
    .filter(([, count]) => count === maxCount)
    .map(([value]) => value);

  let topValue = tiedValues[0] || QUIZ_RESULTS[0]?.id;

  if (tiedValues.length > 1) {
    const firstChosenTiedValue = answerValues.find((value) =>
      tiedValues.includes(value)
    );

    if (firstChosenTiedValue) {
      topValue = firstChosenTiedValue;
    }
  }

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
      sessionId: null,
      sessionStartedAt: null,
      hasStarted: false,
      isCompleted: false,
      result: null,
      formSubmitted: false,

      // Acciones
      setQuestions: (questions: QuizQuestion[]) => {
        set({ questions });
      },

      startQuiz: (tracking) => {
        set({
          currentQuestionIndex: 0,
          answers: [],
          sessionId: tracking?.sessionId ?? null,
          sessionStartedAt:
            tracking?.sessionStartedAt || new Date().toISOString(),
          hasStarted: true,
          isCompleted: false,
          result: null,
          formSubmitted: false,
        });
      },

      setTrackingSession: (tracking) => {
        set({
          sessionId: tracking.sessionId ?? null,
          sessionStartedAt: tracking.sessionStartedAt ?? get().sessionStartedAt,
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
          sessionId: null,
          sessionStartedAt: null,
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
        return finalResult;
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
        sessionId: state.sessionId,
        sessionStartedAt: state.sessionStartedAt,
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
          sessionId:
            typeof state?.sessionId === "string" ? state.sessionId : null,
          sessionStartedAt:
            typeof state?.sessionStartedAt === "string"
              ? state.sessionStartedAt
              : null,
          hasStarted: hasStoredProgress,
          isCompleted: false,
          result: null,
          formSubmitted: false,
        };
      },
    }
  )
);
