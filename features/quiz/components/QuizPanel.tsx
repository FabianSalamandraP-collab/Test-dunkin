"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { quizPanelClass } from "../quizVisualSystem";

export type QuizPanelProps = HTMLAttributes<HTMLDivElement>;

export function QuizPanel({ className, ...props }: QuizPanelProps) {
  return <div className={cn(quizPanelClass, className)} {...props} />;
}
