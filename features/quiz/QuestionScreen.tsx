"use client";

// Pantalla de preguntas del quiz
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Flame,
  Heart,
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
  X,
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
  compact = false,
}: {
  question: QuizQuestion;
  questionNumber: number;
  compact?: boolean;
}) {
  const [imageHidden, setImageHidden] = useState(false);

  if (question.image && !imageHidden) {
    return (
      <div
        className={`relative z-10 overflow-hidden border border-[#EEDFD1] bg-white/88 p-1.5 shadow-[0_24px_44px_rgba(87,45,0,0.12)] ${
          compact
            ? "flex h-[104px] w-[70px] items-center justify-center rounded-[1rem]"
            : "rounded-[2rem] md:rounded-[2.2rem] xl:rounded-[2.4rem]"
        }`}
      >
        <img
          src={question.image}
          alt={question.imageAlt || question.question}
          className={`block max-w-full object-center ${
            compact
              ? "max-h-full w-full rounded-[0.9rem] object-contain"
              : "max-h-[356px] rounded-[1.7rem] md:max-h-[398px] md:rounded-[1.95rem] xl:max-h-[474px] xl:rounded-[2.1rem] 2xl:max-h-[540px]"
          }`}
          onError={() => setImageHidden(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative z-10 flex items-end justify-center rounded-[42px] bg-[linear-gradient(180deg,#f9e5cf_0%,#e8bd8c_100%)] shadow-[0_24px_50px_rgba(140,81,24,0.16)] ${
        compact
          ? "h-[116px] w-[88px] rounded-[24px]"
          : "h-[280px] w-[184px] md:h-[320px] md:w-[204px] xl:h-[360px] xl:w-[228px] 2xl:h-[400px] 2xl:w-[252px]"
      }`}
    >
      <div className="bg-white/45 absolute inset-x-3 top-3 h-4 rounded-full blur-md sm:inset-x-4 sm:top-5 sm:h-7" />
      <div className="absolute inset-x-3 -top-3 h-8 rounded-full bg-[radial-gradient(circle_at_50%_52%,#FFF8EF_0%,#F4E8D6_45%,transparent_72%)] sm:inset-x-5 sm:-top-6 sm:h-14" />
      <div className="absolute inset-x-4 -top-5 h-7 rounded-full bg-[radial-gradient(circle_at_50%_55%,#4B2417_0%,#2F130B_36%,transparent_72%)] opacity-95 sm:inset-x-7 sm:-top-10 sm:h-12" />
      <div className="absolute bottom-3 top-10 w-[2px] bg-[#FF7A00]/55 sm:bottom-5 sm:top-16" />
      <span
        className={`absolute inset-y-0 right-6 flex items-center font-black tracking-[-0.08em] text-[#FF7A00] [writing-mode:vertical-rl] ${
          compact ? "right-4 text-[1.2rem] sm:right-6 sm:text-[2rem]" : "text-[2.6rem]"
        }`}
      >
        DUNKIN'
      </span>
      <div className="border-white/70 absolute -top-3 left-1/2 h-7 w-[72%] -translate-x-1/2 rounded-full border-[3px] bg-[#f6d8b7] sm:-top-6 sm:h-12 sm:border-[5px]" />
      <div className="bg-white/18 absolute bottom-5 left-1/2 h-10 w-[84%] -translate-x-1/2 rounded-[999px] blur-md sm:bottom-10 sm:h-20 sm:blur-lg" />
      <div className="bg-[#c69163]/22 absolute bottom-4 left-1/2 h-4 w-[78%] -translate-x-1/2 rounded-[999px] blur-md sm:bottom-7 sm:h-6" />
      <span
        className={`absolute left-1/2 -translate-x-1/2 font-semibold uppercase tracking-[0.28em] text-[#8F5C35] ${
          compact ? "top-9 text-[0.44rem] sm:top-14 sm:text-[0.58rem]" : "top-20 text-sm"
        }`}
      >
        Q{questionNumber}
      </span>
    </div>
  );
}

function SideRibbon({
  side,
  className,
}: {
  side: "left" | "right";
  className?: string;
}) {
  const items = Array.from({ length: 40 });
  const [useFallback, setUseFallback] = useState(false);
  const imageSrc =
    side === "left"
      ? "/assets/quiz-intro/borders/side-ribbon-left.png"
      : "/assets/quiz-intro/borders/side-ribbon-right.png";

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 overflow-hidden flex ${
        side === "left" ? "left-0" : "right-0"
      } w-[26px] sm:w-[34px] ${className ?? ""}`}
    >
      {!useFallback ? (
        <div aria-hidden="true" className="flex w-full flex-col">
          {items.map((_, index) => (
            <img
              key={`${side}-ribbon-${index}`}
              src={imageSrc}
              alt=""
              className="block h-auto w-full shrink-0"
              onError={() => setUseFallback(true)}
            />
          ))}
        </div>
      ) : (
        <div
          className={`flex h-full w-full flex-col items-center justify-around bg-[linear-gradient(180deg,#f34aa7_0%,#ea4f9b_20%,#ef6f6c_50%,#f34aa7_100%)] ${
            side === "left" ? "pl-0.5" : "pr-0.5"
          }`}
        >
          {items.map((_, index) => (
            <span
              key={`${side}-${index}`}
              className={`text-[0.78rem] font-black uppercase tracking-[0.18em] text-[#FF9A1F] ${
                side === "left" ? "-rotate-90" : "rotate-90"
              }`}
            >
              DUNKIN'
            </span>
          ))}
        </div>
      )}
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
  const [showMobileImagePreview, setShowMobileImagePreview] = useState(false);
  const [showLogoFallback, setShowLogoFallback] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  if (!question) {
    return null;
  }

  useEffect(() => {
    setShowMobileImagePreview(false);
  }, [question.id]);

  useEffect(() => {
    const updateViewport = () => {
      const visualViewport = window.visualViewport;
      setViewportWidth(Math.round(visualViewport?.width ?? window.innerWidth));
      setViewportHeight(Math.round(visualViewport?.height ?? window.innerHeight));
    };

    updateViewport();

    const visualViewport = window.visualViewport;
    window.addEventListener("resize", updateViewport);
    visualViewport?.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

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
  const isMobileViewport = viewportWidth === 0 || viewportWidth < 640;
  const isShortMobile = isMobileViewport && viewportHeight > 0 && viewportHeight <= 860;
  const isVeryShortMobile =
    isMobileViewport && viewportHeight > 0 && viewportHeight <= 780;
  const isUltraShortMobile =
    isMobileViewport && viewportHeight > 0 && viewportHeight <= 700;

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none bg-[#f3ede6] px-3 py-3 sm:px-5 sm:py-5 md:px-4 md:py-4">
      <div className="relative mx-auto h-[calc(100svh-1.5rem)] max-w-[1400px] overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f7f3ee_0%,#f8f5f1_100%)] shadow-[0_30px_80px_rgba(89,53,17,0.12)] sm:h-[calc(100svh-2.5rem)] md:h-[calc(100dvh-2rem)]">
        <SideRibbon side="left" className="md:hidden" />
        <SideRibbon side="right" className="md:hidden" />
        <div className="h-[calc(100svh-1.5rem)] mx-[26px] sm:h-[calc(100svh-2.5rem)] sm:mx-[34px] md:mx-0 md:h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid h-full grid-cols-1 md:grid-cols-[minmax(0,0.96fr)_minmax(300px,0.78fr)] xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.9fr)] 2xl:grid-cols-[minmax(0,0.88fr)_minmax(520px,0.92fr)]"
            >
              <div
                className={`relative z-10 flex h-full min-h-0 flex-col sm:px-8 sm:py-8 md:px-7 md:py-6 lg:px-10 lg:py-6 xl:px-12 xl:py-7 ${
                  isUltraShortMobile
                    ? "px-2 py-2"
                    : isVeryShortMobile
                      ? "px-[0.5625rem] py-[0.5625rem]"
                      : "px-2.5 py-2.5"
                }`}
              >
              <div className="mx-auto flex w-full max-w-[560px] flex-1 min-h-0 flex-col md:h-full md:max-w-[620px] xl:max-w-[700px]">
                <div
                  className={`rounded-[1.2rem] border border-[#EADFD4] bg-white/72 shadow-[0_12px_26px_rgba(89,53,17,0.06)] sm:space-y-4 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none ${
                    isUltraShortMobile
                      ? "space-y-2 px-3 py-2"
                      : isVeryShortMobile
                        ? "space-y-2.5 px-3 py-[0.5625rem]"
                        : "space-y-2.5 px-3.5 py-2.5"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 sm:justify-between">
                    <div className="mx-auto grid w-[15.25rem] grid-cols-[1fr_auto_1fr] items-center text-[1.7rem] font-black tracking-[-0.04em] text-[#FF7A00] sm:mx-0 sm:flex sm:w-auto sm:items-center sm:gap-3 sm:text-[2rem]">
                      <div className="flex h-[2.15rem] items-center justify-center pr-2.5 sm:h-auto sm:pr-0">
                        {!showLogoFallback ? (
                          <div className="flex h-[1.9rem] w-[8.4rem] items-center justify-center overflow-hidden sm:h-auto sm:w-auto sm:overflow-visible">
                            <img
                              src="/assets/quiz-intro/logo/dunkin-logo.png"
                              alt="Dunkin"
                              className="h-full w-full shrink-0 object-contain sm:h-7 sm:w-auto"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                                setShowLogoFallback(true);
                              }}
                            />
                          </div>
                        ) : null}
                        {showLogoFallback ? (
                          <span className="leading-none">DUNKIN'</span>
                        ) : null}
                      </div>
                      <span
                        aria-hidden="true"
                        className="h-4.5 w-px shrink-0 justify-self-center rounded-full bg-[#E8CDB9] sm:h-6"
                      />
                      <div className="flex h-[2.15rem] items-center justify-center pl-2.5 sm:h-auto sm:pl-0">
                        <div className="flex h-[2.6rem] w-[4.8rem] items-center justify-center overflow-hidden sm:h-auto sm:w-auto sm:overflow-visible">
                          <img
                            src="/assets/quiz-intro/logo/YES_ALL_DAY.png"
                            alt="Yes All Day"
                            className="relative top-[1px] h-full w-full shrink-0 scale-[1.56] object-contain sm:h-[4.75rem] sm:w-auto sm:scale-100"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-[#E9DED3] bg-white/86 text-[#4A281B] shadow-[0_10px_24px_rgba(89,53,17,0.06)] sm:flex">
                      <span className="text-lg leading-none">...</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span
                      className={`font-bold tracking-[0.22em] text-[#46372D] sm:text-sm ${
                        isUltraShortMobile ? "text-[0.66rem]" : "text-[0.72rem]"
                      }`}
                    >
                      {String(questionNumber).padStart(2, "0")} -{" "}
                      {String(questions.length).padStart(2, "0")}
                    </span>
                    <div className="h-[4px] flex-1 rounded-full bg-[#E4D9CD]">
                      <div
                        className="h-full rounded-full bg-[#FF7A00] transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`flex min-h-0 flex-1 flex-col md:mt-4 md:space-y-4 ${
                    isUltraShortMobile
                      ? "mt-1 space-y-1.5"
                      : isVeryShortMobile
                        ? "mt-1.5 space-y-2"
                        : "mt-2 space-y-2"
                  }`}
                >
                  <div
                    className={`relative flex flex-col rounded-[1.5rem] border border-[#EADFD4] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,249,243,0.94)_100%)] shadow-[0_14px_34px_rgba(89,53,17,0.06)] sm:min-h-0 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none md:space-y-3 ${
                      isUltraShortMobile
                        ? "min-h-[194px] p-[0.5625rem]"
                        : isVeryShortMobile
                          ? "min-h-[204px] p-2.5"
                          : "min-h-[214px] p-2.5"
                    }`}
                  >
                    <div className="hidden absolute right-3 top-3 sm:hidden">
                      <button
                        type="button"
                        onClick={() => setShowMobileImagePreview(true)}
                        className="relative flex h-[138px] w-[98px] items-center justify-center overflow-hidden rounded-[1.3rem] border border-[#E8D8CB] bg-[linear-gradient(180deg,rgba(255,250,244,0.98)_0%,rgba(255,245,236,0.94)_100%)] p-1.5 shadow-[0_18px_34px_rgba(89,53,17,0.1)]"
                        aria-label="Ver imagen de la pregunta más grande"
                      >
                        <div className="absolute inset-x-3 top-2 h-5 rounded-full bg-white/52 blur-md" />
                        <QuestionVisual
                          question={question}
                          questionNumber={questionNumber}
                          compact
                        />
                        <span className="absolute bottom-2 rounded-full border border-white/80 bg-white/92 px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-[#8A5B36] shadow-[0_8px_14px_rgba(89,53,17,0.08)]">
                          Ver grande
                        </span>
                      </button>
                    </div>
                    <p
                      className={`font-black uppercase tracking-[0.19em] text-[#F34AA7] sm:text-sm ${
                        isUltraShortMobile ? "text-[0.62rem]" : "text-[0.68rem]"
                      }`}
                    >
                      {question.eyebrow ||
                        `Pregunta ${questionNumber} de ${questions.length}`}
                    </p>
                    <h2
                      className={`max-w-[17rem] font-black tracking-[-0.055em] text-[#181310] sm:max-w-[480px] sm:text-[2.15rem] md:max-w-[560px] md:text-[1.92rem] lg:text-[2.08rem] xl:max-w-[620px] xl:text-[2.35rem] ${
                        isUltraShortMobile
                          ? "text-[1.12rem] leading-[0.95]"
                          : isVeryShortMobile
                            ? "text-[1.2rem] leading-[0.97]"
                            : "text-[1.28rem] leading-[0.98]"
                      }`}
                    >
                      {question.question}
                    </h2>
                    {question.supportingText ? (
                      <p className="hidden max-w-[15.5rem] text-[0.85rem] leading-5 text-[#6E6258] sm:block sm:max-w-[520px] sm:text-[0.95rem] sm:leading-6 md:max-w-[560px] md:text-[0.96rem] md:leading-6 xl:max-w-[620px]">
                        {question.supportingText}
                      </p>
                    ) : null}
                    <div className={`sm:hidden ${isUltraShortMobile ? "pt-1.5" : "pt-2"}`}>
                      <button
                        type="button"
                        onClick={() => setShowMobileImagePreview(true)}
                        className={`relative flex w-full items-center justify-center overflow-hidden rounded-[1.35rem] border border-[#E8D8CB] bg-[linear-gradient(180deg,rgba(255,250,244,0.98)_0%,rgba(255,245,236,0.94)_100%)] shadow-[0_18px_34px_rgba(89,53,17,0.08)] ${
                          isUltraShortMobile
                            ? "h-[82px] px-2.5 py-1.5"
                            : isVeryShortMobile
                              ? "h-[88px] px-[0.6875rem] py-[0.4375rem]"
                              : "h-[96px] px-3 py-2"
                        }`}
                        aria-label="Ver imagen de la pregunta más grande"
                      >
                        <div className="absolute inset-x-4 top-3 h-5 rounded-full bg-white/55 blur-md" />
                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.1rem] bg-white/35">
                          <QuestionVisual
                            question={question}
                            questionNumber={questionNumber}
                            compact
                          />
                        </div>
                        <span className="absolute bottom-2.5 right-2.5 rounded-full border border-white/80 bg-white/92 px-2.5 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.08em] text-[#8A5B36] shadow-[0_8px_14px_rgba(89,53,17,0.08)]">
                          Ver grande
                        </span>
                      </button>
                    </div>
                  </div>

                  <div
                    className={`grid max-w-[520px] min-h-0 flex-1 overflow-visible pb-0 pr-0 sm:overflow-visible sm:pb-0 sm:pr-0 md:max-w-[580px] md:gap-2 md:overflow-y-auto md:overscroll-contain md:pb-3 md:pr-2 md:[-webkit-overflow-scrolling:touch] xl:max-w-[640px] ${
                      isUltraShortMobile ? "gap-1" : "gap-1.5"
                    }`}
                  >
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
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.12 + index * 0.07 }}
                          onClick={() => handleAnswerSelect(option.id)}
                          aria-pressed={isSelected}
                          className={`group flex w-full items-center border text-left transition-all sm:px-5 sm:py-3.5 md:gap-4 md:rounded-[1.35rem] md:px-5 md:py-2.5 xl:px-6 xl:py-3 ${
                            isSelected
                              ? "border-[#FF7A00] bg-[linear-gradient(180deg,#FFF1E2_0%,#FFE9D1_100%)] shadow-[0_18px_30px_rgba(255,122,0,0.16)] ring-1 ring-[#FFD3AF]"
                              : "border-[#E6D9CE] bg-white shadow-[0_10px_22px_rgba(89,53,17,0.04)] hover:border-[#FFB06A] hover:bg-[#FFF9F2]"
                          } ${
                            isUltraShortMobile
                              ? "gap-[0.4375rem] rounded-[1rem] px-2.5 py-[0.4375rem]"
                              : isVeryShortMobile
                                ? "gap-2 rounded-[1.05rem] px-[0.6875rem] py-2"
                                : "gap-2 rounded-[1.08rem] px-[0.6875rem] py-2"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center rounded-full border sm:h-11 sm:w-11 md:h-12 md:w-12 ${
                              isSelected
                                ? "border-[#FFB066] bg-white text-[#FF7A00] shadow-[0_10px_20px_rgba(255,122,0,0.12)]"
                                : "border-[#FFD2A8] bg-[#FFF7EF] text-[#FF7A00]"
                            } ${
                              isUltraShortMobile
                                ? "h-[1.875rem] w-[1.875rem]"
                                : "h-[2.125rem] w-[2.125rem]"
                            }`}
                          >
                            <Icon
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              strokeWidth={1.9}
                            />
                          </div>

                          <span
                            className={`flex-1 font-semibold sm:text-base md:text-[0.96rem] md:leading-6 ${
                              isSelected ? "text-[#2A211B]" : "text-[#3C3128]"
                            } ${
                              isUltraShortMobile
                                ? "text-[0.74rem] leading-[1.05rem]"
                                : isVeryShortMobile
                                  ? "text-[0.78rem] leading-[1.12rem]"
                                  : "text-[0.8rem] leading-[1.18rem]"
                            }`}
                          >
                            {option.label}
                          </span>

                          <div
                            className={`flex items-center justify-center rounded-full transition-all sm:h-8 sm:w-8 md:h-9 md:w-9 ${
                              isSelected
                                ? "visible bg-[#FF7A00] text-white opacity-100"
                                : "invisible bg-[#F7F2EC] text-[#FFB06A] opacity-0 group-hover:visible group-hover:opacity-100"
                            } ${isUltraShortMobile ? "h-5.5 w-5.5" : "h-6 w-6"}`}
                          >
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`z-20 mt-auto flex w-full flex-col rounded-[1.15rem] border border-[#EADFD4] bg-[#F7F3EE]/96 shadow-[0_16px_28px_rgba(89,53,17,0.09)] sm:static sm:bottom-auto sm:mt-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:pb-0 sm:pt-0 sm:shadow-none sm:backdrop-blur-0 sm:flex-row sm:items-center md:mt-4 md:shrink-0 md:items-end md:justify-between md:border-t md:border-[#EADFD4] md:pt-4 ${
                    isUltraShortMobile
                      ? "gap-1 p-1 pb-[calc(env(safe-area-inset-bottom)+0.18rem)] pt-1"
                      : isVeryShortMobile
                        ? "gap-[0.3125rem] p-[0.275rem] pb-[calc(env(safe-area-inset-bottom)+0.2rem)] pt-[0.275rem]"
                        : "gap-1.5 p-1.25 pb-[calc(env(safe-area-inset-bottom)+0.22rem)] pt-1.25"
                  }`}
                >
                  <div className="hidden md:flex md:max-w-[240px] md:items-start md:gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0E0] text-[#FF7A00]">
                      <Heart className="h-5 w-5 fill-[#FF5DB1] text-[#FF5DB1]" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[0.8rem] font-semibold leading-5 text-[#4F3E33]">
                        No hay respuestas correctas o incorrectas.
                      </p>
                      <p className="text-[0.78rem] leading-5 text-[#8A7668]">
                        Esto es para conocerte mejor.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`grid w-full gap-1.25 sm:flex sm:flex-row sm:items-center md:w-auto md:justify-end ${
                      currentQuestionIndex > 0 ? "grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {currentQuestionIndex > 0 ? (
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={goToPreviousQuestion}
                        className={`bg-white min-w-0 w-full rounded-full border-[#E8DCCF] text-[#4A281B] shadow-none sm:w-auto md:px-7 md:py-3 ${
                          isUltraShortMobile
                            ? "px-3 py-[0.425rem] text-[0.82rem]"
                            : isVeryShortMobile
                              ? "px-4 py-[0.4625rem] text-[0.86rem]"
                              : "px-5 py-2 text-[0.9rem]"
                        }`}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Anterior
                      </Button>
                    ) : null}

                    <Button
                      size="md"
                      onClick={handleNext}
                      disabled={!canGoNext}
                      className={`min-w-0 w-full rounded-full shadow-[0_18px_30px_rgba(255,122,0,0.22)] disabled:shadow-none sm:w-auto md:px-8 md:py-3 ${
                        isUltraShortMobile
                          ? "px-3 py-[0.425rem] text-[0.84rem]"
                          : isVeryShortMobile
                            ? "px-4 py-[0.4625rem] text-[0.88rem]"
                            : "px-6 py-2 text-[0.92rem]"
                      }`}
                    >
                      {isLastQuestion ? "Ver resultado" : "Continuar"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </div>

            </div>

              <div className="pointer-events-none relative hidden overflow-hidden border-l border-[#EADFD4] bg-[linear-gradient(180deg,#faf8f5_0%,#f7f1ea_100%)] md:flex md:h-full md:items-center md:justify-center">
              <div className="absolute right-[16%] top-[16%] grid grid-cols-6 gap-2.5 opacity-80 xl:right-[18%] xl:top-[18%] xl:gap-3">
                {Array.from({ length: 30 }).map((_, index) => (
                  <span
                    key={index}
                    className="h-[3px] w-[3px] rounded-full bg-[#FF7A00]"
                  />
                ))}
              </div>
              <div
                className="absolute left-[12%] top-[16%] h-8 w-8 rounded-full md:h-9 md:w-9 xl:left-[16%] xl:top-[20%] xl:h-10 xl:w-10"
                style={{
                  backgroundColor: question.accentColor || "#FF7A00",
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-95 md:h-[220px] md:w-[220px] xl:h-[270px] xl:w-[270px] 2xl:h-[320px] 2xl:w-[320px]"
                style={{
                  background:
                    question.accentColor && question.decorativeColor
                      ? `radial-gradient(circle, ${question.accentColor} 0%, ${question.decorativeColor} 62%, rgba(255,255,255,0) 67%)`
                      : "radial-gradient(circle, #FFB066 0%, #F6E2CE 62%, rgba(255,255,255,0) 67%)",
                }}
              />
              <div className="bg-[#B38457]/12 absolute bottom-[20%] left-1/2 h-5 w-[150px] -translate-x-1/2 rounded-[999px] blur-md md:w-[170px] xl:bottom-[21%] xl:h-6 xl:w-[190px]" />

              <QuestionVisual
                question={question}
                questionNumber={questionNumber}
              />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {showMobileImagePreview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#2D1B12]/72 px-5 sm:hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-[330px] rounded-[1.8rem] border border-[#E8D8CB] bg-[linear-gradient(180deg,#FFF9F3_0%,#FFF2E6_100%)] p-4 shadow-[0_28px_60px_rgba(33,19,12,0.22)]"
            >
              <button
                type="button"
                onClick={() => setShowMobileImagePreview(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#E9D8CA] bg-white/92 text-[#5A4031] shadow-[0_10px_18px_rgba(89,53,17,0.08)]"
                aria-label="Cerrar imagen ampliada"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="space-y-3 pt-2">
                <div className="inline-flex rounded-full border border-[#F2D8C4] bg-[#FFF3E8] px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#B86B2C]">
                  Imagen de la pregunta
                </div>
                <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,249,243,0.98)_0%,rgba(255,244,236,0.94)_100%)] px-4 py-5">
                  <QuestionVisual
                    question={question}
                    questionNumber={questionNumber}
                    compact={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
