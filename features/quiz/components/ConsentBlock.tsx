"use client";

import type { ReactNode } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui";
import { QuizChip } from "./QuizChip";
import { cn } from "@/lib/cn";
import { quizTypography } from "../quizVisualSystem";

export type ConsentBlockProps = {
  required: {
    label: ReactNode;
    error?: FieldError;
    register: UseFormRegisterReturn;
    details: ReactNode;
    expanded: boolean;
    onToggleExpanded: () => void;
  };
  policyHref: string;
  optional: {
    label: ReactNode;
    register: UseFormRegisterReturn;
  };
  className?: string;
};

export function ConsentBlock({
  required,
  policyHref,
  optional,
  className,
}: ConsentBlockProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-[1.25rem] border border-white/70 bg-white/62 p-4 shadow-[0_14px_28px_rgba(89,53,17,0.06)] backdrop-blur-[10px] sm:p-6",
        className
      )}
    >
      <div className="space-y-3">
        <Checkbox label={required.label} error={required.error?.message} {...required.register} />
        <div className="ml-9 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href={policyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm font-medium text-[#FF671F] underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Política de Tratamiento de Datos Personales
          </a>

          <button
            type="button"
            onClick={required.onToggleExpanded}
            aria-expanded={required.expanded}
            aria-controls="data-processing-info"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-[#7A5B46] transition-colors hover:text-[#4A281B]"
          >
            <QuizChip
              className="border-[#E8DCCF] bg-white/70 text-[#7A5B46]"
              tone="glass"
            >
              <span className={quizTypography.chip}>
                {required.expanded ? "Ver menos detalle" : "Ver más en detalle"}
              </span>
            </QuizChip>
            {required.expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {required.expanded ? (
          <div
            id="data-processing-info"
            className="ml-9 rounded-[1.1rem] border border-[#EADDCF] bg-[#FFF8F2] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:p-4"
          >
            <div className="font-sans text-sm font-medium leading-relaxed text-[#6B5B4F]">
              {required.details}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-[#EADDCF] pt-4">
        <Checkbox label={optional.label} {...optional.register} />
      </div>
    </div>
  );
}
