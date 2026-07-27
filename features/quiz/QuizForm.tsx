"use client";

// Formulario posterior al resultado del quiz
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button, Input, Checkbox, Loader } from "@/components/ui";
import {
  getQuizTrackingClientContext,
  postQuizTracking,
} from "@/lib/quiz-tracking-client";
import { isQuizPreviewMode } from "@/lib/quiz-runtime-mode";
import { useQuizStore } from "@/store/quizStore";
import { FormData } from "@/types/quiz";
import { QuizPanel } from "./components/QuizPanel";
import { QuizBadge } from "./components/QuizBadge";
import { quizTypography } from "./quizVisualSystem";
import { ConsentBlock } from "./components/ConsentBlock";

interface QuizFormProps {
  onSuccess: () => void;
}

export function QuizForm({ onSuccess }: QuizFormProps) {
  const { answers, result, sessionId, setFormSubmitted } = useQuizStore();
  const isPreviewMode = isQuizPreviewMode();
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
      companyWebsite: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!result) return;

    if (!sessionId && !isPreviewMode) {
      setSubmitError(
        "Necesitamos reiniciar el test para guardar tu registro de forma segura. Vuelve a empezar e inténtalo de nuevo."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (isPreviewMode) {
        await new Promise((resolve) => window.setTimeout(resolve, 240));
        setSubmitSuccess(true);
        setFormSubmitted(true);

        window.requestAnimationFrame(() => {
          onSuccess();
        });
        return;
      }

      const trackingContext = getQuizTrackingClientContext();
      const response = await postQuizTracking<{ participantId?: string }>(
        "/api/quiz/form/submit",
        {
          sessionId,
          fullName: data.name,
          email: data.email,
          phone: data.phone || null,
          acceptDataProcessing: data.acceptDataProcessing,
          acceptPromotions: data.acceptPromotions,
          companyWebsite: data.companyWebsite || "",
          answersCount: answers.length,
          ...trackingContext,
        },
        { silent: true }
      );

      if (!response?.participantId) {
        throw new Error("No fue posible completar el registro.");
      }

      // Éxito!
      setSubmitSuccess(true);
      setFormSubmitted(true);

      // Dispara la guía al CTA apenas el estado de éxito ya quedó pintado.
      window.requestAnimationFrame(() => {
        onSuccess();
      });
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
        className="relative overflow-hidden"
      >
        <QuizPanel className="relative flex min-h-[420px] items-center justify-center overflow-hidden p-6 text-center sm:min-h-[460px] sm:p-8 lg:min-h-[500px]">
          <div className="bg-[#FF671F]/12 pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full blur-[90px]" />
          <div className="bg-[#E9539A]/12 pointer-events-none absolute bottom-[-5rem] right-[-5rem] h-64 w-64 rounded-full blur-[110px]" />
          <div className="relative mx-auto max-w-[32rem]">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[#2BAA6A]" />
            <h3 className="mb-2 font-display text-xl font-extrabold tracking-[-0.03em] text-[#4A281B] sm:text-2xl">
              ¡Gracias por participar!
            </h3>
            <p className="font-sans text-[0.95rem] font-medium leading-6 text-[#6B5B4F] sm:text-lg">
              {isPreviewMode
                ? "Tu correo quedó listo para la prueba. Este deploy no guarda datos reales."
                : "Tu registro quedó guardado correctamente."}
            </p>
          </div>
        </QuizPanel>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <QuizPanel className="relative overflow-hidden border-[rgba(234,221,207,0.52)] bg-white/58 p-5 shadow-[0_24px_48px_rgba(89,53,17,0.06)] lg:border-transparent lg:bg-white/50 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background: `radial-gradient(circle_at_18%_26%, ${
              result?.color || "#FF671F"
            }1a 0%, rgba(255,255,255,0) 62%), radial-gradient(circle_at_84%_78%, ${
              result?.accentColor || "#FFD9B8"
            }38 0%, rgba(255,255,255,0) 58%)`,
          }}
        />

        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <QuizBadge
              style={{
                borderColor: `${result?.accentColor || "#FFD9B8"}88`,
                backgroundColor: `${result?.accentColor || "#FFD9B8"}1F`,
                color: result?.color || "#B86B2C",
              }}
            >
              <span className={quizTypography.chip}>Último paso</span>
            </QuizBadge>
            <div className="space-y-1">
              <h3 className="font-display text-[1.35rem] font-extrabold tracking-[-0.04em] text-[#201711] sm:text-[1.6rem]">
                {isPreviewMode
                  ? "Deja tu correo para la prueba"
                  : "Guarda tu match Dunkin'"}
              </h3>
              <p className={quizTypography.supportingCompact}>
                {isPreviewMode
                  ? "Este deploy de prueba no guarda datos reales en la base."
                  : "Te toma menos de un minuto."}
              </p>
            </div>
          </div>
          <div className="bg-white/62 flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(245,130,32,0.08)] text-[#FF7A00] shadow-[0_14px_28px_rgba(89,53,17,0.06)]">
            <Info className="h-5 w-5" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            {...register("companyWebsite")}
          />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {!isPreviewMode ? (
              <Input
                label="Nombre completo"
                placeholder="Escribe tu nombre completo"
                error={errors.name?.message}
                className="bg-white/72 rounded-[1.25rem] border-[rgba(245,130,32,0.08)] shadow-[0_10px_22px_rgba(89,53,17,0.05)] backdrop-blur-[10px]"
                {...register("name", {
                  required: "Por favor, ingresa tu nombre completo",
                  minLength: {
                    value: 2,
                    message: "Tu nombre debe tener al menos 2 caracteres",
                  },
                })}
              />
            ) : null}
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              className={`bg-white/72 rounded-[1.25rem] border-[rgba(245,130,32,0.08)] shadow-[0_10px_22px_rgba(89,53,17,0.05)] backdrop-blur-[10px] ${
                isPreviewMode ? "sm:col-span-2" : ""
              }`}
              {...register("email", {
                required: "Por favor, ingresa tu correo electrónico",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Por favor, ingresa un correo electrónico válido",
                },
              })}
            />

            {!isPreviewMode ? (
              <div className="sm:col-span-2">
                <Input
                  label="Número de celular (opcional)"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  error={errors.phone?.message}
                  className="bg-white/72 rounded-[1.25rem] border-[rgba(245,130,32,0.08)] shadow-[0_10px_22px_rgba(89,53,17,0.05)] backdrop-blur-[10px]"
                  {...register("phone", {
                    pattern: {
                      value:
                        /^(\+[0-9]{1,4}[-\s]?)?([0-9]{2,4}[-\s]?)?[0-9]{3,4}[-\s]?[0-9]{3,4}$/,
                      message: "Por favor, ingresa un número de celular válido",
                    },
                  })}
                />
              </div>
            ) : null}
          </div>

          {isPreviewMode ? (
            <div className="rounded-[1.25rem] border border-[rgba(234,221,207,0.62)] bg-white/68 p-4 shadow-[0_14px_28px_rgba(89,53,17,0.05)]">
              <p className="font-sans text-sm font-medium leading-6 text-[#6B5B4F]">
                Deploy de prueba activo. Puedes continuar dejando solo tu correo.
                Este entorno no guarda participantes, respuestas ni eventos en la
                base de datos.
              </p>
            </div>
          ) : (
            <ConsentBlock
              className="border-[rgba(234,221,207,0.52)] bg-white/54 shadow-[0_16px_34px_rgba(89,53,17,0.04)]"
              required={{
                label: (
                  <span className="font-sans text-sm font-medium leading-6 text-[#4A281B]">
                    Autorizo de manera previa, expresa e informada a DONUCOL S.A.,
                    responsable de la marca Dunkin' Colombia, para recolectar,
                    almacenar, usar y tratar mis datos personales con la finalidad
                    de gestionar mi participación en este test y generar mi
                    resultado.
                  </span>
                ),
                error: errors.acceptDataProcessing,
                register: register("acceptDataProcessing", {
                  required:
                    "Debes aceptar el tratamiento de datos para continuar",
                }),
                details: (
                  <p>
                    Declaro que he leído y acepto la Política de Tratamiento de
                    Datos Personales. Esta autorización incluye las demás
                    finalidades descritas en dicha política. El consentimiento
                    para participar en el test es independiente del consentimiento
                    opcional para recibir promociones, novedades, productos,
                    servicios y campañas de Dunkin' Colombia a través de los medios
                    de contacto suministrados.
                  </p>
                ),
                expanded: showDataInfo,
                onToggleExpanded: () => setShowDataInfo((current) => !current),
              }}
              policyHref="https://www.dunkincolombia.com/documentos-legales/privacy"
              optional={{
                label: (
                  <span className="font-sans text-sm font-medium leading-6 text-[#4A281B]">
                    Autorizo recibir información sobre promociones, novedades,
                    productos, servicios y campañas de Dunkin' Colombia a través de
                    los medios de contacto suministrados.
                  </span>
                ),
                register: register("acceptPromotions"),
              }}
            />
          )}

          {submitError && (
            <div className="flex items-start gap-3 rounded-[1.15rem] border border-[#F3C1C1] bg-[#FFF3F3] p-4">
              <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-[#D44B4B]" />
              <p className="font-sans text-[#8F2F2F]">{submitError}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="quizCta"
            size="quizLg"
            disabled={isSubmitting}
            className="w-full shadow-[0_18px_30px_rgba(255,122,0,0.22)]"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-5 w-5" />
                {isPreviewMode ? "Preparando prueba..." : "Guardando..."}
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                {isPreviewMode
                  ? "Continuar con correo de prueba"
                  : "Guardar mi información"}
              </>
            )}
          </Button>
        </form>
      </QuizPanel>
    </motion.div>
  );
}
