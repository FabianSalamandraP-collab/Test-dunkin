"use client";

// Pantalla de resultados del quiz
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Coffee,
  RefreshCw,
  Share2,
  Gift,
  Menu,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useQuizStore } from "@/store/quizStore";
import { QuizForm } from "./QuizForm";

export function ResultScreen() {
  const router = useRouter();
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const { result, resetQuiz, formSubmitted } = useQuizStore();
  const [resultImageHidden, setResultImageHidden] = useState(false);
  const [benefitIconHidden, setBenefitIconHidden] = useState(false);

  if (!result) {
    return null;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "¡Descubrí mi personalidad Dunkin!",
        text: `Soy ${result.title} - ${result.description}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(
        `¡Descubrí mi personalidad Dunkin! Soy ${result.title} - ${result.description}`
      );
    }
  };

  const handleClaimBenefit = () => {
    if (!formSubmitted) {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    navigator.clipboard.writeText(result.benefit).catch(() => {});
  };

  const handleFormSuccess = () => {
    // Se ejecuta cuando el formulario se envía correctamente
    // Aquí podrías mostrar más botones o navegar a otra página
  };

  return (
    <div className="min-h-screen bg-[#f4eee7] px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto max-w-[1360px] space-y-6 rounded-[2rem] bg-[linear-gradient(180deg,#f8f4ef_0%,#fbf8f4_100%)] px-5 py-6 shadow-[0_30px_80px_rgba(89,53,17,0.12)] sm:px-8 sm:py-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/75 relative overflow-hidden rounded-[2rem] px-6 py-7 shadow-[0_24px_55px_rgba(89,53,17,0.08)] ring-1 ring-[#ECE2D8] sm:px-8 lg:px-10 lg:py-10"
        >
          <div className="absolute right-[12%] top-[16%] hidden grid-cols-6 gap-3 opacity-75 lg:grid">
            {Array.from({ length: 24 }).map((_, index) => (
              <span
                key={index}
                className="h-[3px] w-[3px] rounded-full bg-[#FFB066]"
              />
            ))}
          </div>
          <div
            className="absolute bottom-[8%] right-[12%] hidden h-[320px] w-[320px] rounded-full lg:block"
            style={{
              background: `radial-gradient(circle, ${result.accentColor || "#FFC27A"} 0%, rgba(255,255,255,0) 62%)`,
            }}
          />

          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_0.85fr]">
            <div className="space-y-7 text-left">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7A6A5B]">
                  {result.badge || "Tu personalidad es"}
                </p>
                <h1 className="text-[2.3rem] font-black uppercase leading-[0.95] tracking-[-0.05em] text-[#FF7A00] sm:text-[3rem] lg:text-[3.6rem]">
                  {result.title}
                </h1>
                <p className="max-w-[560px] text-lg leading-8 text-[#5E5146]">
                  {result.description}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7A6A5B]">
                  Tu bebida Dunkin' es
                </p>
                <div className="flex items-center gap-3">
                  <h2 className="text-[2.2rem] font-black uppercase leading-none tracking-[-0.05em] text-[#4A281B] sm:text-[2.8rem]">
                    {result.recommendedDrink}
                  </h2>
                  <Heart className="h-7 w-7 fill-[#FF5DB1] text-[#FF5DB1]" />
                </div>
                <p className="max-w-[560px] text-lg leading-8 text-[#5E5146]">
                  {result.drinkDescription}
                </p>
              </div>
            </div>

            <div className="relative flex min-h-[360px] items-center justify-center lg:min-h-[420px]">
              <div
                className="absolute bottom-[12%] right-[18%] h-[240px] w-[240px] rounded-full"
                style={{
                  background: `radial-gradient(circle, ${result.color || "#FF7A00"} 0%, ${result.accentColor || "#FFD9B8"} 58%, rgba(255,255,255,0) 62%)`,
                }}
              />

              {!resultImageHidden && result.image ? (
                <img
                  src={result.image}
                  alt={result.recommendedDrink}
                  className="relative z-10 max-h-[390px] w-auto object-contain drop-shadow-[0_25px_45px_rgba(87,45,0,0.16)]"
                  onError={() => setResultImageHidden(true)}
                />
              ) : (
                <div className="relative z-10 flex h-[340px] w-[220px] items-end justify-center rounded-[46px] bg-[linear-gradient(180deg,#f6dfc7_0%,#d49755_100%)] shadow-[0_24px_50px_rgba(140,81,24,0.18)]">
                  <div className="bg-white/50 absolute inset-x-4 top-5 h-7 rounded-full blur-md" />
                  <div className="border-white/70 absolute -top-6 left-1/2 h-12 w-[72%] -translate-x-1/2 rounded-full border-[5px] bg-[#f6d8b7]" />
                  <span className="absolute inset-y-0 right-8 flex items-center text-[2.6rem] font-black tracking-[-0.08em] text-[#FF7A00] [writing-mode:vertical-rl]">
                    DUNKIN'
                  </span>
                  <Coffee
                    className="text-white/70 absolute left-1/2 top-[38%] h-14 w-14 -translate-x-1/2"
                    strokeWidth={1.8}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div className="flex items-center gap-4 rounded-[1.7rem] bg-[#F7EDE3] px-5 py-5 ring-1 ring-[#EADDCF] sm:px-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFE6CF] text-[#FF7A00]">
              {!benefitIconHidden && result.benefitIcon ? (
                <img
                  src={result.benefitIcon}
                  alt="Beneficio"
                  className="h-7 w-7 object-contain"
                  onError={() => setBenefitIconHidden(true)}
                />
              ) : (
                <Gift className="h-6 w-6" strokeWidth={2} />
              )}
            </div>
            <div className="min-w-0 space-y-1">
              <h3 className="text-lg font-bold text-[#4A281B] sm:text-xl">
                {result.benefitTitle ||
                  "Disfruta los beneficios vigentes en Dunkin'"}
              </h3>
              <p className="text-sm leading-6 text-[#65594E] sm:text-base">
                {result.benefitDescription || result.benefit}
              </p>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleClaimBenefit}
            className="rounded-full px-7 py-3.5 shadow-[0_18px_30px_rgba(255,122,0,0.22)]"
          >
            {result.benefitCta || "Ver beneficio"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>

        {!formSubmitted && (
          <motion.div
            ref={formSectionRef}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
          >
            <QuizForm onSuccess={handleFormSuccess} />
          </motion.div>
        )}

        {formSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Button
              size="lg"
              onClick={handleShare}
              className="w-full rounded-full py-4 text-lg shadow-[0_18px_30px_rgba(255,122,0,0.22)]"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Compartir resultado
            </Button>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  resetQuiz();
                  router.push("/quiz");
                }}
                className="rounded-full py-4 text-lg"
              >
                <Menu className="mr-2 h-5 w-5" />
                Volver al inicio
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={resetQuiz}
                className="rounded-full py-4 text-lg"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Volver a intentar
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
