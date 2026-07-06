"use client";

// Importación de componentes y bibliotecas
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coffee, ChevronDown, Instagram, Facebook, Twitter } from "lucide-react";
import { Button, Navbar, Footer, useToast } from "@/components/ui";

export default function Home() {
  const router = useRouter();
  const { addToast } = useToast();

  const handleStartQuiz = () => {
    addToast({
      type: "success",
      message: "¡Preparando tu quiz de personalidad Dunkin!",
    });
    setTimeout(() => {
      router.push("/quiz");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-neutral-50 to-white">
      {/* Navbar superior */}
      <Navbar onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

      {/* Hero Full Screen Premium */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Contenido del lado izquierdo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Logo y título */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                    <Coffee className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-neutral-800">Dunkin</span>
                </div>
              </motion.div>

              {/* Título principal */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                <span className="text-neutral-900">¿Qué dice tu bebida</span>
                <br />
                <span className="text-primary-600">sobre la forma en que</span>
                <br />
                <span className="text-neutral-900">vives tu día?</span>
              </motion.h1>

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg md:text-xl lg:text-2xl text-neutral-600 leading-relaxed max-w-lg"
              >
                Descubre tu personalidad a través de tus bebidas favoritas de Dunkin.
                Un quiz divertido y personalizado solo para ti.
              </motion.p>

              {/* Botón CTA principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <Button
                  size="lg"
                  onClick={handleStartQuiz}
                  className="w-full sm:w-auto px-10 py-6 text-lg md:text-xl shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-200 transition-all"
                >
                  ¡Descubre tu personalidad!
                </Button>
              </motion.div>

              {/* Texto adicional */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex items-center gap-2 text-sm text-neutral-500"
              >
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Quiz disponible solo por tiempo limitado</span>
              </motion.div>
            </motion.div>

            {/* Imagen grande del lado derecho */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="relative"
            >
              {/* Sombra y fondo de la imagen */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary-200 via-transparent to-secondary-200 rounded-[3rem] blur-2xl opacity-50" />
              
              {/* Imagen principal */}
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                {/* Placeholder de imagen premium - puede reemplazarse con una foto real */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Coffee className="w-32 h-32 text-white mx-auto mb-6 opacity-90" />
                    <p className="text-white text-2xl font-bold">Foto premium</p>
                    <p className="text-white/80 text-lg mt-2">de bebida Dunkin</p>
                  </div>
                </div>
              </div>

              {/* Elementos decorativos flotantes */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0], 
                  rotate: [0, 2, 0] 
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -left-4 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center"
              >
                <div className="text-3xl">☕</div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 10, 0], 
                  rotate: [0, -2, 0] 
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -right-6 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center"
              >
                <div className="text-2xl">🍩</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Indicador de scroll suave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-sm text-neutral-500 font-medium">Desliza para ver más</span>
          <motion.div
            animate={{ 
              y: [0, 8, 0] 
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChevronDown className="w-6 h-6 text-primary-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
