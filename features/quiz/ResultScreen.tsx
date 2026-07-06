"use client";

// Pantalla de resultados del quiz
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coffee, RefreshCw, Share2, Gift, Menu } from "lucide-react";
import { Button } from "@/components/ui";
import { useQuizStore } from "@/store/quizStore";

export function ResultScreen() {
  const router = useRouter();
  const { result, resetQuiz } = useQuizStore();

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
      alert("¡Resultado copiado al portapapeles!");
    }
  };

  const handleClaimBenefit = () => {
    alert(`¡Felicidades! Has ganado: ${result.benefit}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <div 
            className="inline-flex items-center justify-center w-28 h-28 rounded-full shadow-xl mb-6"
            style={{ 
              background: `linear-gradient(135deg, ${result.color || "#FF7A00"}, ${result.color || "#FF7A00"}88)`
            }}
          >
            <Coffee className="w-14 h-14 text-white" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Tu personalidad Dunkin
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3">
            {result.title}
          </h1>
          <p className="text-xl md:text-2xl font-medium text-primary-600">
            {result.personalityType}
          </p>
        </motion.div>

        {/* Imagen de la bebida */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative mb-10"
        >
          <div 
            className="absolute -inset-4 rounded-[3rem] blur-3xl opacity-30"
            style={{ 
              background: `radial-gradient(circle, ${result.color || "#FF7A00"}, transparent 70%)`
            }}
          />
          <div className="relative bg-gradient-to-br from-white to-neutral-50 rounded-[2.5rem] p-8 shadow-2xl border border-neutral-100">
            {/* Placeholder de imagen premium */}
            <div 
              className="w-full aspect-square rounded-[2rem] flex items-center justify-center mb-6"
              style={{ 
                background: `linear-gradient(135deg, ${result.color || "#FF7A00"}33, ${result.color || "#FF7A00"}11)`
              }}
            >
              <div className="text-center">
                <div className="text-8xl md:text-9xl mb-4">☕</div>
                <p className="text-neutral-600 font-medium">Foto de la bebida</p>
              </div>
            </div>

            {/* Nombre y descripción de la bebida */}
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                {result.recommendedDrink}
              </h3>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {result.drinkDescription}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Descripción de la personalidad */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100 mb-10"
        >
          <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-3">
            <span className="text-2xl">✨</span>
            Tu personalidad
          </h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            {result.description}
          </p>
        </motion.div>

        {/* Beneficio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 shadow-xl mb-12 text-white"
        >
          <div className="flex items-center gap-4 mb-3">
            <Gift className="w-8 h-8" />
            <h2 className="text-xl font-bold">¡Tu beneficio exclusivo!</h2>
          </div>
          <p className="text-lg md:text-xl font-semibold mb-5">
            {result.benefit}
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleClaimBenefit}
            className="w-full bg-white text-primary-600 hover:bg-neutral-100 shadow-lg"
          >
            <Gift className="w-5 h-5 mr-2" />
            Reclamar beneficio
          </Button>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="space-y-4"
        >
          <Button
            size="lg"
            onClick={handleShare}
            className="w-full shadow-xl py-5 text-lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Compartir resultado
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/")}
              className="py-5 text-lg"
            >
              <Menu className="w-5 h-5 mr-2" />
              Descubrir portafolio
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={resetQuiz}
              className="py-5 text-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Volver a intentar
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
