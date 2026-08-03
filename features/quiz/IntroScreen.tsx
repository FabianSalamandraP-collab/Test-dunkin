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
import { Button, useToast } from "@/components/ui";
import {
  getQuizTrackingClientContext,
  postQuizTracking,
} from "@/lib/quiz-tracking-client";
import { isQuizPermissiveMode, isQuizPreviewMode } from "@/lib/quiz-runtime-mode";
import { useQuizStore } from "@/store/quizStore";
import { QuizIconButton } from "./components/QuizIconButton";
import { QuizIconLink } from "./components/QuizIconLink";
import { HowItWorksPanel } from "./components/HowItWorksPanel";
import { SocialLinks } from "./components/SocialLinks";

interface IntroDrink {
  id: string;
  name: string;
  accent: string;
  textColor: string;
  collectionLabel: string;
  teaser: string;
  cup: "cold-brew" | "iced-latte" | "frozen" | "americano";
  imageSrc?: string;
  imageOffsetMobile?: number;
  imageOffsetDesktop?: number;
  imageOffsetDesktopXl?: number;
  imageScaleMobile?: number;
  imageScaleDesktop?: number;
  imageScaleDesktopXl?: number;
  imageActiveScaleMobile?: number;
  imageActiveScaleDesktop?: number;
  imageActiveScaleDesktopXl?: number;
}

const INTRO_DRINKS: IntroDrink[] = [
  {
    id: "cold-brew",
    name: "Ice Té",
    accent: "#5A361F",
    textColor: "#4C2B18",
    collectionLabel: "TEAS & FRÍO",
    teaser: "Ligero, fresco y listo para acompañar cualquier parche.",
    cup: "cold-brew",
    imageSrc: "/assets/quiz-intro/drinks/intro-drink-carousel-cold-brew.webp",
    imageOffsetMobile: 8,
    imageOffsetDesktop: 12,
    imageOffsetDesktopXl: 16,
    imageActiveScaleMobile: 1.08,
    imageActiveScaleDesktop: 1.12,
    imageActiveScaleDesktopXl: 1.14,
  },
  {
    id: "frutibatido",
    name: "Frutibatido",
    accent: "#FF4FBF",
    textColor: "#C83E99",
    collectionLabel: "FROZEN & FRUTALES",
    teaser: "Color, buena vibra y una energía que se comparte fácil.",
    cup: "frozen",
    imageSrc: "/assets/quiz-intro/drinks/intro-drink-carousel-frutibatido.webp",
    imageActiveScaleMobile: 1.08,
    imageActiveScaleDesktop: 1.12,
    imageActiveScaleDesktopXl: 1.14,
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    accent: "#D5A064",
    textColor: "#8A5B36",
    collectionLabel: "CAFÉS & FRÍOS",
    teaser: "Cremosito, versátil y con actitud para prender el plan.",
    cup: "iced-latte",
    imageSrc: "/assets/quiz-intro/drinks/intro-drink-carousel-iced-latte.webp",
    imageOffsetMobile: 6,
    imageOffsetDesktop: 10,
    imageOffsetDesktopXl: 14,
    imageActiveScaleMobile: 1.08,
    imageActiveScaleDesktop: 1.12,
    imageActiveScaleDesktopXl: 1.14,
  },
  {
    id: "refresher-mango-pina",
    name: "Mango Piña Refresher",
    accent: "#FF9A1F",
    textColor: "#7A4D2C",
    collectionLabel: "REFRESHERS DUNKIN'",
    teaser: "Tropical, vibrante y hecho para moods que no se quedan quietos.",
    cup: "americano",
    imageSrc:
      "/assets/quiz-intro/drinks/intro-drink-carousel-mango-pina-refresher.webp",
    imageActiveScaleMobile: 1.08,
    imageActiveScaleDesktop: 1.12,
    imageActiveScaleDesktopXl: 1.14,
  },
  {
    id: "matcha-latte",
    name: "Soda Dunkin' Manzana Verde",
    accent: "#9BAF6B",
    textColor: "#6E7E46",
    collectionLabel: "SODAS DUNKIN'",
    teaser: "Refrescante, chispeante y perfecta para caer diferente.",
    cup: "americano",
    imageSrc:
      "/assets/quiz-intro/drinks/intro-drink-carousel-soda-dunkin-manzana-verde.webp",
    imageScaleMobile: 0.88,
    imageScaleDesktop: 0.84,
    imageScaleDesktopXl: 0.84,
    imageActiveScaleMobile: 1.08,
  },
];

const HOW_IT_WORKS_STEPS = [
  "Responde 4 preguntas rápidas sobre tu forma de ser, tu mood y cómo te mueves con tu parche.",
  "Descubre la bebida Dunkin' que mejor acompaña tu energía y tu manera de caer.",
  "Conoce tu personalidad Dunkin' y por qué ese match sí va contigo.",
  "Explora opciones oficiales para seguir ese mood o compartir el plan con tu parche.",
];

const HOW_IT_WORKS_INFO = [
  "Las recomendaciones mostradas provienen del sitio oficial de Dunkin' Colombia y corresponden a información publicada por la marca.",
  "Este test busca ayudarte a descubrir la bebida que mejor conecta con tu mood, tu forma de ser y esos planes que se disfrutan más cuando llegas con tu parche.",
  "Los productos, promociones, precios, disponibilidad y condiciones pueden cambiar sin previo aviso y son responsabilidad de Dunkin' Colombia.",
];

const INTRO_FOOTER_ITEMS = [
  "Test oficial de Dunkin' Colombia",
  "Hecho por DisTintos 2026",
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
  const isDesktop = viewportWidth >= 1024;

  const activeState = isMobile
    ? { x: 0, y: -12, scale: 1.27 }
    : isTablet
      ? { x: 0, y: 0, scale: 1.18 }
      : { x: 0, y: -20, scale: 1.38 };

  const nearOffset = isMobile ? 108 : isTablet ? 146 : 198;
  const nearState = isMobile
    ? { y: 14, scale: 0.72 }
    : isTablet
      ? { y: 18, scale: 0.72 }
      : { y: 26, scale: 0.66 };

  const farOffset = isMobile ? 0 : isTablet ? 224 : 292;
  const farState = isTablet
    ? { y: 54, scale: 0.5, opacity: 0.74 }
    : { y: 66, scale: 0.43, opacity: 0.6 };

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

  if (isDesktop) {
    return {
      slot: "hidden" as const,
      x: 0,
      y: 40,
      scale: 0.6,
      opacity: 0,
      zIndex: 0,
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
            DUNKIN'
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
            DUNKIN'
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
      <div className="h-54 relative w-32 overflow-hidden rounded-b-[2.2rem] rounded-t-[1.1rem] border border-[#E3D7CC] bg-gradient-to-b from-[#FFFFFF] via-[#F4EEE8] to-[#ECE4DD] shadow-[0_22px_45px_rgba(80,47,19,0.12)]">
        <div className="absolute inset-x-5 top-4 h-3 rounded-full bg-[#3B1C14]" />
        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 rotate-[8deg] text-xs font-black tracking-[0.18em] text-[#FF7A00]">
          DUNKIN'
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
  const activeScale =
    viewportWidth < 640
      ? drink.imageActiveScaleMobile || 1
      : viewportWidth >= 1280
        ? drink.imageActiveScaleDesktopXl || drink.imageActiveScaleDesktop || 1
        : viewportWidth >= 1024
          ? drink.imageActiveScaleDesktop || 1
          : 1;
  const finalImageScale = isActive ? imageScale * activeScale : imageScale;

  if (drink.imageSrc && !imageHidden) {
    return (
      <div
        className="flex w-full justify-center"
        style={{
          transform: `translateX(${imageOffset}px) scale(${finalImageScale})`,
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

export function IntroScreen() {
  const { addToast } = useToast();
  const { startQuiz, questions } = useQuizStore();
  const isPreviewMode = isQuizPreviewMode();
  const isPermissiveMode = isQuizPermissiveMode();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLogoFallback, setShowLogoFallback] = useState(false);
  const [showHeadlineFallback, setShowHeadlineFallback] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isStartingQuiz, setIsStartingQuiz] = useState(false);
  const activeDrink = INTRO_DRINKS[activeIndex];
  const lastPointerDownAtRef = useRef<number>(0);
  const [bumpKey, setBumpKey] = useState(0);
  const desktopTeaserRef = useRef<HTMLParagraphElement | null>(null);
  const [shouldShowDesktopTeaserToggle, setShouldShowDesktopTeaserToggle] =
    useState(false);
  const [isDesktopTeaserExpanded, setIsDesktopTeaserExpanded] = useState(false);
  const isMobile = viewportWidth < 640;
  const isDesktop = viewportWidth >= 1024;

  useEffect(() => {
    setBumpKey((current) => current + 1);
    setIsDesktopTeaserExpanded(false);
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

  useEffect(() => {
    if (!isDesktop) {
      setShouldShowDesktopTeaserToggle(false);
      return;
    }

    const measureTeaserOverflow = () => {
      const textElement = desktopTeaserRef.current;

      if (!textElement) {
        setShouldShowDesktopTeaserToggle(false);
        return;
      }

      const computedStyles = window.getComputedStyle(textElement);
      const lineHeight = Number.parseFloat(computedStyles.lineHeight);

      if (!Number.isFinite(lineHeight)) {
        setShouldShowDesktopTeaserToggle(activeDrink.teaser.trim().length > 60);
        return;
      }

      const collapsedHeight = lineHeight * 2;
      setShouldShowDesktopTeaserToggle(
        textElement.scrollHeight > collapsedHeight + 2
      );
    };

    const frame = window.requestAnimationFrame(measureTeaserOverflow);
    window.addEventListener("resize", measureTeaserOverflow);

    void document.fonts?.ready.then(() => {
      measureTeaserOverflow();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measureTeaserOverflow);
    };
  }, [activeDrink.teaser, isDesktop]);

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

  const shouldIgnoreClick = () =>
    Date.now() - lastPointerDownAtRef.current < 450;

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

  const handleStartQuiz = async () => {
    if (isStartingQuiz) return;

    setIsStartingQuiz(true);

    try {
      const trackingContext = getQuizTrackingClientContext();
      const response = await postQuizTracking<{
        sessionId?: string;
        startedAt?: string;
      }>(
        "/api/quiz/session/start",
        {
          ...trackingContext,
        },
        { silent: true }
      );

      if (!response?.sessionId) {
        if (isPermissiveMode) {
          addToast({
            type: "info",
            message:
              isPreviewMode
                ? "Deploy de prueba activo. El test continuará sin guardar datos reales."
                : "Tracking no disponible en local. El test continuará en modo visual.",
          });

          startQuiz({
            sessionId: null,
            sessionStartedAt: new Date().toISOString(),
          });
          return;
        }

        addToast({
          type: "error",
          message:
            "No pudimos iniciar el test de forma segura. Recarga la página e inténtalo de nuevo.",
        });
        return;
      }

      startQuiz({
        sessionId: response.sessionId,
        sessionStartedAt: response.startedAt ?? new Date().toISOString(),
      });
    } finally {
      setIsStartingQuiz(false);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[linear-gradient(180deg,#f8f1ea_0%,#f6ede6_100%)] px-2 py-2 [-webkit-overflow-scrolling:touch] sm:px-4 sm:py-4 lg:min-h-screen lg:h-auto lg:overflow-visible">
      <div className="relative mx-auto overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#fbf6f0_0%,#f6efe6_100%)] shadow-[0_30px_80px_rgba(89,53,17,0.12)] lg:max-w-[1460px] lg:rounded-[2.55rem]">
        <div className="pointer-events-none absolute left-[26px] top-0 hidden h-[64px] w-[86px] rounded-br-[2rem] bg-[#E90471] shadow-[inset_-6px_-6px_14px_rgba(255,255,255,0.12)] sm:left-[34px] sm:h-[72px] sm:w-[96px] md:left-[42px] md:h-[80px] md:w-[104px] lg:hidden" />
        <div className="pointer-events-none absolute right-[26px] top-0 hidden h-[64px] w-[86px] rounded-bl-[2rem] bg-[#FA192A] shadow-[inset_6px_-6px_14px_rgba(255,255,255,0.12)] sm:right-[34px] sm:h-[72px] sm:w-[96px] md:right-[42px] md:h-[80px] md:w-[104px] lg:hidden" />
        <div className="pointer-events-none absolute bottom-0 left-[26px] hidden h-[64px] w-[86px] rounded-tr-[2rem] bg-[#FA192A] shadow-[inset_-6px_6px_14px_rgba(255,255,255,0.12)] sm:left-[34px] sm:h-[72px] sm:w-[96px] md:left-[42px] md:h-[80px] md:w-[104px] lg:hidden" />
        <div className="pointer-events-none absolute bottom-0 right-[26px] hidden h-[64px] w-[86px] rounded-tl-[2rem] bg-[#FA192A] shadow-[inset_6px_6px_14px_rgba(255,255,255,0.12)] sm:right-[34px] sm:h-[72px] sm:w-[96px] md:right-[42px] md:h-[80px] md:w-[104px] lg:hidden" />
        <div className="relative z-10 mx-0 rounded-[2.05rem] border border-transparent bg-[linear-gradient(180deg,rgba(255,248,241,0.96)_0%,rgba(247,236,226,0.95)_100%)] px-4 py-5 shadow-[0_18px_42px_rgba(89,53,17,0.08)] sm:mx-[34px] sm:px-6 sm:py-6 md:mx-[42px] md:px-7 md:py-6 lg:mx-0 lg:my-0 lg:rounded-[2.35rem] lg:border lg:border-[#f0ded0] lg:bg-[linear-gradient(180deg,#fbf6f0_0%,#f7efe5_100%)] lg:px-8 lg:py-7 lg:shadow-[0_18px_42px_rgba(89,53,17,0.08)] xl:mx-0">
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2.05rem] bg-no-repeat lg:rounded-[2.35rem] ${
              isMobile ? "opacity-[0.6]" : "opacity-90"
            }`}
            style={{
              backgroundImage: isMobile
                ? "url('/assets/quiz-intro/backgrounds/mobile/hero-stage-background.webp')"
                : "url('/assets/quiz-intro/backgrounds/desktop/hero-stage-background.jpg')",
              backgroundPosition: isMobile ? "50% 50%" : "50% 34%",
              backgroundSize: isMobile ? "cover" : "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2.05rem] lg:rounded-[2.35rem] ${
              isMobile
                ? "bg-[linear-gradient(180deg,rgba(251,246,240,0.22)_0%,rgba(251,246,240,0.12)_14%,rgba(251,246,240,0.03)_34%,rgba(251,246,240,0.06)_56%,rgba(251,246,240,0.22)_78%,rgba(251,246,240,0.52)_100%)]"
                : "bg-[linear-gradient(90deg,rgba(251,246,240,0.88)_0%,rgba(251,246,240,0.72)_30%,rgba(251,246,240,0.2)_52%,rgba(251,246,240,0.04)_74%)]"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2.05rem] lg:rounded-[2.35rem] ${
              isMobile
                ? "bg-[radial-gradient(circle_at_50%_10%,rgba(255,247,239,0.1)_0%,rgba(255,247,239,0.05)_18%,rgba(255,247,239,0)_42%),radial-gradient(circle_at_50%_84%,rgba(255,247,239,0.08)_0%,rgba(255,247,239,0.04)_18%,rgba(255,247,239,0)_42%)] opacity-85"
                : "bg-[radial-gradient(circle_at_12%_24%,rgba(251,246,240,0.72)_0%,rgba(251,246,240,0.44)_32%,rgba(251,246,240,0)_60%)] opacity-90"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2.05rem] lg:rounded-[2.35rem] ${
              isMobile
                ? "opacity-16 bg-[radial-gradient(circle_at_50%_30%,rgba(255,138,0,0.06)_0%,rgba(247,84,166,0.04)_18%,rgba(255,138,0,0.02)_32%,rgba(255,255,255,0)_48%),radial-gradient(circle_at_50%_64%,rgba(255,173,102,0.04)_0%,rgba(247,84,166,0.02)_20%,rgba(255,255,255,0)_44%)]"
                : "opacity-56 bg-[radial-gradient(circle_at_64%_20%,rgba(255,138,0,0.16)_0%,rgba(247,84,166,0.12)_22%,rgba(255,138,0,0.08)_38%,rgba(255,255,255,0)_58%)]"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-0 rounded-[2.05rem] lg:rounded-[2.35rem] ${
              isMobile
                ? "bg-[radial-gradient(circle,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_78%,rgba(255,255,255,0.06)_100%)]"
                : "bg-[radial-gradient(circle,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_62%,rgba(255,255,255,0.18)_100%)]"
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-[2%] rounded-[1.95rem] lg:rounded-[2.25rem] ${
              isMobile
                ? "opacity-0"
                : "bg-[radial-gradient(circle_at_62%_24%,rgba(255,255,255,0)_0_40px,rgba(255,255,255,0.28)_41px_42px,rgba(255,255,255,0)_43px),radial-gradient(circle_at_62%_24%,rgba(255,255,255,0)_0_56px,rgba(255,255,255,0.22)_57px_58px,rgba(255,255,255,0)_59px)] opacity-60 mix-blend-screen"
            }`}
          />
          <div
            className={`pointer-events-none absolute rounded-[999px] blur-3xl ${
              isMobile
                ? "inset-x-[10%] top-[8%] h-[62%] bg-[radial-gradient(circle_at_50%_36%,rgba(255,236,219,0.1)_0%,rgba(255,236,219,0.04)_38%,rgba(255,236,219,0)_76%)]"
                : "inset-x-[37%] top-[8%] h-[48%] bg-[radial-gradient(circle_at_50%_30%,rgba(255,236,219,0.28)_0%,rgba(255,236,219,0.12)_40%,rgba(255,236,219,0)_74%)]"
            }`}
          />
          <div className="pointer-events-none absolute left-0 top-[15%] hidden h-[72%] w-[120px] bg-[radial-gradient(circle_at_left,rgba(242,111,108,0.12)_0%,rgba(255,255,255,0)_72%)] lg:block" />
          <div className="pointer-events-none absolute right-0 top-[15%] hidden h-[72%] w-[120px] bg-[radial-gradient(circle_at_right,rgba(242,111,108,0.12)_0%,rgba(255,255,255,0)_72%)] lg:block" />

          <div className="relative">
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-[1.6rem] sm:flex-row sm:justify-between sm:gap-4 sm:px-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="relative mx-auto grid w-[14.5rem] grid-cols-[6.35rem_auto_6.95rem] items-center text-[2rem] font-black tracking-[-0.04em] text-[#FF7A00] sm:mx-0 sm:flex sm:w-auto sm:items-center sm:gap-4 lg:col-start-2 lg:w-full lg:max-w-[410px] lg:justify-self-center lg:justify-center"
              >
                <div className="flex h-[5.45rem] items-center justify-center pr-2 sm:h-[4.5rem] sm:pr-0 lg:h-[4.5rem]">
                  {!showLogoFallback ? (
                    <img
                      src="/assets/quiz-intro/logo/dunkin-logo.webp"
                      alt="Dunkin'"
                      className="max-w-full h-full shrink-0 object-contain lg:h-[82%]"
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
                  className="h-10 w-[2px] shrink-0 justify-self-center rounded-full bg-[#D7B29A] shadow-[0_6px_14px_rgba(102,66,30,0.12)] sm:h-7 sm:w-px sm:bg-[#E8CDB9] sm:shadow-none lg:h-8"
                />
                <div className="flex h-[5.45rem] items-center justify-center pl-2 sm:h-[4.5rem] sm:pl-0 lg:h-[4.5rem]">
                  <img
                    src="/assets/quiz-intro/logo/YES_ALL_DAY.webp"
                    alt="Yes All Day"
                    className="max-w-full relative top-[1px] h-full shrink-0 object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </motion.div>

              <Button
                variant="quizPill"
                size="quizPill"
                onClick={() => setShowHowItWorks((current) => !current)}
                aria-expanded={showHowItWorks}
                aria-controls="how-it-works-panel"
                className="lg:bg-white/68 items-center gap-2 font-display text-[0.84rem] font-extrabold uppercase tracking-[-0.03em] lg:col-start-3 lg:-mt-8 lg:justify-self-end lg:border-0 lg:shadow-[0_10px_24px_rgba(89,53,17,0.08)]"
              >
                <CircleHelp className="h-4 w-4 text-[#C9833A]" />
                <span className="hidden sm:inline">
                  ¿Cómo funciona el test?
                </span>
                <span className="sm:hidden">Ayuda</span>
              </Button>
            </div>

            <HowItWorksPanel
              open={showHowItWorks}
              steps={HOW_IT_WORKS_STEPS}
              info={HOW_IT_WORKS_INFO}
            />

            <div className="relative z-10 mt-4 grid grid-cols-1 gap-3 px-[1.35rem] sm:mt-5 sm:gap-5 sm:px-0 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-7">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="order-1 mx-auto flex w-full max-w-[420px] flex-col items-center space-y-2 text-center lg:order-1 lg:mx-0 lg:block lg:max-w-[440px] lg:space-y-4 lg:pl-4 lg:pt-3 lg:text-left"
              >
                <div className="space-y-2.5">
                  <div className="space-y-2 lg:hidden">
                    <div className="pt-1">
                      <div
                        className={`mx-auto flex w-full max-w-[248px] items-center justify-center overflow-visible ${
                          showHeadlineFallback ? "hidden" : ""
                        }`}
                      >
                        <img
                          src="/assets/quiz-intro/headlines/dime-que-tomas.webp"
                          alt="Dime qué tomas y te diré quién eres"
                          className="h-auto w-full select-none object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            setShowHeadlineFallback(true);
                          }}
                        />
                      </div>
                      {showHeadlineFallback ? (
                        <h1 className="font-display text-[1.26rem] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] text-[#442214]">
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
                      className={`flex w-full max-w-[480px] items-center justify-center overflow-visible ${
                        showHeadlineFallback ? "hidden" : ""
                      }`}
                    >
                      <img
                        src="/assets/quiz-intro/headlines/dime-que-tomas.webp"
                        alt="Dime qué tomas y te diré quién eres"
                        className="h-auto w-full select-none object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          setShowHeadlineFallback(true);
                        }}
                      />
                    </div>
                    {showHeadlineFallback ? (
                      <h1 className="max-w-[520px] font-display text-[2.05rem] font-extrabold uppercase leading-[0.9] tracking-[-0.06em] text-[#442214] sm:text-[2.95rem] lg:text-[3.6rem]">
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
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.12 }}
                      className="hidden items-center gap-2.5 text-center lg:-mt-7 lg:flex lg:flex-col"
                    >
                      <div className="relative">
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,rgba(255,103,31,0.28)_0%,rgba(255,103,31,0.14)_42%,rgba(255,103,31,0)_76%)] blur-xl"
                          animate={{
                            opacity: [0.58, 0.82, 0.58],
                            scale: [1, 1.04, 1],
                          }}
                          transition={{
                            duration: 3.2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                        <Button
                          size="lg"
                          onClick={handleStartQuiz}
                          disabled={isStartingQuiz}
                          className="ring-white/35 group relative mx-auto w-full max-w-[20.5rem] overflow-hidden border border-[#BE2F62] bg-[#CF3F73] px-9 py-4 text-[#FFF8F3] shadow-[0_12px_26px_rgba(207,63,115,0.22)] ring-1 [border-radius:999px] hover:border-[#CF3F73] hover:bg-[#FFF8F1] hover:text-[#CF3F73] hover:shadow-[0_12px_24px_rgba(207,63,115,0.16)] active:border-[#CF3F73] active:bg-[#FFF8F1] active:text-[#CF3F73] active:shadow-[0_12px_24px_rgba(207,63,115,0.16)] disabled:opacity-70"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2.5 font-display font-extrabold uppercase tracking-[-0.04em]">
                            <span className="text-[1.16rem]">
                              Haz el test
                            </span>
                            <span className="bg-white/18 group-hover:bg-[#CF3F73]/12 group-active:bg-[#CF3F73]/12 flex h-9 w-9 items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-300 group-hover:translate-x-0.5 group-active:translate-x-0.5">
                              <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                          </span>
                        </Button>
                      </div>
                      <div className="bg-white/88 inline-flex items-center rounded-full border border-[#F2DFC9] px-3.5 py-1.5 font-sans text-[0.72rem] font-medium text-[#7A5134] shadow-[0_10px_22px_rgba(102,66,30,0.08)]">
                        <span>4 preguntas • 1 minuto</span>
                      </div>
                      <p className="max-w-[430px] rounded-[1.18rem] border border-[#E8D1BE] bg-[linear-gradient(180deg,rgba(255,249,244,0.95)_0%,rgba(250,241,233,0.93)_100%)] px-4 py-3 font-sans text-[0.98rem] font-semibold leading-7 text-[#3C2418] shadow-[0_16px_32px_rgba(102,66,30,0.12)] backdrop-blur-[6px]">
                        Responde 4 preguntas y descubre la bebida Dunkin' que
                        va con tu mood, tu forma de ser y la energía con la que
                        llegas a tu parche.
                      </p>
                    </motion.div>
                  </div>

                  <div className="flex flex-col items-center space-y-1.5 -mt-7 pt-0 sm:-mt-4 lg:mt-0 lg:items-start">
                    <Button
                      size="lg"
                      onClick={handleStartQuiz}
                      disabled={isStartingQuiz}
                      className="ring-white/30 group relative w-full max-w-[18.2rem] overflow-hidden border border-[#BE2F62] bg-[#CF3F73] px-7 py-3.5 text-[#FFF8F3] shadow-[0_12px_24px_rgba(207,63,115,0.2)] ring-1 [border-radius:999px] hover:border-[#CF3F73] hover:bg-[#FFF8F1] hover:text-[#CF3F73] hover:shadow-[0_12px_24px_rgba(207,63,115,0.14)] active:border-[#CF3F73] active:bg-[#FFF8F1] active:text-[#CF3F73] active:shadow-[0_12px_24px_rgba(207,63,115,0.14)] sm:w-auto sm:min-w-[272px] sm:px-11 sm:py-5 lg:hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2 font-display font-extrabold uppercase tracking-[-0.04em]">
                        <span className="text-[1rem] sm:text-[1.12rem] lg:hidden">
                          Descubre tu match
                        </span>
                        <span className="hidden text-[1.12rem] sm:text-[1.16rem] lg:inline">
                          Descubre tu match Dunkin'
                        </span>
                        <span className="h-8.5 w-8.5 bg-white/18 group-hover:bg-[#CF3F73]/12 group-active:bg-[#CF3F73]/12 flex items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-transform duration-300 group-hover:translate-x-0.5 group-active:translate-x-0.5">
                          <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </Button>
                    <div className="bg-white/86 inline-flex items-center rounded-full border border-[#F2DFC9] px-3.5 py-1.5 font-sans text-[0.7rem] font-medium text-[#3E342F] shadow-[0_10px_22px_rgba(102,66,30,0.08)] lg:hidden">
                      <span className="lg:hidden">4 preguntas • 1 minuto</span>
                      <span className="hidden lg:inline">
                        4 preguntas • 1 minuto
                      </span>
                    </div>
                    <div className="relative w-full max-w-[21.5rem] overflow-hidden rounded-[1.25rem] border border-[#E7D3C4] bg-[linear-gradient(180deg,rgba(255,249,244,0.96)_0%,rgba(249,239,230,0.95)_100%)] px-4 py-3.5 shadow-[0_16px_28px_rgba(102,66,30,0.12)] lg:hidden">
                      <p className="text-center font-sans text-[0.87rem] font-semibold leading-6 text-[#422A1F]">
                        Responde 4 preguntas y descubre la bebida Dunkin' que va con tu
                        mood, tu forma de ser y la energía con la que llegas a tu parche.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className="relative order-2 mx-auto hidden w-full max-w-[368px] lg:order-2 lg:mx-0 lg:block lg:max-w-none lg:-mt-[13.2rem] lg:ml-[6.25rem] xl:-mt-[14.55rem] xl:ml-[7.25rem] 2xl:ml-[7.75rem]"
              >
                <div className="relative mx-auto flex min-h-[330px] w-full max-w-[1180px] flex-col items-center justify-start overflow-visible rounded-[1.75rem] px-[1.25rem] pb-2 pt-2 sm:min-h-[620px] sm:rounded-[2rem] sm:px-4 sm:pb-2 sm:pt-2 lg:min-h-[740px]">
                  <div className="pointer-events-none absolute left-[18%] top-[14%] h-3.5 w-3.5 rounded-full bg-[#F2A400] sm:top-[22%]" />
                  <div className="pointer-events-none absolute right-[16%] top-[12%] h-3.5 w-3.5 rounded-full bg-[#F2A400] sm:top-[20%]" />
                  <div className="pointer-events-none absolute right-[14%] top-[34%] h-2.5 w-2.5 rounded-full bg-[#F34AA7] sm:top-[38%]" />
                  <div className="pointer-events-none absolute bottom-[16%] left-[20%] h-3 w-3 rounded-full bg-[#F34AA7]" />
                  <div className="pointer-events-none absolute bottom-[18%] right-[18%] h-3 w-3 rounded-full bg-[#F2A400]" />
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
                  <QuizIconButton
                    onPointerDown={isMobile ? undefined : handlePrevPointerDown}
                    onClick={isMobile ? goPrev : handlePrevClick}
                    tone="cream"
                    size="md"
                    className="absolute left-3 top-[14%] z-[80] -translate-y-1/2 sm:left-5 sm:top-[42%] lg:left-4 lg:h-12 lg:w-12 xl:left-0"
                    aria-label="Ver bebida anterior"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </QuizIconButton>

                  <QuizIconButton
                    onPointerDown={isMobile ? undefined : handleNextPointerDown}
                    onClick={isMobile ? goNext : handleNextClick}
                    tone="cream"
                    size="md"
                    className="absolute right-3 top-[14%] z-[80] -translate-y-1/2 sm:right-5 sm:top-[42%] lg:right-4 lg:h-12 lg:w-12 xl:right-0"
                    aria-label="Ver siguiente bebida"
                  >
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </QuizIconButton>

                  <div className="relative -mt-3 flex h-[292px] w-full items-end justify-center overflow-visible sm:-mt-4 sm:h-[560px] lg:-mt-6 lg:h-[730px]">
                    {INTRO_DRINKS.map((drink, index) => {
                      const state = getCarouselState(
                        index,
                        activeIndex,
                        INTRO_DRINKS.length,
                        viewportWidth
                      );
                      const isActive = state.slot === "active";
                      const shouldFloatActive =
                        isActive &&
                        viewportWidth >= 640 &&
                        viewportWidth < 1024;

                      return (
                        <div
                          key={drink.id}
                          className="pointer-events-none absolute inset-x-0 bottom-[5.9rem] flex justify-center sm:bottom-10 lg:bottom-12"
                          style={{ zIndex: state.zIndex }}
                        >
                          <motion.div
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
                            className="flex w-[136px] flex-col items-center sm:w-[260px] lg:w-[336px] xl:w-[360px]"
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
                              className={`mt-1 items-center justify-center overflow-hidden border text-center font-display font-extrabold uppercase leading-[0.96] tracking-[0.06em] shadow-[0_8px_18px_rgba(102,66,30,0.06)] backdrop-blur-[6px] sm:mt-2 sm:inline-flex sm:min-h-[42px] sm:max-w-[156px] sm:px-4 sm:py-1.5 sm:text-[10.8px] lg:min-h-[40px] lg:max-w-[152px] lg:px-4 lg:py-1.5 lg:text-[10.6px] xl:min-h-[42px] xl:max-w-[164px] xl:text-[10.9px] ${
                                isMobile
                                  ? state.slot === "hidden"
                                    ? "hidden"
                                    : isActive
                                      ? "inline-flex min-h-[34px] max-w-[136px] px-3 py-1 text-[8px]"
                                      : "inline-flex min-h-[28px] max-w-[102px] px-2.5 py-0.5 text-[6.8px]"
                                  : "sm:max-w-none inline-flex"
                              } ${
                                isActive ? "opacity-100" : "opacity-[0.96]"
                              } rotate-0 rounded-full`}
                              style={{
                                color: drink.textColor,
                                background: isActive
                                  ? "linear-gradient(180deg, rgba(255,248,239,0.82) 0%, rgba(255,240,228,0.72) 100%)"
                                  : "linear-gradient(180deg, rgba(255,248,239,0.68) 0%, rgba(255,242,233,0.56) 100%)",
                                borderColor: `${drink.textColor}${isActive ? "32" : "1E"}`,
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
                    <span className="inline-flex rounded-full border border-[#F2DFC9] bg-[linear-gradient(180deg,rgba(255,248,239,0.96)_0%,rgba(255,241,230,0.92)_100%)] px-3.5 py-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#E8711B] shadow-[0_10px_20px_rgba(102,66,30,0.06)] sm:text-[0.68rem]">
                      Tu match puede ser
                    </span>
                    <h2 className="mx-auto flex min-h-[4.5rem] max-w-[16.5rem] items-center justify-center px-2 text-center font-display text-[1.64rem] font-extrabold leading-[0.92] tracking-[-0.04em] text-[#3A1F15] [text-shadow:0_1px_0_rgba(255,255,255,0.24)] sm:min-h-[5rem] sm:max-w-[20rem] sm:px-0 sm:text-[2.1rem] lg:min-h-[7.25rem] lg:w-[25rem] lg:max-w-[25rem] lg:text-[2.28rem] xl:min-h-[7.8rem] xl:w-[27rem] xl:max-w-[27rem] xl:text-[2.4rem]">
                      {activeDrink.name}
                    </h2>
                    <div className="relative mx-auto hidden w-full max-w-[26rem] overflow-hidden rounded-[1.35rem] border border-[#E5D3C4] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(250,243,237,0.94)_100%)] px-4 py-4 text-center shadow-[0_16px_30px_rgba(102,66,30,0.1)] backdrop-blur-[3px] lg:block lg:min-h-[10.95rem] lg:max-w-[28.5rem] lg:px-6 lg:py-4">
                      <div className="min-w-0">
                        <div className="flex min-h-[7.45rem] flex-col items-center justify-center space-y-2 px-6">
                          <p
                            className="line-clamp-1 min-h-[1.2rem] w-full text-center font-sans text-[0.82rem] font-bold uppercase tracking-[0.2em]"
                            style={{ color: activeDrink.textColor }}
                          >
                            {activeDrink.collectionLabel}
                          </p>
                          <p
                            ref={desktopTeaserRef}
                            className={`w-full max-w-[20rem] text-center font-sans text-[1rem] font-semibold leading-8 text-[#5F483A] lg:max-w-[22rem] lg:text-[1.06rem] ${
                              isDesktopTeaserExpanded
                                ? "line-clamp-none"
                                : "line-clamp-2 min-h-[4rem]"
                            }`}
                          >
                            {activeDrink.teaser}
                          </p>
                        </div>
                        {shouldShowDesktopTeaserToggle ? (
                          <button
                            type="button"
                            onClick={() =>
                              setIsDesktopTeaserExpanded((current) => !current)
                            }
                            aria-expanded={isDesktopTeaserExpanded}
                            className="absolute right-4 top-4 inline-flex shrink-0 rounded-full bg-[#FF7A00] px-3 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_18px_rgba(255,122,0,0.24)] transition-opacity hover:opacity-90"
                          >
                            {isDesktopTeaserExpanded ? "Ver menos" : "Ver más"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <p className="sm:bg-white/64 mx-auto min-h-[6.9rem] max-w-[14.75rem] rounded-[1.3rem] border border-[#EFD9CC] bg-[linear-gradient(180deg,rgba(255,250,246,0.92)_0%,rgba(255,244,238,0.84)_100%)] px-4 py-3 font-sans text-[0.82rem] font-medium leading-6 text-[#3E342F] shadow-[0_12px_26px_rgba(102,66,30,0.06)] backdrop-blur-[4px] sm:min-h-[4.9rem] sm:max-w-[22rem] sm:rounded-[1rem] sm:border-0 sm:px-3 sm:py-2 sm:text-[0.95rem] sm:leading-5 sm:shadow-[0_8px_18px_rgba(102,66,30,0.05)] sm:backdrop-blur-[2px] lg:hidden">
                      Una bebida con personalidad que va con tu mood.
                    </p>
                  </div>

                  <div className="relative z-20 mt-3 flex items-center gap-2 sm:mt-2">
                    {INTRO_DRINKS.map((drink, index) => (
                      <button
                        key={drink.id}
                        type="button"
                        onPointerDown={
                          isMobile
                            ? undefined
                            : () => handleDotPointerDown(index)
                        }
                        onClick={
                          isMobile
                            ? () => setDrinkByIndex(index)
                            : () => handleDotClick(index)
                        }
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
            <div className="mt-5 flex flex-col items-center gap-3 text-center text-[#7A6558] lg:flex-row lg:items-center lg:justify-between lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm lg:justify-start">
                {INTRO_FOOTER_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#F4A340]" />
                    <span className="font-sans font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <SocialLinks links={DUNKIN_SOCIAL_LINKS} />
            </div>
          </div>
        </div>
        <QuizIconButton
          onClick={handleBackToTop}
          tone="soft"
          size="md"
          className={`fixed bottom-4 right-4 z-[90] transition-all duration-200 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12 ${
            showBackToTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </QuizIconButton>
      </div>
    </div>
  );
}
