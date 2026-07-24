"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";
import {
  getQuizTrackingClientContext,
  postQuizTracking,
  toDrinkKey,
} from "@/lib/quiz-tracking-client";
import { useQuizStore } from "@/store/quizStore";
import { QuizQuestion } from "@/types/quiz";
import { quizOptionThemes, quizTypography } from "./quizVisualSystem";
import { AnswerCard } from "./components/AnswerCard";
import { QuestionHeader } from "./components/QuestionHeader";

function renderHighlightedQuestion(question: QuizQuestion) {
  if (!question.questionHighlight) {
    return question.question;
  }

  const highlightStart = question.question.indexOf(question.questionHighlight);

  if (highlightStart === -1) {
    return question.question;
  }

  const beforeHighlight = question.question.slice(0, highlightStart);
  const highlightedText = question.questionHighlight;
  const afterHighlight = question.question.slice(
    highlightStart + highlightedText.length
  );

  return (
    <>
      {beforeHighlight}
      <span className="text-[#FF671F]">{highlightedText}</span>
      {afterHighlight}
    </>
  );
}

export function QuestionScreen() {
  const {
    questions,
    currentQuestionIndex,
    currentQuestion,
    getAnswerForCurrentQuestion,
    selectAnswer,
    goToNextQuestion,
    completeQuiz,
    sessionId,
    sessionStartedAt,
    hasStarted,
    isCompleted,
  } = useQuizStore();

  const question = currentQuestion();
  const currentAnswer = getAnswerForCurrentQuestion();

  if (!question) {
    return null;
  }

  const questionNumber = currentQuestionIndex + 1;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canGoNext = Boolean(currentAnswer);
  const progressPercentage = (questionNumber / questions.length) * 100;
  const sessionIdRef = useRef(sessionId);
  const hasStartedRef = useRef(hasStarted);
  const isCompletedRef = useRef(isCompleted);
  const questionIdRef = useRef(question.id);
  const questionOrderRef = useRef(questionNumber);

  useEffect(() => {
    sessionIdRef.current = sessionId;
    hasStartedRef.current = hasStarted;
    isCompletedRef.current = isCompleted;
    questionIdRef.current = question.id;
    questionOrderRef.current = questionNumber;
  }, [sessionId, hasStarted, isCompleted, question.id, questionNumber]);

  useEffect(() => {
    const handlePageHide = () => {
      if (
        !hasStartedRef.current ||
        isCompletedRef.current ||
        !sessionIdRef.current
      ) {
        return;
      }

      const trackingContext = getQuizTrackingClientContext();

      void postQuizTracking(
        "/api/quiz/session/abandon",
        {
          sessionId: sessionIdRef.current,
          questionKey: questionIdRef.current,
          questionOrder: questionOrderRef.current,
          ...trackingContext,
        },
        { keepalive: true, silent: true }
      );
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const handleNext = () => {
    if (isLastQuestion) {
      const finalResult = completeQuiz();
      const trackingContext = getQuizTrackingClientContext();
      const durationSeconds = sessionStartedAt
        ? Math.max(
            1,
            Math.round(
              (Date.now() - new Date(sessionStartedAt).getTime()) / 1000
            )
          )
        : null;

      if (sessionId) {
        void postQuizTracking(
          "/api/quiz/session/complete",
          {
            sessionId,
            personalityKey: finalResult.id,
            personalityLabel: finalResult.personalityType,
            recommendedDrinkKey: toDrinkKey(finalResult.recommendedDrink),
            recommendedDrinkLabel: finalResult.recommendedDrink,
            score: questions.length,
            totalDurationSeconds: durationSeconds,
            ...trackingContext,
          },
          { silent: true }
        );
      }

      return;
    }

    goToNextQuestion();
  };

  return (
    <div className="question-stage-page min-h-screen bg-[#F7F2EC] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="question-stage-shell border-white/65 relative mx-auto flex min-h-[calc(100svh-2rem)] max-w-[1320px] overflow-hidden rounded-[2.2rem] border bg-[linear-gradient(180deg,#FCF9F5_0%,#F6F0E8_100%)] shadow-[0_32px_80px_rgba(89,53,17,0.12)]">
        <div className="pointer-events-none absolute -left-24 top-12 h-56 w-56 rounded-full bg-[#FF671F]/10 blur-[90px]" />
        <div className="pointer-events-none absolute right-[-4rem] top-[24%] h-72 w-72 rounded-full bg-[#E9539A]/10 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[-4rem] left-[24%] h-64 w-64 rounded-full bg-[#F2B11B]/10 blur-[110px]" />

        <AnimatePresence mode="wait">
          <motion.section
            key={question.id}
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.99 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-full flex-1 flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-16"
          >
            <div className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col">
              <QuestionHeader
                questionNumber={questionNumber}
                totalQuestions={questions.length}
                eyebrow={question.eyebrow || `Pregunta ${questionNumber}`}
                progressPercentage={progressPercentage}
              />

              <div className="flex flex-1 flex-col justify-center py-8 sm:py-10 lg:py-12">
                <div className="mx-auto w-full max-w-[1080px]">
                  <div className="max-w-[860px]">
                    <p className={quizTypography.sectionLabel}>
                      Responde rápido
                    </p>
                    <h2 className={`${quizTypography.questionTitle} mt-3`}>
                      {renderHighlightedQuestion(question)}
                    </h2>
                  </div>

                  <div className="mt-8 grid gap-3 sm:gap-4 lg:mt-10 lg:grid-cols-2">
                    {question.options.map((option, index) => {
                      const isSelected =
                        currentAnswer?.selectedOptionId === option.id;
                      const theme =
                        quizOptionThemes[String(option.value)] ||
                        quizOptionThemes.creative;
                      const optionLetter = String.fromCharCode(65 + index);

                      return (
                        <AnswerCard
                          key={option.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08 + index * 0.06 }}
                          onClick={() => {
                            selectAnswer(question.id, option.id);

                            if (sessionId) {
                              const trackingContext =
                                getQuizTrackingClientContext();

                              void postQuizTracking(
                                "/api/quiz/session/answer",
                                {
                                  sessionId,
                                  questionKey: question.id,
                                  questionOrder: questionNumber,
                                  selectedOptionKey: option.id,
                                  selectedOptionLabel: option.label,
                                  selectedValue:
                                    typeof option.value === "string"
                                      ? option.value
                                      : String(option.value),
                                  ...trackingContext,
                                },
                                { silent: true }
                              );
                            }
                          }}
                          label={option.label}
                          letter={optionLetter}
                          selected={isSelected}
                          theme={theme}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[1080px] pt-2 sm:pt-4">
              <Button
                variant="quizCta"
                size="quiz"
                onClick={handleNext}
                disabled={!canGoNext}
                className="w-full sm:w-auto sm:min-w-[220px]"
              >
                {isLastQuestion ? "Ver resultado" : "Continuar"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
