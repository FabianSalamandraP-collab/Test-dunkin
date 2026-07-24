"use client";

import { motion } from "framer-motion";
import { QuizPanel } from "./QuizPanel";
import { QuizChip } from "./QuizChip";
import { quizTypography } from "../quizVisualSystem";

export type QuestionHeaderProps = {
  questionNumber: number;
  totalQuestions: number;
  eyebrow: string;
  progressPercentage: number;
};

export function QuestionHeader({
  questionNumber,
  totalQuestions,
  eyebrow,
  progressPercentage,
}: QuestionHeaderProps) {
  return (
    <QuizPanel className="px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className={quizTypography.eyebrow}>Progreso</p>
          <p className="font-display text-[1.1rem] font-extrabold tracking-[-0.05em] text-[#201711] sm:text-[1.35rem]">
            {String(questionNumber).padStart(2, "0")} /{" "}
            {String(totalQuestions).padStart(2, "0")}
          </p>
        </div>
        <QuizChip className="border-[#F0E1D4] text-[#8A7465]" tone="glass">
          <span className={quizTypography.chip}>{eyebrow}</span>
        </QuizChip>
      </div>

      <div className="mt-4 h-[6px] overflow-hidden rounded-full bg-[#E8DDD4]">
        <motion.div
          className="h-full rounded-full bg-[linear-gradient(90deg,#FF671F_0%,#FF8E3C_46%,#F34AA7_100%)]"
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </QuizPanel>
  );
}
