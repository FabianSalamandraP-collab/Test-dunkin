"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Smile } from "lucide-react";
import { Button } from "@/components/ui";
import { useQuizStore } from "@/store/quizStore";

interface IntroDrink {
  id: string;
  name: string;
  accent: string;
  textColor: string;
  cup: "cold-brew" | "iced-latte" | "frozen" | "americano";
  imageSrc: string;
}

const INTRO_DRINKS: IntroDrink[] = [
  {
    id: "iced-latte",
    name: "Iced Latte",
    accent: "#D5A064",
    textColor: "#8A5B36",
    cup: "iced-latte",
    imageSrc: "/assets/quiz-intro/drinks/iced-latte.png",
  },
  {
    id: "refresher-mango-pina",
    name: "Refresher Mango Piña",
    accent: "#FF9A1F",
    textColor: "#7A4D2C",
    cup: "americano",
    imageSrc: "/assets/quiz-intro/drinks/Refresher-Mango-Piña.png",
  },
  {
    id: "frutibatido",
    name: "Frutibatido",
    accent: "#FF4FBF",
    textColor: "#FF4FBF",
    cup: "frozen",
    imageSrc: "/assets/quiz-intro/drinks/frutibatido.png",
  },
  {
    id: "frozen-original",
    name: "Frozen Original",
    accent: "#8B5E3C",
    textColor: "#5B3622",
    cup: "frozen",
    imageSrc: "/assets/quiz-intro/drinks/frozen-original.png",
  },
];

function getRelativePosition(
  index: number,
  activeIndex: number,
  total: number
) {
  const rawOffset = index - activeIndex;

  if (rawOffset > total / 2) {
    return rawOffset - total;
  }

  if (rawOffset < -total / 2) {
    return rawOffset + total;
  }

  return rawOffset;
}

function DrinkVisual({
  cup,
  isActive,
}: {
  cup: IntroDrink["cup"];
  isActive: boolean;
}) {
  const scaleClass = isActive ? "scale-100" : "scale-95";

  if (cup === "cold-brew") {
    return (
      <div
        className={`flex h-64 items-end justify-center transition-transform ${scaleClass}`}
      >
        <div className="border-white/70 relative h-40 w-24 overflow-hidden rounded-b-[1.8rem] rounded-t-[1rem] border bg-gradient-to-b from-[#59321B] via-[#2B170E] to-[#130A07] shadow-[0_22px_45px_rgba(44,21,10,0.22)]">
          <div className="bg-white/20 absolute inset-x-0 top-0 h-6" />
          <div className="absolute inset-x-3 top-4 h-2 rounded-full bg-[#9A6335]/35" />
          <div className="absolute inset-x-0 bottom-0 top-9 bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_72%_45%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_35%_75%,rgba(255,255,255,0.07),transparent_18%)]" />
        </div>
      </div>
    );
  }

  if (cup === "iced-latte") {
    return (
      <div
        className={`flex h-64 items-end justify-center transition-transform ${scaleClass}`}
      >
        <div className="h-46 relative w-28 overflow-hidden rounded-b-[2rem] rounded-t-[1.1rem] border border-[#EAD8C1] bg-gradient-to-b from-[#F7E9D2] via-[#E8CAA5] to-[#C98C55] shadow-[0_22px_45px_rgba(120,74,30,0.18)]">
          <div className="bg-white/30 absolute inset-x-3 top-4 h-4 rounded-full" />
          <div className="absolute inset-y-8 left-1/2 w-1 -translate-x-1/2 rounded-full bg-[#FF7A00]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-[0.7rem] font-black tracking-[0.28em] text-[#FF7A00]">
            DUNKIN
          </div>
          <div className="absolute inset-x-2 bottom-12 top-10 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.28),transparent_22%),radial-gradient(circle_at_68%_60%,rgba(255,255,255,0.15),transparent_22%)]" />
        </div>
      </div>
    );
  }

  if (cup === "frozen") {
    return (
      <div
        className={`flex h-72 items-end justify-center transition-transform ${scaleClass}`}
      >
        <div className="relative h-52 w-32 overflow-hidden rounded-b-[2.4rem] rounded-t-[1.6rem] border border-[#EFDCC7] bg-gradient-to-b from-[#F4E8D4] via-[#DBAF75] to-[#B9793A] shadow-[0_26px_54px_rgba(118,73,27,0.25)]">
          <div className="absolute inset-x-2 -top-4 h-16 rounded-full bg-[radial-gradient(circle_at_50%_52%,#FFF8EF_0%,#F4E8D6_45%,transparent_72%)]" />
          <div className="absolute inset-x-5 -top-7 h-10 rounded-full bg-[radial-gradient(circle_at_50%_55%,#4B2417_0%,#2F130B_36%,transparent_72%)] opacity-95" />
          <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 rotate-90 text-sm font-black tracking-[0.25em] text-[#FF7A00]">
            DUNKIN
          </div>
          <div className="absolute inset-x-3 bottom-14 top-16 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.28),transparent_26%),radial-gradient(circle_at_65%_60%,rgba(255,255,255,0.16),transparent_24%)]" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-64 items-end justify-center transition-transform ${scaleClass}`}
    >
      <div className="h-46 relative w-28 overflow-hidden rounded-b-[2rem] rounded-t-[1rem] border border-[#E3D7CC] bg-gradient-to-b from-[#FFFFFF] via-[#F4EEE8] to-[#ECE4DD] shadow-[0_22px_45px_rgba(80,47,19,0.12)]">
        <div className="absolute inset-x-5 top-4 h-3 rounded-full bg-[#3B1C14]" />
        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] text-xs font-black tracking-[0.18em] text-[#FF7A00]">
          DUNKIN
        </div>
      </div>
    </div>
  );
}

function DrinkStage({
  drink,
  isActive,
}: {
  drink: IntroDrink;
  isActive: boolean;
}) {
  const [imageHidden, setImageHidden] = useState(false);

  if (!imageHidden) {
    return (
      <img
        src={drink.imageSrc}
        alt={drink.name}
        className={`max-h-[280px] w-auto object-contain transition-transform duration-300 ${
          isActive ? "scale-100" : "scale-95"
        }`}
        onError={() => setImageHidden(true)}
      />
    );
  }

  return <DrinkVisual cup={drink.cup} isActive={isActive} />;
}

export function IntroScreen() {
  const { startQuiz, questions } = useQuizStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [logoSrc, setLogoSrc] = useState(
    "/assets/quiz-intro/logo/dunkin-logo.svg"
  );
  const [showLogoFallback, setShowLogoFallback] = useState(false);

  const orderedDrinks = useMemo(
    () =>
      INTRO_DRINKS.map((drink, index) => ({
        ...drink,
        offset: getRelativePosition(index, activeIndex, INTRO_DRINKS.length),
      })).sort((a, b) => a.offset - b.offset),
    [activeIndex]
  );

  const goPrev = () => {
    setActiveIndex((current) =>
      current === 0 ? INTRO_DRINKS.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === INTRO_DRINKS.length - 1 ? 0 : current + 1
    );
  };

  const handleStartQuiz = () => {
    startQuiz();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5efe7] px-3 py-3 sm:px-5 sm:py-5">
      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1400px] items-center overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f7f2eb_0%,#f8f3ec_100%)] px-5 py-7 shadow-[0_28px_70px_rgba(102,66,30,0.12)] sm:px-8 lg:px-10 lg:py-10">
        <div className="absolute right-[14%] top-[11%] h-5 w-5 rounded-full bg-[#F54AC5]" />
        <div className="absolute bottom-[29%] left-[37%] h-4 w-4 rounded-full bg-[#F2BE7B]" />
        <div className="absolute bottom-[27%] right-[13%] h-4 w-4 rounded-full bg-[#F7B321]" />
        <div className="absolute left-[48%] top-[8%] hidden h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,222,198,0.96)_0%,rgba(245,222,198,0.68)_52%,rgba(245,222,198,0)_70%)] lg:block" />

        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[430px] space-y-8 lg:pl-2"
          >
            <div className="space-y-7">
              <div className="inline-flex items-center text-[2rem] font-black tracking-[-0.04em] text-[#FF7A00]">
                <img
                  src={logoSrc}
                  alt="Dunkin"
                  className="h-8 w-auto"
                  onError={(event) => {
                    if (logoSrc.endsWith(".svg")) {
                      setLogoSrc("/assets/quiz-intro/logo/dunkin-logo.png");
                      return;
                    }
                    event.currentTarget.style.display = "none";
                    setShowLogoFallback(true);
                  }}
                />
                {showLogoFallback ? (
                  <span className="leading-none">DUNKIN'</span>
                ) : null}
              </div>

              <div className="space-y-6">
                <h1 className="font-display max-w-[430px] text-[2.6rem] uppercase leading-[0.92] tracking-[-0.05em] text-[#4A281B] sm:text-[3.2rem] lg:text-[4.2rem]">
                  DIME QUE TOMAS
                  <br />
                  <span className="text-[#FF7A00]">Y TE DIRE</span>
                  <br />
                  QUIEN ERES
                </h1>

                <div className="max-w-[260px] space-y-2 text-[#4F2B1B]">
                  <div className="flex items-start gap-3">
                    <div className="bg-white mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#FF7A00]/40 text-[#FF7A00] shadow-sm">
                      <Smile className="h-4 w-4" />
                    </div>
                    <p className="text-base font-medium leading-[1.2] sm:text-lg">
                      Descubre tu personalidad
                      <br />a través de tus bebidas
                    </p>
                  </div>
                  <p className="pl-11 text-sm leading-snug text-[#8C6856]">
                    {questions.length} preguntas rápidas con resultado al
                    instante.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="relative flex justify-center"
          >
            <div className="relative mx-auto flex min-h-[480px] w-full max-w-[820px] flex-col items-center justify-center overflow-hidden rounded-[2rem]">
              <button
                type="button"
                onClick={goPrev}
                className="bg-white hover:bg-white absolute left-[8%] top-[43%] z-20 flex h-12 w-12 items-center justify-center rounded-full text-[#FF7A00] shadow-[0_10px_30px_rgba(116,75,33,0.12)] transition hover:scale-105"
                aria-label="Ver bebida anterior"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="bg-white hover:bg-white absolute right-[8%] top-[43%] z-20 flex h-12 w-12 items-center justify-center rounded-full text-[#FF7A00] shadow-[0_10px_30px_rgba(116,75,33,0.12)] transition hover:scale-105"
                aria-label="Ver siguiente bebida"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="relative flex h-[340px] w-full items-end justify-center">
                <AnimatePresence initial={false}>
                  {orderedDrinks.map((drink) => {
                    const distance = Math.abs(drink.offset);
                    const isActive = drink.offset === 0;
                    const x = drink.offset * 132;
                    const scale = isActive ? 1 : distance === 1 ? 0.9 : 0.75;
                    const opacity = isActive ? 1 : distance === 1 ? 0.92 : 0.46;
                    const zIndex = isActive ? 30 : distance === 1 ? 20 : 10;

                    return (
                      <motion.div
                        key={drink.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity, x, scale, zIndex }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="absolute bottom-0 flex flex-col items-center"
                      >
                        <DrinkStage drink={drink} isActive={isActive} />
                        <p
                          className={`mt-4 text-center text-[11px] font-black tracking-[0.05em] sm:text-xs ${
                            isActive ? "opacity-100" : "opacity-80"
                          }`}
                          style={{ color: drink.textColor }}
                        >
                          {drink.name}
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {INTRO_DRINKS.map((drink, index) => (
                  <button
                    key={drink.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6 bg-[#FF7A00]"
                        : "w-2.5 bg-[#CBAE98]"
                    }`}
                    aria-label={`Ver ${drink.name}`}
                  />
                ))}
              </div>

              <div className="mt-7 text-center">
                <Button
                  size="lg"
                  onClick={handleStartQuiz}
                  className="min-w-[210px] rounded-full px-7 py-3.5 text-base shadow-[0_18px_35px_rgba(255,122,0,0.28)] sm:min-w-[230px]"
                >
                  Comenzar test
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="mt-4 text-xs text-[#9A7A67] sm:text-sm">
                  Las imágenes de la portada se cargan desde
                  `public/assets/quiz-intro/drinks/`.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
