"use client";

// Pantalla de preguntas del quiz
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Flame,
  IceCreamCone,
  MapPin,
  MessagesSquare,
  Music4,
  PartyPopper,
  Send,
  Smile,
  Sparkles,
  Star,
  SunMedium,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useQuizStore } from "@/store/quizStore";
import { QuizQuestion } from "@/types/quiz";

const optionIcons = {
  send: Send,
  "messages-square": MessagesSquare,
  "map-pin": MapPin,
  smile: Smile,
  "music-4": Music4,
  sparkles: Sparkles,
  compass: Compass,
  "ice-cream-cone": IceCreamCone,
  star: Star,
  users: Users,
  trophy: Trophy,
  "sun-medium": SunMedium,
  flame: Flame,
  "party-popper": PartyPopper,
} as const;

function QuestionVisual({
  question,
  questionNumber,
}: {
  question: QuizQuestion;
  questionNumber: number;
}) {
  const [imageHidden, setImageHidden] = useState(false);

  if (question.image && !imageHidden) {
    return (
      <img
        src={question.image}
        alt={question.imageAlt || question.question}
        className="relative z-10 max-h-[420px] w-auto object-contain drop-shadow-[0_25px_45px_rgba(87,45,0,0.16)]"
        onError={() => setImageHidden(true)}
      />
    );
  }

  return (
    <div className="relative z-10 flex h-[340px] w-[220px] items-end justify-center rounded-[42px] bg-[linear-gradient(180deg,#f9e5cf_0%,#e8bd8c_100%)] shadow-[0_24px_50px_rgba(140,81,24,0.16)]">
      <div className="bg-white/45 absolute inset-x-4 top-5 h-7 rounded-full blur-md" />
      <div className="absolute bottom-5 top-16 w-[2px] bg-[#FF7A00]/55" />
      <span className="absolute inset-y-0 right-8 flex items-center text-[2.6rem] font-black tracking-[-0.08em] text-[#FF7A00] [writing-mode:vertical-rl]">
        DUNKIN'
      </span>
      <div className="border-white/70 absolute -top-6 left-1/2 h-12 w-[72%] -translate-x-1/2 rounded-full border-[5px] bg-[#f6d8b7]" />
      <div className="bg-white/18 absolute bottom-10 left-1/2 h-20 w-[84%] -translate-x-1/2 rounded-[999px] blur-lg" />
      <div className="bg-[#c69163]/22 absolute bottom-7 left-1/2 h-6 w-[78%] -translate-x-1/2 rounded-[999px] blur-md" />
      <span className="absolute left-1/2 top-20 -translate-x-1/2 text-sm font-semibold uppercase tracking-[0.28em] text-[#8F5C35]">
        Q{questionNumber}
      </span>
    </div>
  );
}

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
  const questionNumber = currentQuestionIndex + 1;
  const progressPercentage = (questionNumber / questions.length) * 100;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3ede6] px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1400px] overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f7f3ee_0%,#f8f5f1_100%)] shadow-[0_30px_80px_rgba(89,53,17,0.12)]">
        <div className="grid min-h-[calc(100vh-1.5rem)] grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid min-h-[calc(100vh-1.5rem)] grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)]"
            >
              <div className="relative z-10 flex flex-col justify-between px-6 py-7 sm:px-9 lg:px-12 lg:py-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold tracking-[0.22em] text-[#46372D]">
                        {String(questionNumber).padStart(2, "0")} -{" "}
                        {String(questions.length).padStart(2, "0")}
                      </span>
                      <div className="h-[3px] flex-1 rounded-full bg-[#E4D9CD]">
                        <div
                          className="h-full rounded-full bg-[#FF7A00] transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7A6A5B]">
                        {question.eyebrow ||
                          `Pregunta ${questionNumber} de ${questions.length}`}
                      </p>
                      <h2 className="max-w-[620px] text-[2rem] font-black leading-[1.04] tracking-[-0.05em] text-[#181310] sm:text-[2.6rem] lg:text-[3.2rem]">
                        {question.question}
                      </h2>
                      {question.supportingText ? (
                        <p className="max-w-[580px] text-base leading-7 text-[#6E6258] sm:text-lg">
                          {question.supportingText}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {question.options.map((option, index) => {
                      const Icon =
                        option.icon && option.icon in optionIcons
                          ? optionIcons[option.icon as keyof typeof optionIcons]
                          : Sparkles;
                      const isSelected =
                        currentAnswer?.selectedOptionId === option.id;

                      return (
                        <motion.button
                          key={option.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 + index * 0.07 }}
                          whileHover={{ y: -2, scale: 1.01 }}
                          whileTap={{ scale: 0.985 }}
                          onClick={() => handleAnswerSelect(option.id)}
                          className={`group flex w-full items-center gap-4 rounded-[1.35rem] border px-5 py-4 text-left transition-all sm:px-6 sm:py-5 ${
                            isSelected
                              ? "border-[#FF7A00] bg-[#FFF1E2] shadow-[0_18px_30px_rgba(255,122,0,0.14)]"
                              : "bg-white border-[#E6D9CE] hover:border-[#FFB06A] hover:bg-[#FFF9F2]"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                              isSelected
                                ? "bg-white border-[#FFB066] text-[#FF7A00]"
                                : "border-[#FFD2A8] bg-[#FFF7EF] text-[#FF7A00]"
                            }`}
                          >
                            <Icon className="h-5 w-5" strokeWidth={1.9} />
                          </div>

                          <span
                            className={`flex-1 text-base font-semibold sm:text-[1.05rem] ${
                              isSelected ? "text-[#2A211B]" : "text-[#3C3128]"
                            }`}
                          >
                            {option.label}
                          </span>

                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                              isSelected
                                ? "text-white bg-[#FF7A00]"
                                : "text-transparent bg-[#F7F2EC] group-hover:text-[#FFB06A]"
                            }`}
                          >
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
                >
                  {currentQuestionIndex > 0 ? (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={goToPreviousQuestion}
                      className="bg-white rounded-full border-[#E8DCCF] px-6 py-3 text-[#4A281B] shadow-none"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                  ) : (
                    <div />
                  )}

                  <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className="rounded-full px-7 py-3.5 shadow-[0_18px_30px_rgba(255,122,0,0.22)] disabled:shadow-none sm:ml-auto"
                  >
                    {isLastQuestion ? "Ver resultado" : "Continuar"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="pointer-events-none relative hidden overflow-hidden bg-[linear-gradient(180deg,#faf8f5_0%,#f7f1ea_100%)] lg:flex lg:items-center lg:justify-center">
                <div
                  className="absolute inset-y-0 left-0 w-px bg-[#EADFD4]"
                  aria-hidden="true"
                />
                <div className="absolute right-[18%] top-[18%] grid grid-cols-6 gap-3 opacity-80">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <span
                      key={index}
                      className="h-[3px] w-[3px] rounded-full bg-[#FF7A00]"
                    />
                  ))}
                </div>
                <div
                  className="absolute bottom-[20%] left-[16%] h-10 w-10 rounded-full"
                  style={{
                    backgroundColor: question.accentColor || "#FF7A00",
                  }}
                />
                <div
                  className="absolute bottom-[24%] right-[24%] h-[260px] w-[260px] rounded-full opacity-95"
                  style={{
                    background:
                      question.accentColor && question.decorativeColor
                        ? `radial-gradient(circle, ${question.accentColor} 0%, ${question.decorativeColor} 58%, rgba(255,255,255,0) 62%)`
                        : "radial-gradient(circle, #FFB066 0%, #F6E2CE 56%, rgba(255,255,255,0) 62%)",
                  }}
                />
                <div className="bg-[#B38457]/12 absolute bottom-[13%] right-[26%] h-6 w-[180px] rounded-[999px] blur-md" />

                <QuestionVisual
                  question={question}
                  questionNumber={questionNumber}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
