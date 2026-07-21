"use client";

// Formulario posterior al resultado del quiz
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button, Input, Checkbox, Loader } from "@/components/ui";
import { useQuizStore } from "@/store/quizStore";
import { FormData, QuizParticipant } from "@/types/quiz";
import { supabase } from "@/lib/supabase";

interface QuizFormProps {
  onSuccess: () => void;
}

export function QuizForm({ onSuccess }: QuizFormProps) {
  const { answers, result, setFormSubmitted } = useQuizStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showDataInfo, setShowDataInfo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      acceptDataProcessing: false,
      acceptPromotions: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!result) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Preparar los datos para Supabase
      const participant: QuizParticipant = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        accept_data_processing: data.acceptDataProcessing,
        accept_promotions: data.acceptPromotions,
        quiz_result: result.id,
        answers,
      };

      // Insertar en Supabase
      const { error } = await supabase.from("quiz_participants").insert([
        participant,
      ]);

      if (error) {
        throw new Error(error.message);
      }

      // Éxito!
      setSubmitSuccess(true);
      setFormSubmitted(true);

      // Esperar un momento para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setSubmitError(
        "Hubo un problema al guardar tu información. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[1.35rem] border border-[#EADDCF] bg-[linear-gradient(180deg,#FFF8F2_0%,#FFF2E8_100%)] p-6 text-center shadow-[0_18px_34px_rgba(89,53,17,0.06)] sm:p-8"
      >
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[#2BAA6A]" />
        <h3 className="mb-2 text-xl font-black tracking-[-0.03em] text-[#4A281B] sm:text-2xl">
          ¡Gracias por participar!
        </h3>
        <p className="text-[0.95rem] leading-6 text-[#6B5B4F] sm:text-lg">
          Tu registro quedó guardado correctamente.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.35rem] border border-[#EADDCF] bg-[linear-gradient(180deg,#FFF8F2_0%,#FFF2E8_100%)] p-5 shadow-[0_18px_34px_rgba(89,53,17,0.06)] sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE7D2] text-[#FF7A00]">
          <Info className="h-5 w-5" />
        </div>
        <h3 className="text-[1.05rem] font-black tracking-[-0.03em] text-[#4A281B] sm:text-xl">
          Completa tu registro para guardar y compartir tu resultado.
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Input
            label="Nombre completo"
            placeholder="Escribe tu nombre completo"
            error={errors.name?.message}
            {...register("name", {
              required: "Por favor, ingresa tu nombre completo",
              minLength: {
                value: 2,
                message: "Tu nombre debe tener al menos 2 caracteres",
              },
            })}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Por favor, ingresa tu correo electrónico",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Por favor, ingresa un correo electrónico válido",
              },
            })}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Número de celular (opcional)"
            type="tel"
            placeholder="+57 300 123 4567"
            error={errors.phone?.message}
            {...register("phone", {
              pattern: {
                value: /^(\+[0-9]{1,4}[-\s]?)?([0-9]{2,4}[-\s]?)?[0-9]{3,4}[-\s]?[0-9]{3,4}$/,
                message: "Por favor, ingresa un número de celular válido",
              },
            })}
          />
        </div>

        {/* Mensaje de información sobre tratamiento de datos */}
        <div className="rounded-[1.15rem] border border-[#EADDCF] bg-white/75 shadow-[0_12px_24px_rgba(89,53,17,0.04)]">
          <button
            type="button"
            onClick={() => setShowDataInfo((current) => !current)}
            aria-expanded={showDataInfo}
            aria-controls="data-processing-info"
            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-6 sm:py-5"
          >
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#4A281B]">
                Tratamiento de datos
              </p>
              <p className="text-xs text-[#7A6A5B]">
                {showDataInfo
                  ? "Ver menos del detalle"
                  : "Ver más del detalle"}
              </p>
            </div>
            <span className="text-[#7A6A5B]">
              {showDataInfo ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </span>
          </button>
          {showDataInfo ? (
            <div
              id="data-processing-info"
              className="border-t border-[#EADDCF] px-4 pb-4 pt-0 sm:px-6 sm:pb-5"
            >
              <p className="text-sm leading-relaxed text-[#6B5B4F]">
                Tu información es importante para nosotros. La utilizaremos
                únicamente para gestionar esta experiencia, ayudarte a descubrir
                nuevas bebidas de Dunkin y, si nos autorizas, compartirte
                futuras novedades y beneficios. Tus datos serán tratados de
                forma segura y nunca se compartirán con terceros sin tu
                consentimiento.
              </p>
            </div>
          ) : (
            <div className="border-t border-[#EADDCF] px-4 pb-4 pt-3 sm:px-6 sm:pb-5">
              <p className="text-sm leading-relaxed text-[#6B5B4F]">
                Usaremos tus datos para gestionar esta experiencia y, si lo
                autorizas, compartirte novedades y beneficios de Dunkin.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Checkbox
              label="Acepto el tratamiento de datos"
              error={errors.acceptDataProcessing?.message}
              {...register("acceptDataProcessing", {
                required:
                  "Debes aceptar el tratamiento de datos para continuar",
              })}
            />
          </div>

          <div>
            <Checkbox
              label="Deseo recibir promociones de Dunkin"
              {...register("acceptPromotions")}
            />
          </div>
        </div>

        {submitError && (
          <div className="flex items-start gap-3 rounded-[1.15rem] border border-[#F3C1C1] bg-[#FFF3F3] p-4">
            <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-[#D44B4B]" />
            <p className="text-[#8F2F2F]">{submitError}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="group relative w-full overflow-hidden rounded-full border border-[#D95816] bg-[linear-gradient(180deg,#FFB064_0%,#FF671F_50%,#DE4F0D_100%)] py-5 text-lg text-white shadow-[0_18px_30px_rgba(255,122,0,0.22)] ring-1 ring-[#FFF1E4]/80"
        >
          <span className="pointer-events-none absolute inset-y-[12%] left-[-24%] w-[34%] rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.16)_28%,rgba(255,255,255,0.34)_48%,rgba(255,255,255,0)_72%)] blur-md transition-transform duration-500 group-hover:translate-x-[350%]" />
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-5 w-5" />
              Guardando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Guardar mi información
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
