"use client";

// Pantalla de resultados del quiz
import { motion } from "framer-motion";
import { Coffee, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useQuizStore } from "@/store/quizStore";

export function ResultScreen() {
  const { result, resetQuiz } = useQuizStore();

  if (!result) {
    return null;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "¡Descubrí mi personalidad Dunkin!",
        text: `Soy un ${result.title} - ${result.description}`,
        url: window.location.href,
      });
    } else {
      alert("¡No se puede compartir en este dispositivo!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50 to-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full text-center space-y-10">
          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 mb-6 shadow-xl">
              <Coffee className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4">
              {result.title}
            </h1>
          </motion.div>

          {/* Imagen o tarjeta del resultado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-primary-200 via-transparent to-secondary-200 rounded-[3rem] blur-3xl opacity-40" />
            <div className="relative bg-white rounded-3xl p-10 shadow-2xl border-4 border-white">
              <div className="text-8xl mb-6">🎉</div>
              <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed mb-6">
                {result.description}
              </p>
              <div className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-full font-bold text-lg">
                Bebida recomendada: {result.recommendedDrink}
              </div>
            </div>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={handleShare}
              className="px-10 py-6 shadow-xl"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartir resultado
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={resetQuiz}
              className="px-10 py-6"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Hacer quiz de nuevo
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
