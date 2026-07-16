"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CircleHelp,
  Facebook,
  Heart,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useQuizStore } from "@/store/quizStore";

interface IntroDrink {
  id: string;
  name: string;
  accent: string;
  textColor: string;
  cup: "cold-brew" | "iced-latte" | "frozen" | "americano";
  imageSrc?: string;
  imageOffsetMobile?: number;
  imageOffsetDesktop?: number;
  imageOffsetDesktopXl?: number;
  imageScaleMobile?: number;
  imageScaleDesktop?: number;
  imageScaleDesktopXl?: number;
}

const INTRO_DRINKS: IntroDrink[] = [
  {
    id: "cold-brew",
    name: "Ice Té",
    accent: "#5A361F",
    textColor: "#4C2B18",
    cup: "cold-brew",
    imageSrc: "/assets/quiz-intro/drinks/Cold Brew.png",
    imageOffsetMobile: 8,
    imageOffsetDesktop: 12,
    imageOffsetDesktopXl: 16,
  },
  {
    id: "frutibatido",
    name: "Frutibatido",
    accent: "#FF4FBF",
    textColor: "#C83E99",
    cup: "frozen",
    imageSrc: "/assets/quiz-intro/drinks/Frutibatido.png",
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    accent: "#D5A064",
    textColor: "#8A5B36",
    cup: "iced-latte",
    imageSrc: "/assets/quiz-intro/drinks/Iced_Latte.png",
    imageOffsetMobile: 6,
    imageOffsetDesktop: 10,
    imageOffsetDesktopXl: 14,
  },
  {
    id: "refresher-mango-pina",
    name: "Mango Piña Refresher",
    accent: "#FF9A1F",
    textColor: "#7A4D2C",
    cup: "americano",
    imageSrc: "/assets/quiz-intro/drinks/Mango_piña_Refresher.png",
  },
  {
    id: "matcha-latte",
    name: "Soda Dunkin Manzana Verde",
    accent: "#9BAF6B",
    textColor: "#6E7E46",
    cup: "americano",
    imageSrc: "/assets/quiz-intro/drinks/Soda_Dunkin_Manzana_Verde.png",
    imageScaleMobile: 0.88,
    imageScaleDesktop: 0.84,
    imageScaleDesktopXl: 0.84,
  },
];

interface IntroPersonalityCard {
  id: string;
  title: string;
  description: string;
  extendedDescription: string;
  accent: string;
  border: string;
  drink: string;
  matchDrinks: string[];
  imageSrc?: string;
}

const INTRO_PERSONALITIES: IntroPersonalityCard[] = [
  {
    id: "creative",
    title: "El Curioso",
    description: "Te mueves por curiosidad y siempre buscas algo nuevo.",
    extendedDescription:
      "Disfrutas descubrir planes distintos, sabores inesperados y momentos que se sienten frescos desde el primer sorbo.",
    accent: "#D98A36",
    border: "#E7C08D",
    drink: "Iced Latte",
    matchDrinks: ["Iced Latte", "Ice Té", "Soda Dunkin Manzana Verde"],
    imageSrc: "/assets/quiz-intro/personalities/creative.png",
  },
  {
    id: "balanced",
    title: "El Mentor",
    description: "Tu mejor plan tiene calma, buena conversación y balance.",
    extendedDescription:
      "Disfrutas las conversaciones profundas, valoras la calma y prefieres planes que dejen algo bueno en la mente.",
    accent: "#D87093",
    border: "#E8BDD0",
    drink: "Ice Té",
    matchDrinks: ["Ice Té", "Iced Latte", "Soda Dunkin Manzana Verde"],
    imageSrc: "/assets/quiz-intro/personalities/balanced.png",
  },
  {
    id: "energetic",
    title: "El Aventurero",
    description: "Vives el momento y conviertes cualquier idea en plan.",
    extendedDescription:
      "Te mueves rápido, te gusta probar lo nuevo y eres de quienes encienden el parche sin pensarlo demasiado.",
    accent: "#F2A91D",
    border: "#F0CB82",
    drink: "Refresher Mango Piña",
    matchDrinks: ["Refresher Mango Piña", "Frutibatido de Mora", "Iced Latte"],
    imageSrc: "/assets/quiz-intro/personalities/energetic.png",
  },
  {
    id: "passionate",
    title: "La Influencer",
    description: "Ves lo bueno con fuerza y contagias energía al instante.",
    extendedDescription:
      "Te gustan los sabores con carácter, los planes memorables y las experiencias que se sienten vivas desde el primer momento.",
    accent: "#E9539A",
    border: "#E8B8CC",
    drink: "Frutibatido de Mora",
    matchDrinks: ["Frutibatido de Mora", "Refresher Mango Piña", "Ice Té"],
    imageSrc: "/assets/quiz-intro/personalities/passionate.png",
  },
];

const INTRO_FOOTER_ITEMS = [
  "Test oficial de Dunkin Colombia",
  "Participa y descubre tu match",
  "Recomendaciones para ti",
];

const HOW_IT_WORKS_STEPS = [
  "Responde 4 preguntas rápidas sobre tu forma de ser y cómo disfrutas tus planes.",
  "Descubre la bebida Dunkin que mejor representa tu personalidad.",
  "Conoce tu personalidad Dunkin, qué la caracteriza y por qué hace match con esa bebida.",
  "Recibe recomendaciones oficiales relacionadas con tu bebida, como productos, combos o promociones disponibles en Dunkin Colombia.",
];

const HOW_IT_WORKS_INFO = [
  "Las recomendaciones mostradas provienen del sitio oficial de Dunkin Colombia y corresponden a información publicada por la marca.",
  "Nuestro objetivo es ayudarte a descubrir la bebida que mejor conecta con tu personalidad y mostrarte opciones oficiales para disfrutarla.",
  "Los productos, promociones, precios, disponibilidad y condiciones pueden cambiar sin previo aviso y son responsabilidad de Dunkin Colombia.",
];

const DUNKIN_SOCIAL_LINKS = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/dunkin_co/?hl=es",
    icon: Instagram,
    accentClass: "text-[#D84C8D] lg:text-[#C63A7D]",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/DunkinColombia/?locale=es_LA",
    icon: Facebook,
    accentClass: "text-[#8A6040] lg:text-[#6F4D37]",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@dunkin_co",
    icon: TikTokIcon,
    accentClass: "text-[#2D1A12]",
  },
] as const;

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.12v13.18a2.67 2.67 0 1 1-2.67-2.67c.24 0 .47.03.69.09V9.43a5.8 5.8 0 0 0-.69-.04A5.79 5.79 0 1 0 15.82 15V8.33a7.9 7.9 0 0 0 4.62 1.48V6.69h-.85Z" />
    </svg>
  );
}

function getCarouselState(
  index: number,
  activeIndex: number,
  total: number,
  viewportWidth: number
) {
  const normalized = (index - activeIndex + total) % total;
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  const activeState = isMobile
    ? { x: 0, y: -12, scale: 1.27 }
    : isTablet
      ? { x: 0, y: 0, scale: 1.18 }
      : { x: 0, y: -2, scale: 1.2 };

  const nearOffset = isMobile ? 108 : isTablet ? 146 : 176;
  const nearState = isMobile
    ? { y: 14, scale: 0.72 }
    : isTablet
      ? { y: 18, scale: 0.72 }
      : { y: 22, scale: 0.68 };

  const farOffset = isMobile ? 0 : isTablet ? 224 : 264;
  const farState = isTablet
    ? { y: 54, scale: 0.5, opacity: 0.74 }
    : { y: 60, scale: 0.46, opacity: 0.62 };

  if (normalized === 0) {
    return {
      slot: "active" as const,
      x: activeState.x,
      y: activeState.y,
      scale: activeState.scale,
      opacity: 1,
      zIndex: 40,
    };
  }

  if (normalized === 1) {
    return {
      slot: "right-near" as const,
      x: nearOffset,
      y: nearState.y,
      scale: nearState.scale,
      opacity: 1,
      zIndex: 30,
    };
  }

  if (normalized === total - 1) {
    return {
      slot: "left-near" as const,
      x: -nearOffset,
      y: nearState.y,
      scale: nearState.scale,
      opacity: 1,
      zIndex: 30,
    };
  }

  if (isMobile) {
    return {
      slot: "hidden" as const,
      x: 0,
      y: 28,
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
    };
  }

  if (normalized === 2) {
    return {
      slot: "right-far" as const,
      x: farOffset,
      y: farState.y,
      scale: farState.scale,
      opacity: farState.opacity,
      zIndex: 20,
    };
  }

  if (normalized === total - 2) {
    return {
      slot: "left-far" as const,
      x: -farOffset,
      y: farState.y,
      scale: farState.scale,
      opacity: farState.opacity,
      zIndex: 20,
    };
  }

  return {
    slot: "hidden" as const,
    x: 0,
    y: 40,
    scale: 0.6,
    opacity: 0,
    zIndex: 0,
  };
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
        className={`flex h-72 items-end justify-center transition-transform ${scaleClass}`}
      >
        <div className="border-white/70 relative h-48 w-28 overflow-hidden rounded-b-[2rem] rounded-t-[1.1rem] border bg-gradient-to-b from-[#59321B] via-[#2B170E] to-[#130A07] shadow-[0_22px_45px_rgba(44,21,10,0.22)]">
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
        className={`flex h-72 items-end justify-center transition-transform ${scaleClass}`}
      >
        <div className="relative h-56 w-32 overflow-hidden rounded-b-[2.2rem] rounded-t-[1.2rem] border border-[#EAD8C1] bg-gradient-to-b from-[#F7E9D2] via-[#E8CAA5] to-[#C98C55] shadow-[0_22px_45px_rgba(120,74,30,0.18)]">
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
        className={`flex h-80 items-end justify-center transition-transform ${scaleClass}`}
      >
        <div className="relative h-60 w-36 overflow-hidden rounded-b-[2.7rem] rounded-t-[1.8rem] border border-[#EFDCC7] bg-gradient-to-b from-[#F4E8D4] via-[#DBAF75] to-[#B9793A] shadow-[0_26px_54px_rgba(118,73,27,0.25)]">
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
      className={`flex h-72 items-end justify-center transition-transform ${scaleClass}`}
    >
      <div className="relative h-54 w-32 overflow-hidden rounded-b-[2.2rem] rounded-t-[1.1rem] border border-[#E3D7CC] bg-gradient-to-b from-[#FFFFFF] via-[#F4EEE8] to-[#ECE4DD] shadow-[0_22px_45px_rgba(80,47,19,0.12)]">
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
  viewportWidth,
}: {
  drink: IntroDrink;
  isActive: boolean;
  viewportWidth: number;
}) {
  const [imageHidden, setImageHidden] = useState(false);
  const imageOffset =
    viewportWidth >= 1280
      ? drink.imageOffsetDesktopXl || drink.imageOffsetDesktop || 0
      : viewportWidth >= 1024
        ? drink.imageOffsetDesktop || 0
        : drink.imageOffsetMobile || 0;
  const imageScale =
    viewportWidth >= 1280
      ? drink.imageScaleDesktopXl || drink.imageScaleDesktop || 1
      : viewportWidth >= 1024
        ? drink.imageScaleDesktop || 1
        : drink.imageScaleMobile || 1;

  if (drink.imageSrc && !imageHidden) {
    return (
      <div
        className="flex w-full justify-center"
        style={{
          transform: `translateX(${imageOffset}px) scale(${imageScale})`,
        }}
      >
        <img
          src={drink.imageSrc}
          alt={drink.name}
          className={`max-h-[320px] w-auto object-contain transition-transform duration-300 sm:max-h-[580px] lg:max-h-[630px] xl:max-h-[660px] ${
            isActive ? "scale-100" : "scale-[0.94]"
          }`}
          onError={() => setImageHidden(true)}
        />
      </div>
    );
  }

  return <DrinkVisual cup={drink.cup} isActive={isActive} />;
}

function SideRibbon({
  side,
  className,
}: {
  side: "left" | "right";
  className?: string;
}) {
  const items = Array.from({ length: 40 });
  const [useFallback, setUseFallback] = useState(false);
  const imageSrc =
    side === "left"
      ? "/assets/quiz-intro/borders/side-ribbon-left.png"
      : "/assets/quiz-intro/borders/side-ribbon-right.png";

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 overflow-hidden flex ${
        side === "left" ? "left-0" : "right-0"
      } w-[26px] sm:w-[34px] md:w-[42px] lg:w-[72px] xl:w-[78px] ${className ?? ""}`}
    >
      {!useFallback ? (
        <div aria-hidden="true" className="flex w-full flex-col">
          {items.map((_, index) => (
            <img
              key={`${side}-ribbon-${index}`}
              src={imageSrc}
              alt=""
              className="-mt-px block h-auto w-full shrink-0 first:mt-0"
              onError={() => setUseFallback(true)}
            />
          ))}
        </div>
      ) : (
        <div
          className={`flex h-full w-full flex-col items-center justify-around bg-[linear-gradient(180deg,#f34aa7_0%,#ea4f9b_20%,#ef6f6c_50%,#f34aa7_100%)] ${
            side === "left" ? "pl-0.5" : "pr-0.5"
          }`}
        >
          {items.map((_, index) => (
            <span
              key={`${side}-${index}`}
              className={`text-[0.78rem] font-black uppercase tracking-[0.18em] text-[#FF9A1F] ${
                side === "left" ? "-rotate-90" : "rotate-90"
              }`}
            >
              DUNKIN'
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonalityPlaceholder({
  accent,
}: {
  accent: IntroPersonalityCard["accent"];
}) {
  return (
    <div className="relative flex h-[138px] w-[92px] items-end justify-center overflow-hidden rounded-[1.3rem] bg-[linear-gradient(180deg,#f8efe5_0%,#f2e6d7_100%)]">
      <div
        className="absolute bottom-3 h-[56px] w-[56px] rounded-full opacity-25 blur-xl"
        style={{ backgroundColor: accent }}
      />
      <div className="absolute inset-x-5 top-5 h-8 rounded-full bg-white/75 blur-sm" />
      <div className="absolute top-7 h-12 w-12 rounded-full bg-[#f0d9c6]" />
      <div className="absolute top-[4.6rem] h-[54px] w-[62px] rounded-t-[1.3rem] bg-[#edd8c4]" />
      <div className="absolute bottom-4 text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-[#a98a76]">
        Personaje Dunkin
      </div>
    </div>
  );
}

function PersonalityCard({ card }: { card: IntroPersonalityCard }) {
  const [imageHidden, setImageHidden] = useState(false);
  return (
    <div
      className="w-[282px] shrink-0 rounded-[1.4rem] border bg-[linear-gradient(180deg,rgba(255,248,240,0.9)_0%,rgba(251,244,236,0.98)_100%)] p-3 shadow-[0_14px_34px_rgba(102,66,30,0.08)] md:w-auto md:shrink"
      style={{ borderColor: card.border }}
    >
      <div className="flex gap-3">
        <div className="shrink-0 overflow-hidden rounded-[1.2rem]">
          {!imageHidden && card.imageSrc ? (
            <img
              src={card.imageSrc}
              alt={card.title}
              className="h-[138px] w-[92px] object-cover"
              onError={() => setImageHidden(true)}
            />
          ) : (
            <PersonalityPlaceholder accent={card.accent} />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.7rem] font-black"
              style={{
                color: card.accent,
                backgroundColor: `${card.accent}14`,
              }}
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              {card.title}
            </div>
            <p className="text-[0.82rem] leading-5 text-[#5E483B]">
              {card.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8E705D]">
              {card.drink}
            </span>
            <div
              className="flex h-10 w-7 items-end justify-center rounded-b-[0.8rem] rounded-t-[0.5rem] border border-white/70 shadow-[0_10px_18px_rgba(120,74,30,0.1)]"
              style={{
                background: `linear-gradient(180deg,#fff4e6 0%, ${card.accent}55 100%)`,
              }}
            >
              <div className="mb-2 h-5 w-[2px] rounded-full bg-[#FF7A00]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalityDetailPanel({
  card,
  compact = false,
}: {
  card: IntroPersonalityCard;
  compact?: boolean;
}) {
  const [imageHidden, setImageHidden] = useState(false);
  return (
    <div
      className={`rounded-[1.45rem] border bg-[linear-gradient(180deg,rgba(255,250,245,0.96)_0%,rgba(252,245,238,0.98)_100%)] shadow-[0_18px_40px_rgba(102,66,30,0.1)] ${
        compact ? "p-3.5" : "p-4 md:p-5"
      }`}
      style={{ borderColor: card.border }}
    >
      <div className={`grid gap-3 ${compact ? "grid-cols-1" : "md:grid-cols-[112px_minmax(0,1fr)] md:items-start"}`}>
        <div className={`overflow-hidden rounded-[1.2rem] ${compact ? "hidden" : "md:block"}`}>
          {!imageHidden && card.imageSrc ? (
            <img
              src={card.imageSrc}
              alt={card.title}
              className="h-[132px] w-[112px] object-cover"
              onError={() => setImageHidden(true)}
            />
          ) : (
            <div className="hidden md:block">
              <PersonalityPlaceholder accent={card.accent} />
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <div
              className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.72rem] font-black"
              style={{
                color: card.accent,
                backgroundColor: `${card.accent}14`,
              }}
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              {card.title}
            </div>
            <p className="text-[0.95rem] font-semibold leading-6 text-[#4F2B1B]">
              {card.extendedDescription}
            </p>
          </div>
          <div
            className="rounded-[1.1rem] px-3.5 py-3"
            style={{ backgroundColor: `${card.accent}10` }}
          >
            <p
              className="text-[0.68rem] font-black uppercase tracking-[0.16em]"
              style={{ color: card.accent }}
            >
              Bebidas que van contigo
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {card.matchDrinks.map((drink) => (
                <span
                  key={`${card.id}-${drink}`}
                  className="inline-flex items-center gap-2 rounded-full border bg-white/86 px-2.5 py-1.5 text-[0.78rem] font-semibold text-[#4A281B] shadow-[0_6px_14px_rgba(102,66,30,0.06)]"
                  style={{ borderColor: `${card.accent}24` }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: card.accent }}
                  />
                  {drink}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IntroScreen() {
  const { startQuiz, questions } = useQuizStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLogoFallback, setShowLogoFallback] = useState(false);
  const [showHeadlineFallback, setShowHeadlineFallback] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showPersonalities, setShowPersonalities] = useState(false);
  const [showPersonalityDetails, setShowPersonalityDetails] = useState(false);
  const [activePersonalityIndex, setActivePersonalityIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const activeDrink = INTRO_DRINKS[activeIndex];
  const activePersonality = INTRO_PERSONALITIES[activePersonalityIndex];
  const lastPointerDownAtRef = useRef<number>(0);
  const [bumpKey, setBumpKey] = useState(0);
  const isMobile = viewportWidth < 640;

  useEffect(() => {
    setBumpKey((current) => current + 1);
  }, [activeIndex]);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  useEffect(() => {
    const updateScrollState = () => setShowBackToTop(window.scrollY > 320);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

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

  const setDrinkByIndex = (index: number) => {
    setActiveIndex(index);
  };

  const pointerGate = () => {
    lastPointerDownAtRef.current = Date.now();
  };

  const shouldIgnoreClick = () => Date.now() - lastPointerDownAtRef.current < 450;

  const handlePrevPointerDown = () => {
    pointerGate();
    goPrev();
  };

  const handleNextPointerDown = () => {
    pointerGate();
    goNext();
  };

  const handlePrevClick = () => {
    if (shouldIgnoreClick()) return;
    goPrev();
  };

  const handleNextClick = () => {
    if (shouldIgnoreClick()) return;
    goNext();
  };

  const handleDotPointerDown = (index: number) => {
    pointerGate();
    setDrinkByIndex(index);
  };

  const handleDotClick = (index: number) => {
    if (shouldIgnoreClick()) return;
    setDrinkByIndex(index);
  };

  const handlePrevPersonality = () => {
    setActivePersonalityIndex((current) =>
      current === 0 ? INTRO_PERSONALITIES.length - 1 : current - 1
    );
  };

  const handleNextPersonality = () => {
    setActivePersonalityIndex((current) =>
      current === INTRO_PERSONALITIES.length - 1 ? 0 : current + 1
    );
  };

  const handleTogglePersonalityDetails = (index?: number) => {
    if (typeof index === "number") {
      if (index === activePersonalityIndex) {
        setShowPersonalityDetails((current) => !current);
      } else {
        setActivePersonalityIndex(index);
        setShowPersonalityDetails(true);
      }
      return;
    }

    setShowPersonalityDetails((current) => !current);
  };

  const handleStartQuiz = () => {
    startQuiz();
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8f1ea_0%,#f6ede6_100%)] px-2 py-2 sm:px-4 sm:py-4">
      <div className="relative mx-auto overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#fbf6f0_0%,#f6efe6_100%)] shadow-[0_30px_80px_rgba(89,53,17,0.12)] lg:max-w-[1460px]">
        <SideRibbon side="left" />
        <SideRibbon side="right" />
        <div className="pointer-events-none absolute left-[26px] top-0 h-[64px] w-[86px] rounded-br-[2rem] bg-[#FA192A] shadow-[inset_-6px_-6px_14px_rgba(255,255,255,0.12)] sm:left-[34px] sm:h-[72px] sm:w-[96px] md:left-[42px] md:h-[80px] md:w-[104px] lg:hidden" />
        <div className="pointer-events-none absolute right-[26px] top-0 h-[64px] w-[86px] rounded-bl-[2rem] bg-[#FA192A] shadow-[inset_6px_-6px_14px_rgba(255,255,255,0.12)] sm:right-[34px] sm:h-[72px] sm:w-[96px] md:right-[42px] md:h-[80px] md:w-[104px] lg:hidden" />
        <div className="pointer-events-none absolute bottom-0 left-[26px] h-[64px] w-[86px] rounded-tr-[2rem] bg-[#FA192A] shadow-[inset_-6px_6px_14px_rgba(255,255,255,0.12)] sm:left-[34px] sm:h-[72px] sm:w-[96px] md:left-[42px] md:h-[80px] md:w-[104px] lg:hidden" />
        <div className="pointer-events-none absolute bottom-0 right-[26px] h-[64px] w-[86px] rounded-tl-[2rem] bg-[#FA192A] shadow-[inset_6px_6px_14px_rgba(255,255,255,0.12)] sm:right-[34px] sm:h-[72px] sm:w-[96px] md:right-[42px] md:h-[80px] md:w-[104px] lg:hidden" />
        <div className="pointer-events-none absolute left-[72px] top-0 hidden h-[120px] w-[168px] rounded-br-[2.9rem] bg-[#FA192A] shadow-[inset_-8px_-8px_18px_rgba(255,255,255,0.12)] lg:block xl:left-[78px]" />
        <div className="pointer-events-none absolute right-[72px] top-0 hidden h-[120px] w-[168px] rounded-bl-[2.9rem] bg-[#FA192A] shadow-[inset_8px_-8px_18px_rgba(255,255,255,0.12)] lg:block xl:right-[78px]" />
        <div className="pointer-events-none absolute bottom-0 left-[72px] hidden h-[120px] w-[168px] rounded-tr-[2.9rem] bg-[#FA192A] shadow-[inset_-8px_8px_18px_rgba(255,255,255,0.12)] lg:block xl:left-[78px]" />
        <div className="pointer-events-none absolute bottom-0 right-[72px] hidden h-[120px] w-[168px] rounded-tl-[2.9rem] bg-[#FA192A] shadow-[inset_8px_8px_18px_rgba(255,255,255,0.12)] lg:block xl:right-[78px]" />

        <div className="relative mx-[26px] rounded-[2rem] border border-[#f0ded0] bg-[linear-gradient(180deg,#fbf6f0_0%,#f7efe5_100%)] px-4 py-5 sm:mx-[34px] sm:px-6 sm:py-6 md:mx-[42px] md:px-7 md:py-6 lg:mx-[72px] lg:my-0 lg:px-8 lg:py-7 xl:mx-[78px]">
          <div
            className="pointer-events-none absolute inset-0 rounded-[2rem] bg-no-repeat opacity-90"
            style={{
              backgroundImage:
                "url('/assets/quiz-intro/backgrounds/hero-main-bg.png')",
              backgroundPosition: isMobile ? "50% 50%" : "56% 46%",
              backgroundSize: isMobile ? "cover" : "cover",
            }}
          />
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2rem] ${
              isMobile
                ? "bg-[linear-gradient(180deg,rgba(251,246,240,0.28)_0%,rgba(251,246,240,0.14)_18%,rgba(251,246,240,0.22)_42%,rgba(251,246,240,0.58)_72%,rgba(251,246,240,0.88)_90%,rgba(251,246,240,0.95)_100%)]"
                : "bg-[linear-gradient(90deg,rgba(251,246,240,0.96)_0%,rgba(251,246,240,0.93)_34%,rgba(251,246,240,0.3)_56%,rgba(251,246,240,0.04)_74%)]"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2rem] ${
              isMobile
                ? "bg-[radial-gradient(circle_at_50%_22%,rgba(255,247,239,0.24)_0%,rgba(255,247,239,0.14)_24%,rgba(255,247,239,0.04)_46%,rgba(255,247,239,0)_68%),radial-gradient(circle_at_50%_78%,rgba(255,247,239,0.18)_0%,rgba(255,247,239,0.08)_20%,rgba(255,247,239,0)_50%)] opacity-100"
                : "bg-[radial-gradient(circle_at_12%_24%,rgba(251,246,240,0.92)_0%,rgba(251,246,240,0.68)_34%,rgba(251,246,240,0)_60%)] opacity-90"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2rem] ${
              isMobile
                ? "bg-[radial-gradient(circle_at_50%_28%,rgba(255,138,0,0.16)_0%,rgba(247,84,166,0.14)_18%,rgba(255,138,0,0.08)_34%,rgba(255,255,255,0)_52%),radial-gradient(circle_at_50%_64%,rgba(255,173,102,0.12)_0%,rgba(247,84,166,0.08)_24%,rgba(255,255,255,0)_52%)] opacity-80"
                : "bg-[radial-gradient(circle_at_64%_20%,rgba(255,138,0,0.18)_0%,rgba(247,84,166,0.14)_22%,rgba(255,138,0,0.08)_38%,rgba(255,255,255,0)_58%)] opacity-55"
            }`}
          />
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_62%,rgba(255,255,255,0.14)_100%)]" />
          <div className="pointer-events-none absolute inset-[2%] rounded-[1.8rem] bg-[radial-gradient(circle_at_62%_24%,rgba(255,255,255,0)_0_40px,rgba(255,255,255,0.28)_41px_42px,rgba(255,255,255,0)_43px),radial-gradient(circle_at_62%_24%,rgba(255,255,255,0)_0_56px,rgba(255,255,255,0.22)_57px_58px,rgba(255,255,255,0)_59px)] opacity-60 mix-blend-screen" />
          <div
            className={`pointer-events-none absolute rounded-[999px] blur-3xl ${
              isMobile
                ? "inset-x-[10%] top-[8%] h-[62%] bg-[radial-gradient(circle_at_50%_36%,rgba(255,236,219,0.28)_0%,rgba(255,236,219,0.14)_38%,rgba(255,236,219,0)_76%)]"
                : "inset-x-[37%] top-[8%] h-[48%] bg-[radial-gradient(circle_at_50%_30%,rgba(255,236,219,0.28)_0%,rgba(255,236,219,0.12)_40%,rgba(255,236,219,0)_74%)]"
            }`}
          />
          <div className="pointer-events-none absolute left-0 top-[15%] hidden h-[72%] w-[120px] bg-[radial-gradient(circle_at_left,rgba(242,111,108,0.12)_0%,rgba(255,255,255,0)_72%)] lg:block" />
          <div className="pointer-events-none absolute right-0 top-[15%] hidden h-[72%] w-[120px] bg-[radial-gradient(circle_at_right,rgba(242,111,108,0.12)_0%,rgba(255,255,255,0)_72%)] lg:block" />

          <div className="relative">
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-[1.6rem] sm:flex-row sm:justify-between sm:gap-4 sm:px-0 lg:grid lg:grid-cols-[440px_minmax(0,1fr)] lg:items-center lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="relative mx-auto grid w-[13.5rem] grid-cols-[1fr_auto_1fr] items-center text-[2rem] font-black tracking-[-0.04em] text-[#FF7A00] sm:mx-0 sm:flex sm:w-auto sm:items-center sm:gap-4 lg:-ml-8 lg:w-[410px] lg:max-w-none lg:justify-center"
              >
                <div className="flex h-[4.35rem] items-center justify-center pr-3 sm:h-auto sm:pr-0">
                  {!showLogoFallback ? (
                    <img
                      src="/assets/quiz-intro/logo/dunkin-logo.png"
                      alt="Dunkin"
                      className="h-7 w-auto shrink-0 sm:h-8"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        setShowLogoFallback(true);
                      }}
                    />
                  ) : null}
                  {showLogoFallback ? (
                    <span className="leading-none">DUNKIN'</span>
                  ) : null}
                </div>
                <span
                  aria-hidden="true"
                  className="h-8 w-px shrink-0 justify-self-center rounded-full bg-[#E8CDB9] sm:h-7 lg:h-8"
                />
                <div className="flex h-[4.35rem] items-center justify-center pl-3 sm:h-auto sm:pl-0">
                  <img
                    src="/assets/quiz-intro/logo/YES_ALL_DAY.png"
                    alt="Yes All Day"
                    className="relative top-[1px] h-[4.7rem] w-auto shrink-0 object-contain sm:h-[4.5rem] lg:h-[5.5rem]"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </motion.div>

              <button
                type="button"
                onClick={() => setShowHowItWorks((current) => !current)}
                aria-expanded={showHowItWorks}
                aria-controls="how-it-works-panel"
                className="inline-flex items-center gap-2 rounded-full border border-[#E6C8B3] bg-[#FFF3E8]/90 px-4 py-2 text-[0.9rem] font-semibold text-[#4A281B] shadow-[0_10px_26px_rgba(102,66,30,0.12)] transition-colors hover:bg-[#FFF7F0] lg:justify-self-end"
              >
                <CircleHelp className="h-4 w-4 text-[#C9833A]" />
                <span className="hidden sm:inline">¿Cómo funciona el test?</span>
                <span className="sm:hidden">Ayuda</span>
              </button>
            </div>

            {showHowItWorks ? (
              <motion.div
                id="how-it-works-panel"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 mt-4 rounded-[1.5rem] border border-[#EDD6C4] bg-[linear-gradient(180deg,rgba(255,248,240,0.94)_0%,rgba(255,244,236,0.98)_100%)] p-4 shadow-[0_18px_42px_rgba(102,66,30,0.08)] sm:p-5 lg:max-w-[940px]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF0E0] text-[#C9833A]">
                    <CircleHelp className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[#B86B2C]">
                        ¿Cómo funciona?
                      </p>
                      <h2 className="text-[1.05rem] font-semibold leading-6 text-[#4A281B] sm:text-[1.12rem]">
                        Descubre tu bebida Dunkin en solo 4 pasos.
                      </h2>
                    </div>
                    <div className="space-y-3 text-[0.9rem] leading-6 text-[#6B5448] sm:text-[0.95rem]">
                      <ol className="space-y-2.5">
                        {HOW_IT_WORKS_STEPS.map((step, index) => (
                          <li
                            key={step}
                            className="flex items-start gap-2.5 rounded-[1rem] bg-white/55 px-3 py-2.5"
                          >
                            <span className="mt-0.5 inline-flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-[#FFE7D2] text-[0.74rem] font-black text-[#B86B2C]">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                      <div className="space-y-2 rounded-[1rem] border border-[#F0DDCF] bg-white/52 px-3.5 py-3">
                        <h3 className="text-[0.82rem] font-bold uppercase tracking-[0.12em] text-[#8E5A31]">
                          Información importante
                        </h3>
                        <div className="space-y-2.5">
                          {HOW_IT_WORKS_INFO.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}

            <div className="relative z-10 mt-4 grid grid-cols-1 gap-3 px-[1.35rem] sm:mt-5 sm:gap-5 sm:px-0 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-7">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-1 mx-auto flex w-full max-w-[420px] flex-col items-center space-y-2 text-center lg:order-1 lg:mx-0 lg:block lg:max-w-[440px] lg:space-y-4 lg:pt-3 lg:pl-4 lg:text-left"
            >
              <div className="space-y-2.5">
                <div className="space-y-2 lg:hidden">
                  <div className="inline-flex items-center rounded-full border border-[#F0DFD0] bg-white/80 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.11em] text-[#B86B2C] shadow-[0_8px_18px_rgba(102,66,30,0.08)]">
                    Desliza y descubre tu match
                  </div>
                  <div className="pt-1">
                    <div
                      className={`mx-auto w-full max-w-[248px] overflow-hidden rounded-[1.65rem] border border-[#F0DFD0] bg-white/55 p-2.5 shadow-[0_18px_40px_rgba(89,53,17,0.12)] ${
                        showHeadlineFallback ? "hidden" : ""
                      }`}
                    >
                      <img
                        src="/assets/quiz-intro/headlines/dime-que-tomas.png"
                        alt="Dime qué tomas y te diré quién eres"
                        className="w-full select-none object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          setShowHeadlineFallback(true);
                        }}
                      />
                    </div>
                    {showHeadlineFallback ? (
                      <h1 className="font-display text-[1.26rem] uppercase leading-[0.9] tracking-[-0.05em] text-[#442214]">
                        Dime qué tomas
                        <br />y te diré quién eres
                      </h1>
                    ) : null}
                    <span className="sr-only">
                      Dime qué tomas y te diré quién eres
                    </span>
                  </div>
                </div>

                <div className="hidden max-w-[410px] space-y-2.5 text-[#4F2B1B] lg:block">
                  <div
                    className={`w-full max-w-[480px] overflow-hidden rounded-[1.85rem] border border-[rgba(240,223,208,0.72)] bg-[rgba(251,246,240,0.62)] p-2.5 shadow-[0_18px_40px_rgba(89,53,17,0.1)] ${
                      showHeadlineFallback ? "hidden" : ""
                    }`}
                  >
                    <img
                      src="/assets/quiz-intro/headlines/dime-que-tomas.png"
                      alt="Dime qué tomas y te diré quién eres"
                      className="w-full select-none object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        setShowHeadlineFallback(true);
                      }}
                    />
                  </div>
                  {showHeadlineFallback ? (
                    <h1 className="font-display max-w-[520px] text-[2.05rem] uppercase leading-[0.9] tracking-[-0.06em] text-[#442214] sm:text-[2.95rem] lg:text-[3.6rem]">
                      DIME QUÉ
                      <br />
                      TOMAS
                      <br />
                      <span className="text-[#FF7A00]">Y TE DIRÉ</span>
                      <br />
                      QUIÉN ERES
                    </h1>
                  ) : null}
                  <span className="sr-only">
                    Dime qué tomas y te diré quién eres
                  </span>
                  <p className="max-w-[430px] rounded-[1.1rem] border border-[#F0DFD0] bg-white/74 px-4 py-3 text-[0.95rem] font-semibold leading-7 text-[#4E3325] shadow-[0_10px_26px_rgba(102,66,30,0.06)] backdrop-blur-[2px]">
                    En 4 preguntas descubrimos tu match Dunkin y al final te
                    damos una recomendación de bebidas para acompañar tu mood.
                  </p>
                  <div className="rounded-[1.2rem] border border-[#F0DFD0] bg-white/72 p-3 shadow-[0_10px_26px_rgba(102,66,30,0.06)]">
                    <p className="text-[0.9rem] font-black leading-6 text-[#432418]">
                      {questions.length} preguntas rápidas con resultado al
                      instante
                    </p>
                    <p className="mt-1 text-[0.82rem] font-medium leading-5 text-[#6C5041]">
                      Responde y descubre tu recomendación.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-1.5 pt-0 lg:items-start">
                  <Button
                    size="lg"
                    onClick={handleStartQuiz}
                    className="group relative w-full max-w-[18.2rem] overflow-hidden border border-[#F0C79B] bg-[linear-gradient(180deg,#FFAA43_0%,#FF8A1E_54%,#F56E00_100%)] px-7 py-3.5 text-white shadow-[0_16px_30px_rgba(255,122,0,0.18)] ring-1 ring-[#FFF2E3]/85 [border-radius:999px_999px_920px_999px] before:absolute before:inset-x-[18%] before:top-[10%] before:h-[34%] before:rounded-full before:bg-white/14 before:blur-xl before:content-[''] hover:border-[#E8B782] hover:shadow-[0_20px_36px_rgba(245,110,0,0.22)] sm:min-w-[272px] sm:w-auto sm:px-11 sm:py-5"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 font-display uppercase tracking-[-0.04em]">
                      <span className="text-[1rem] sm:text-[1.12rem] lg:hidden">
                        Haz el test
                      </span>
                      <span className="hidden text-[1.12rem] sm:text-[1.16rem] lg:inline">
                        Descubre tu bebida ideal
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
                        <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </span>
                  </Button>
                  <div className="inline-flex items-center rounded-full border border-[#F2DFC9] bg-white/82 px-3.5 py-1.5 text-[0.7rem] font-semibold text-[#7A5134] shadow-[0_10px_22px_rgba(102,66,30,0.06)] lg:ml-1">
                    <span className="lg:hidden">4 preguntas • 1 minuto</span>
                    <span className="hidden lg:inline">
                      4 preguntas para descubrir tu match Dunkin
                    </span>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-[#F0DFD0] bg-white/88 px-3 py-1.5 text-[0.72rem] font-semibold text-[#6B4733] shadow-[0_10px_22px_rgba(102,66,30,0.06)] lg:hidden">
                    <span>Responde rápido y descubre tu recomendación.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="order-2 relative mx-auto w-full max-w-[368px] lg:order-2 lg:mx-0 lg:ml-[6.25rem] lg:max-w-none lg:-mt-[8.25rem] xl:ml-[7.25rem] xl:-mt-[9.25rem] 2xl:ml-[7.75rem]"
            >
              <div className="relative mx-auto flex min-h-[330px] w-full max-w-[1180px] flex-col items-center justify-start overflow-visible rounded-[1.75rem] px-[1.25rem] pb-2 pt-2 sm:min-h-[620px] sm:rounded-[2rem] sm:px-4 sm:pb-2 sm:pt-2 lg:min-h-[740px]">
                <div className="pointer-events-none absolute left-[18%] top-[14%] h-3.5 w-3.5 rounded-full bg-[#F2A400] sm:top-[22%]" />
                <div className="pointer-events-none absolute right-[16%] top-[12%] h-3.5 w-3.5 rounded-full bg-[#F2A400] sm:top-[20%]" />
                <div className="pointer-events-none absolute right-[14%] top-[34%] h-2.5 w-2.5 rounded-full bg-[#F34AA7] sm:top-[38%]" />
                <div className="pointer-events-none absolute left-[20%] bottom-[16%] h-3 w-3 rounded-full bg-[#F34AA7]" />
                <div className="pointer-events-none absolute right-[18%] bottom-[18%] h-3 w-3 rounded-full bg-[#F2A400]" />
                <div
                  className={`pointer-events-none absolute inset-x-0 mx-auto rounded-full blur-2xl ${
                    isMobile
                      ? "top-2 h-[160px] w-[160px] bg-[radial-gradient(circle,rgba(255,208,170,0.4)_0%,rgba(248,105,168,0.16)_34%,rgba(255,255,255,0)_72%)]"
                      : "top-14 h-[340px] w-[340px] bg-[radial-gradient(circle,rgba(255,236,219,0.26)_0%,rgba(255,236,219,0.12)_36%,rgba(255,255,255,0)_70%)] sm:h-[430px] sm:w-[430px]"
                  }`}
                />
                <div
                  className={`pointer-events-none absolute inset-x-0 mx-auto ${
                    isMobile
                      ? "bottom-[4.35rem] h-[1.1rem] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(232,195,165,0.9)_0%,rgba(232,195,165,0.42)_54%,rgba(255,255,255,0)_100%)] blur-md"
                      : "hidden"
                  }`}
                />
                <div
                  className={`pointer-events-none absolute inset-x-0 mx-auto ${
                    isMobile
                      ? "bottom-[4.7rem] h-[3.4rem] w-[78%] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,248,241,0.72)_0%,rgba(243,223,205,0.58)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.58)]"
                      : "hidden"
                  }`}
                />

                <button
                  type="button"
                  onPointerDown={isMobile ? undefined : handlePrevPointerDown}
                  onClick={isMobile ? goPrev : handlePrevClick}
                  className="absolute left-3 top-[14%] z-[80] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(180deg,#FFF9F3_0%,#FFF1E7_100%)] text-[#4A281B] shadow-[0_18px_40px_rgba(116,75,33,0.2)] ring-1 ring-[#E6C8B3]/70 backdrop-blur-sm transition-transform active:scale-[0.97] sm:left-5 sm:top-[42%] sm:h-12 sm:w-12 lg:left-10 lg:h-12 lg:w-12 lg:hover:scale-105"
                  aria-label="Ver bebida anterior"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <button
                  type="button"
                  onPointerDown={isMobile ? undefined : handleNextPointerDown}
                  onClick={isMobile ? goNext : handleNextClick}
                  className="absolute right-3 top-[14%] z-[80] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(180deg,#FFF9F3_0%,#FFF1E7_100%)] text-[#4A281B] shadow-[0_18px_40px_rgba(116,75,33,0.2)] ring-1 ring-[#E6C8B3]/70 backdrop-blur-sm transition-transform active:scale-[0.97] sm:right-5 sm:top-[42%] sm:h-12 sm:w-12 lg:right-10 lg:h-12 lg:w-12 lg:hover:scale-105"
                  aria-label="Ver siguiente bebida"
                >
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="relative -mt-3 flex h-[292px] w-full items-end justify-center overflow-visible sm:-mt-4 sm:h-[560px] lg:-mt-4 lg:h-[650px]">
                  {INTRO_DRINKS.map((drink, index) => {
                    const state = getCarouselState(
                      index,
                      activeIndex,
                      INTRO_DRINKS.length,
                      viewportWidth
                    );
                    const isActive = state.slot === "active";
                    const shouldFloatActive = isActive && viewportWidth >= 640 && viewportWidth < 1024;

                    return (
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-[5.9rem] flex justify-center sm:bottom-10 lg:bottom-12"
                        style={{ zIndex: state.zIndex }}
                      >
                        <motion.div
                          key={drink.id}
                          initial={false}
                          animate={{
                            opacity: state.opacity,
                            x: state.x,
                            y: shouldFloatActive
                              ? [state.y, state.y - 10, state.y]
                              : state.y,
                          }}
                          transition={{
                            x: {
                              type: "spring",
                              stiffness: 180,
                              damping: 24,
                            },
                            opacity: { duration: 0.22, ease: "easeOut" },
                            y: shouldFloatActive
                              ? {
                                  duration: 2.8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }
                              : { duration: 0.22, ease: "easeOut" },
                          }}
                          className="flex w-[136px] flex-col items-center sm:w-[260px] lg:w-[300px] xl:w-[320px]"
                        >
                          <motion.div
                            key={`${drink.id}-${isActive ? activeIndex : "idle"}`}
                            initial={false}
                            animate={{ scale: state.scale }}
                            transition={{
                              type: "spring",
                              stiffness: 220,
                              damping: 20,
                            }}
                            className={`origin-bottom rounded-[1.8rem] transition-all ${
                              isActive
                                ? "drop-shadow-[0_24px_40px_rgba(102,66,30,0.16)]"
                                : "drop-shadow-[0_10px_26px_rgba(102,66,30,0.08)]"
                            }`}
                          >
                            <div
                              key={isActive ? bumpKey : undefined}
                              className={isActive ? "dunkin-bump" : ""}
                            >
                              <DrinkStage
                                drink={drink}
                                isActive={isActive}
                                viewportWidth={viewportWidth}
                              />
                            </div>
                          </motion.div>
                          <span
                            className={`font-display mt-1 items-center justify-center overflow-hidden border border-[#eadccd] px-2 text-center leading-[1.02] shadow-[0_8px_20px_rgba(102,66,30,0.08)] sm:mt-2 sm:inline-flex sm:min-h-[44px] sm:w-[148px] sm:px-3.5 sm:py-1.5 sm:text-[11px] ${
                              isMobile
                                ? state.slot === "hidden"
                                  ? "hidden"
                                  : isActive
                                    ? "inline-flex min-h-[34px] w-[132px] px-2.5 py-1 text-[8.1px]"
                                    : "inline-flex min-h-[28px] w-[92px] px-2 py-0.5 text-[6.9px]"
                                : "inline-flex sm:max-w-none"
                            } ${
                              isActive ? "opacity-100" : "opacity-98"
                            } ${
                              isMobile
                                ? "rotate-0"
                                : state.slot === "left-far"
                                ? "-rotate-[5deg]"
                                : state.slot === "left-near"
                                  ? "-rotate-[2deg]"
                                  : state.slot === "right-near"
                                    ? "rotate-[2deg]"
                                    : state.slot === "right-far"
                                      ? "rotate-[5deg]"
                                      : "-rotate-[1deg]"
                            }`}
                            style={{
                              color: isMobile
                                ? drink.textColor
                                : state.slot === "active"
                                  ? "#4A281B"
                                  : drink.textColor,
                              background: isMobile
                                ? `linear-gradient(180deg, #FFF8EF 0%, ${drink.textColor}14 100%)`
                                : undefined,
                              borderColor:
                                isMobile
                                  ? `${drink.textColor}30`
                                  : undefined,
                              borderRadius: "14px 10px 15px 11px",
                            }}
                          >
                            <span className="line-clamp-2 block w-full break-words text-center">
                              {drink.name}
                            </span>
                          </span>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                <div className="relative z-20 -mt-3 space-y-1.5 text-center sm:-mt-5 sm:space-y-1">
                  <span className="inline-flex rounded-full border border-[#F6CCAF] bg-[linear-gradient(180deg,#FFE7D7_0%,#FFD7BF_100%)] px-3.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-[#E8711B] shadow-[0_10px_20px_rgba(102,66,30,0.08)] sm:text-[0.68rem]">
                    Tu match puede ser
                  </span>
                  <h2 className="font-display mx-auto flex min-h-[4.5rem] max-w-[16.5rem] items-center justify-center px-2 text-[1.64rem] font-black leading-[0.92] tracking-[-0.04em] text-[#3A1F15] [text-shadow:0_1px_0_rgba(255,255,255,0.24)] sm:min-h-[5rem] sm:max-w-[20rem] sm:px-0 sm:text-[2.1rem] lg:min-h-[5.2rem] lg:max-w-[24rem] lg:text-[2.35rem]">
                    {activeDrink.name}
                  </h2>
                  <p className="mx-auto min-h-[6.9rem] max-w-[14.75rem] rounded-[1.3rem] border border-[#EFD9CC] bg-[linear-gradient(180deg,rgba(255,250,246,0.92)_0%,rgba(255,244,238,0.84)_100%)] px-4 py-3 text-[0.82rem] font-medium leading-6 text-[#5A3D30] shadow-[0_12px_26px_rgba(102,66,30,0.06)] backdrop-blur-[4px] sm:max-w-[22rem] sm:min-h-[4.9rem] sm:rounded-[1rem] sm:border-0 sm:bg-white/64 sm:px-3 sm:py-2 sm:text-[0.95rem] sm:leading-5 sm:shadow-[0_8px_18px_rgba(102,66,30,0.05)] sm:backdrop-blur-[2px]">
                    Una bebida con personalidad propia para acompañar tu mood.
                  </p>
                </div>

                <div className="relative z-20 mt-3 flex items-center gap-2 sm:mt-2">
                  {INTRO_DRINKS.map((drink, index) => (
                    <button
                      key={drink.id}
                      type="button"
                      onPointerDown={
                        isMobile ? undefined : () => handleDotPointerDown(index)
                      }
                      onClick={isMobile ? () => setDrinkByIndex(index) : () => handleDotClick(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activeIndex
                          ? "w-6 bg-[#FF7A00]"
                          : "w-2.5 bg-[#CBAE98]"
                      }`}
                      aria-label={`Ver ${drink.name}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          </div>

          <div className="relative z-10 mt-7 border-t border-[#EEDFD2] pt-6">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div className="flex flex-col items-center rounded-[1.15rem] bg-white/58 px-4 py-3 shadow-[0_10px_22px_rgba(102,66,30,0.05)] backdrop-blur-[2px] sm:items-start">
                <h3 className="font-display text-[1.75rem] font-black leading-none tracking-[-0.04em] text-[#3E2217]">
                  Cada bebida, una personalidad
                </h3>
                <p className="mt-2 text-[0.9rem] font-medium text-[#5E4638] sm:text-[0.95rem]">
                  Descubre los perfiles que inspiran cada bebida y cómo se
                  conectan con distintos tipos de plan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPersonalities((current) => {
                    const nextValue = !current;

                    if (nextValue) {
                      setActivePersonalityIndex(0);
                      setShowPersonalityDetails(false);
                    }

                    return nextValue;
                  });
                }}
                className="inline-flex items-center justify-center rounded-full border border-[#E6C8B3] bg-[#FFF3E8]/90 px-4 py-2 text-[0.86rem] font-semibold text-[#4A281B] shadow-[0_10px_26px_rgba(102,66,30,0.12)] transition-colors hover:bg-[#FFF7F0] sm:hidden"
              >
                {showPersonalities ? "Ocultar" : "Ver personalidades"}
              </button>
              <div className="invisible inline-flex items-center rounded-full bg-white/78 px-3 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#8E705D] ring-1 ring-[#EBDCCE]">
                Espacios listos para imágenes
              </div>
            </div>

            {isMobile && !showPersonalities ? null : isMobile ? (
              <div className="mt-5 space-y-3">
                <div className="relative">
                  <div className="mx-auto flex w-[282px] justify-center">
                    <PersonalityCard card={activePersonality} />
                  </div>
                  <button
                    type="button"
                    onClick={handlePrevPersonality}
                    className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6C8B3] bg-[#FFF7F0]/95 text-[#4A281B] shadow-[0_12px_28px_rgba(116,75,33,0.14)]"
                    aria-label="Ver personalidad anterior"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPersonality}
                    className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6C8B3] bg-[#FFF7F0]/95 text-[#4A281B] shadow-[0_12px_28px_rgba(116,75,33,0.14)]"
                    aria-label="Ver siguiente personalidad"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleTogglePersonalityDetails()}
                  className="mx-auto inline-flex items-center rounded-full border bg-white/86 px-4 py-2 text-[0.84rem] font-semibold shadow-[0_10px_24px_rgba(102,66,30,0.1)]"
                  style={{
                    color: activePersonality.accent,
                    borderColor: `${activePersonality.accent}28`,
                  }}
                >
                  {showPersonalityDetails
                    ? `Ocultar ${activePersonality.title}`
                    : `Ver más sobre ${activePersonality.title}`}
                </button>
                {showPersonalityDetails ? (
                  <PersonalityDetailPanel card={activePersonality} compact />
                ) : null}
                <p className="text-center text-[0.73rem] font-semibold uppercase tracking-[0.14em] text-[#8E705D]">
                  {activePersonalityIndex + 1} / {INTRO_PERSONALITIES.length}
                </p>
                <div className="flex justify-center gap-2">
                  {INTRO_PERSONALITIES.map((card, index) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setActivePersonalityIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === activePersonalityIndex
                          ? "w-6 bg-[#FF7A00]"
                          : "w-2.5 bg-[#CBAE98]"
                      }`}
                      aria-label={`Ver ${card.title}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4">
                  {INTRO_PERSONALITIES.map((card, index) => (
                    <div
                      key={card.id}
                      className={`rounded-[1.5rem] transition-all ${
                        index === activePersonalityIndex && showPersonalityDetails
                          ? "ring-2 ring-[#F0CFB3]"
                          : ""
                      }`}
                    >
                      <PersonalityCard card={card} />
                      <button
                        type="button"
                        onClick={() => handleTogglePersonalityDetails(index)}
                        className="mt-2 inline-flex items-center rounded-full border bg-white/88 px-3.5 py-2 text-[0.82rem] font-semibold shadow-[0_8px_18px_rgba(102,66,30,0.08)]"
                        style={{
                          color: card.accent,
                          borderColor: `${card.accent}26`,
                        }}
                      >
                        {index === activePersonalityIndex && showPersonalityDetails
                          ? `Ocultar ${card.title}`
                          : `Ver más sobre ${card.title}`}
                      </button>
                    </div>
                  ))}
                </div>
                {showPersonalityDetails ? (
                  <PersonalityDetailPanel card={activePersonality} />
                ) : null}
              </div>
            )}

            <div className="mt-5 flex flex-col items-center gap-3 border-t border-[#EEDFD2] pt-4 text-center text-[#7A6558] lg:flex-row lg:items-center lg:justify-between lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm lg:justify-start">
                {INTRO_FOOTER_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#F4A340]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="font-semibold text-[#4A281B]">Síguenos</span>
                <div className="flex items-center gap-2">
                  {DUNKIN_SOCIAL_LINKS.map((social) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Ir a ${social.label} de Dunkin Colombia`}
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/85 shadow-[0_8px_20px_rgba(102,66,30,0.08)] transition-transform hover:scale-105 lg:h-9 lg:w-9 lg:bg-[#FFF8F1] lg:ring-1 lg:ring-[#E6C8B3] lg:shadow-[0_10px_22px_rgba(102,66,30,0.12)] ${social.accentClass}`}
                      >
                        <Icon className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBackToTop}
          className={`fixed bottom-4 right-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-[#E6C8B3] bg-[#FFF7F0]/95 text-[#4A281B] shadow-[0_14px_34px_rgba(116,75,33,0.18)] transition-all duration-200 hover:scale-105 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12 ${
            showBackToTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </div>
  );
}
