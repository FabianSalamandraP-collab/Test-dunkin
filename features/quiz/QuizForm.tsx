"use client";

// Formulario posterior al resultado del quiz
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, CheckCircle2, AlertCircle, Info } from "lucide-react";
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
        className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100 text-center"
      >
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          ¡Gracias por participar!
        </h3>
        <p className="text-lg text-neutral-600">
          Tu información ha sido guardada correctamente.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <Info className="w-8 h-8 text-primary-500" />
        <h3 className="text-xl font-bold text-neutral-900">
          ¡Ahora completa tu registro!
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
        <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
          <p className="text-sm text-neutral-600 leading-relaxed">
            Tu información es importante para nosotros. La utilizaremos únicamente
            para gestionar esta experiencia, ayudarte a descubrir nuevas bebidas de
            Dunkin y, si nos autorizas, compartirte futuras novedades y beneficios.
            Tus datos serán tratados de forma segura y nunca se compartirán con
            terceros sin tu consentimiento.
          </p>
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
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{submitError}</p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="w-full py-5 text-lg shadow-xl"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Guardar mi información
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
