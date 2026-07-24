"use client";

import { motion } from "framer-motion";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/utils/supabase/client";

interface AdminLoginFormValues {
  email: string;
  password: string;
}

interface AdminLoginFormProps {
  isConfigured: boolean;
  setupMessage?: string | null;
}

export function AdminLoginForm({
  isConfigured,
  setupMessage,
}: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryError = searchParams.get("error");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const helperMessage = useMemo(() => {
    if (setupMessage) {
      return setupMessage;
    }

    if (queryError === "unauthorized") {
      return "Tu cuenta no está autorizada para entrar al dashboard administrativo.";
    }

    return "Accede con una cuenta válida de Supabase y autorizada en admin_users.";
  }, [queryError, setupMessage]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    const supabase = createClient();

    if (!supabase) {
      setSubmitError(
        "No hay configuración pública de Supabase disponible en este entorno."
      );
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setSubmitError(error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className="border-white/70 relative overflow-hidden rounded-[2rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(248,244,241,0.98)_100%)] p-8 shadow-[0_30px_80px_rgba(62,52,47,0.12)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,0,104,0.18)_0%,rgba(255,0,104,0)_70%)]" />
      <div className="pointer-events-none absolute -right-14 top-8 h-36 w-36 rounded-full bg-[#EF6A00]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[#FF0068]/10 blur-3xl" />

      <div className="relative">
        <div className="bg-white/80 mb-8 inline-flex items-center gap-2 rounded-full border border-[#F3D6C4] px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#7A5E52]">
          <ShieldCheck className="h-4 w-4 text-[#EF6A00]" />
          Acceso interno Dunkin'
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-[2.2rem] uppercase leading-[0.92] tracking-[-0.04em] text-[#3E342F]">
            Dashboard
            <br />
            administrativo
          </h1>
          <p className="max-w-[34ch] font-sans text-[0.96rem] leading-7 text-[#655851]">
            Analítica del quiz, formularios, abandono y rendimiento de campaña
            en una sola vista.
          </p>
        </div>

        <div className="bg-[#FFF9F4]/88 mt-7 rounded-[1.4rem] border border-[#F3DED2] p-4 text-[0.86rem] leading-6 text-[#715F54]">
          {helperMessage}
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <div className="space-y-2">
            <label className="font-sans text-[0.75rem] uppercase tracking-[0.16em] text-[#7A5E52]">
              Correo
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9D8478]" />
              <Input
                type="email"
                placeholder="admin@dunkin.co"
                className="bg-white h-14 rounded-[1.1rem] border-[#E9D8CC] pl-11"
                {...register("email", {
                  required: "El correo es obligatorio.",
                })}
              />
            </div>
            {errors.email ? (
              <p className="font-sans text-sm text-[#D14B5A]">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="font-sans text-[0.75rem] uppercase tracking-[0.16em] text-[#7A5E52]">
              Contraseña
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9D8478]" />
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-white h-14 rounded-[1.1rem] border-[#E9D8CC] pl-11"
                {...register("password", {
                  required: "La contraseña es obligatoria.",
                })}
              />
            </div>
            {errors.password ? (
              <p className="font-sans text-sm text-[#D14B5A]">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {submitError ? (
            <div className="rounded-[1rem] border border-[#F4C9CF] bg-[#FFF4F6] px-4 py-3 font-sans text-sm text-[#A54055]">
              {submitError}
            </div>
          ) : null}

          <Button
            type="submit"
            variant="quizCta"
            size="quizLg"
            disabled={!isConfigured || isSubmitting}
            className="h-14 w-full justify-center rounded-full"
          >
            {isSubmitting ? "Entrando..." : "Entrar al dashboard"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
