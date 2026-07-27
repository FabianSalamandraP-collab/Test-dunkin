"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import html2canvas from "html2canvas";
import JSConfetti from "js-confetti";
import {
  ArrowRight,
  Check,
  Coffee,
  Compass,
  Feather,
  Heart,
  RefreshCw,
  Share2,
  Smile,
  Snowflake,
  Sparkles,
  SunMedium,
  type LucideIcon,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui";
import { resolveDunkinOfficialUrl } from "@/config/dunkin-official-urls";
import {
  getFallbackBenefit,
  type ResolvedCampaignBenefit,
} from "@/lib/campaign-benefits";
import {
  getQuizTrackingClientContext,
  postQuizTracking,
} from "@/lib/quiz-tracking-client";
import { isQuizPermissiveMode } from "@/lib/quiz-runtime-mode";
import { useQuizStore } from "@/store/quizStore";
import { QuizForm } from "./QuizForm";
import { QuizBadge } from "./components/QuizBadge";
import { QuizChip } from "./components/QuizChip";
import { quizTypography, resultTraitMap } from "./quizVisualSystem";

const desktopLifestyleAssetMap: Record<
  string,
  {
    src: string;
    fileName: string;
  }
> = {
  creative: {
    src: "/assets/quiz-results/lifestyle/result-lifestyle-iced-latte.webp",
    fileName: "result-lifestyle-iced-latte.webp",
  },
  balanced: {
    src: "/assets/quiz-results/lifestyle/result-lifestyle-ice-te.webp",
    fileName: "result-lifestyle-ice-te.webp",
  },
  energetic: {
    src: "/assets/quiz-results/lifestyle/result-lifestyle-refresher-mango-pina.webp",
    fileName: "result-lifestyle-refresher-mango-pina.webp",
  },
  passionate: {
    src: "/assets/quiz-results/lifestyle/result-lifestyle-frutibatido.webp",
    fileName: "result-lifestyle-frutibatido.webp",
  },
};

const personalityEmoticonFileMap: Record<string, string> = {
  creative: "emoticon3.webp",
  balanced: "emoticon6.webp",
  energetic: "emoticon4.webp",
  passionate: "emoticon5.webp",
};

const coffeeStampResultIds = new Set(["creative"]);
const coffeeStampSrc = "/assets/quiz-results/stamps/Sello_Cafe.webp";
const generalStampOptions = [
  {
    src: "/assets/quiz-results/stamps/Tu_Match.webp",
    alt: "Sello tu match",
  },
  {
    src: "/assets/quiz-results/stamps/Hecho_para_Ti.webp",
    alt: "Sello hecho para ti",
  },
  {
    src: "/assets/quiz-results/stamps/100DUNKIN.webp",
    alt: "Sello 100 Dunkin'",
  },
] as const;

const resultTraitIconMap: Record<string, LucideIcon> = {
  Curioso: Compass,
  Resolutivo: Check,
  Lanzado: Zap,
  Empático: Heart,
  Tranquilo: Coffee,
  Guía: Compass,
  Explorador: Compass,
  Espontáneo: Smile,
  Líder: Zap,
  Optimista: SunMedium,
  Ligero: Feather,
  Social: Users,
};

function getResultTraitIcon(trait: string) {
  return resultTraitIconMap[trait] ?? Heart;
}

type ShimmerTextProps = {
  children: ReactNode;
  className?: string;
  baseColor: string;
  accentColor: string;
  glowColor: string;
  duration?: number;
  delay?: number;
  reducedMotion?: boolean;
};

function ShimmerText({
  children,
  className,
  baseColor,
  accentColor,
  glowColor,
  duration = 3.4,
  delay = 0,
  reducedMotion = false,
}: ShimmerTextProps) {
  const staticStyle: CSSProperties = reducedMotion
    ? {
        color: baseColor,
        textShadow: `0 0 18px ${glowColor}`,
      }
    : {
        display: "inline-block",
        color: "transparent",
        backgroundImage: `linear-gradient(115deg, ${baseColor} 0%, ${baseColor} 28%, ${glowColor} 42%, ${accentColor} 50%, ${glowColor} 58%, ${baseColor} 72%, ${baseColor} 100%)`,
        backgroundSize: "220% 100%",
        backgroundPosition: "130% 50%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      };

  if (reducedMotion) {
    return (
      <span className={className} style={staticStyle}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      style={staticStyle}
      initial={{ backgroundPosition: "130% 50%" }}
      animate={{ backgroundPosition: ["130% 50%", "-35% 50%"] }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.45,
      }}
    >
      {children}
    </motion.span>
  );
}

const resultFeatureRailMap: Record<
  string,
  Array<{
    title: string;
    caption: string;
    icon: typeof Snowflake;
  }>
> = {
  creative: [
    { title: "Suave y frío", caption: "Listo para arrancar", icon: Snowflake },
    { title: "Cremoso balance", caption: "Versátil como tú", icon: Coffee },
    { title: "Energía ligera", caption: "Movimiento sin drama", icon: Zap },
  ],
  balanced: [
    { title: "Frío con calma", caption: "Cabeza clara", icon: Snowflake },
    { title: "Profundo y limpio", caption: "Carácter sereno", icon: Coffee },
    { title: "Ritmo estable", caption: "Te acompaña fácil", icon: Zap },
  ],
  energetic: [
    {
      title: "Tropical al instante",
      caption: "Se siente fresco",
      icon: Snowflake,
    },
    {
      title: "Explosión frutal",
      caption: "Mucho color y sabor",
      icon: Sparkles,
    },
    { title: "Plan que despega", caption: "Vibra que contagia", icon: Zap },
  ],
  passionate: [
    { title: "Frío y alegre", caption: "Mood buen parche", icon: Snowflake },
    { title: "Dulce con flow", caption: "Ligero y smooth", icon: Heart },
    { title: "Buena energía", caption: "Te sube la vibra", icon: Zap },
  ],
};

export function ResultScreen() {
  const isPermissiveMode = isQuizPermissiveMode();
  const router = useRouter();
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const confettiRef = useRef<JSConfetti | null>(null);
  const mobileBenefitButtonRef = useRef<HTMLButtonElement | null>(null);
  const desktopBenefitButtonRef = useRef<HTMLButtonElement | null>(null);
  const benefitHighlightTimeoutRef = useRef<number | null>(null);
  const mobileRecommendationTextRef = useRef<HTMLParagraphElement | null>(null);
  const mobilePersonalityTextRef = useRef<HTMLParagraphElement | null>(null);
  const shareCaptureCardRef = useRef<HTMLDivElement | null>(null);
  const { result, resetQuiz, formSubmitted, sessionId } = useQuizStore();
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = shouldReduceMotion ?? false;
  const [resultImageHidden, setResultImageHidden] = useState(false);
  const [desktopLifestyleHidden, setDesktopLifestyleHidden] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [benefitIconHidden, setBenefitIconHidden] = useState(false);
  const [dynamicBenefit, setDynamicBenefit] =
    useState<ResolvedCampaignBenefit | null>(null);
  const [isBenefitLoading, setIsBenefitLoading] = useState(true);
  const [isBenefitHighlighted, setIsBenefitHighlighted] = useState(false);
  const [shouldGuideToBenefitCta, setShouldGuideToBenefitCta] = useState(false);
  const [isClaimingBenefit, setIsClaimingBenefit] = useState(false);
  const [isMobileRecommendationExpanded, setIsMobileRecommendationExpanded] =
    useState(false);
  const [
    shouldShowMobileRecommendationToggle,
    setShouldShowMobileRecommendationToggle,
  ] = useState(false);
  const [activeGeneralStampIndex, setActiveGeneralStampIndex] = useState(0);
  const [isDownloadingShareImage, setIsDownloadingShareImage] = useState(false);
  const [shareImageError, setShareImageError] = useState<string | null>(null);
  const [isMobilePersonalityExpanded, setIsMobilePersonalityExpanded] =
    useState(false);
  const [
    shouldShowMobilePersonalityToggle,
    setShouldShowMobilePersonalityToggle,
  ] = useState(false);
  const [benefitActionError, setBenefitActionError] = useState<string | null>(
    null
  );

  if (!result) {
    return null;
  }

  const mobileResultImageTransform = `translate(${result.mobileImageOffsetX || 0}px, ${
    result.mobileImageOffsetY || 0
  }px) scale(${result.mobileImageScale || 1})`;
  const mobileHeroImageTransform = `translate(calc(${result.mobileImageOffsetX || 0}px - 12%), ${
    result.mobileImageOffsetY || 0
  }px) scale(${result.mobileImageScale || 1})`;
  const resultTraits = resultTraitMap[result.id] || [];
  const resultFeatureRail = resultFeatureRailMap[result.id] || [];
  const desktopLifestyleAsset = desktopLifestyleAssetMap[result.id];
  const mobileHeroImageSrc =
    desktopLifestyleAsset && !desktopLifestyleHidden
      ? desktopLifestyleAsset.src
      : result.image;
  const personalityEmoticonSrc = `/assets/quiz-results/personalities/${personalityEmoticonFileMap[result.id] ?? "emoticon3.webp"}`;
  const benefitData = dynamicBenefit || getFallbackBenefit(result);
  const officialBenefitUrl = resolveDunkinOfficialUrl(result.id, benefitData.url);
  const resultTitleColor = `${result.color || "#FF671F"}D9`;
  const shimmerBaseColor = result.color || "#FF671F";
  const shimmerAccentColor = result.accentColor || "#FFD9B8";
  const shimmerGlowColor = `${result.accentColor || "#FFD9B8"}CC`;
  const activeGeneralStamp = generalStampOptions[activeGeneralStampIndex];
  const activeStampSrc = coffeeStampResultIds.has(result.id)
    ? coffeeStampSrc
    : activeGeneralStamp.src;
  const activeStampAlt = coffeeStampResultIds.has(result.id)
    ? "Sello cafe 100% colombiano"
    : activeGeneralStamp.alt;
  const benefitHighlightClass =
    formSubmitted && isBenefitHighlighted
      ? `ring-4 ring-[#FFD27A]/55 ring-offset-4 ring-offset-[#FFF7F0] shadow-[0_0_0_1px_rgba(239,106,0,0.08),0_0_0_10px_rgba(255,199,99,0.18),0_18px_36px_rgba(239,106,0,0.24)] ${
          shouldReduceMotion ? "" : "animate-pulse"
        }`
      : "";
  const personalityLabel = result.personalityType || result.title;

  useEffect(() => {
    let isMounted = true;

    const loadBenefit = async () => {
      setIsBenefitLoading(true);

      try {
        const response = await fetch(`/api/benefits?resultId=${result.id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No fue posible consultar la recomendación");
        }

        const payload = (await response.json()) as {
          benefit?: ResolvedCampaignBenefit;
        };

        if (isMounted) {
          setDynamicBenefit(payload.benefit || null);
          setBenefitIconHidden(false);
          setIsBenefitLoading(false);
        }
      } catch {
        if (isMounted) {
          setDynamicBenefit(null);
          setBenefitIconHidden(false);
          setIsBenefitLoading(false);
        }
      }
    };

    void loadBenefit();

    return () => {
      isMounted = false;
    };
  }, [result.id]);

  useEffect(() => {
    setResultImageHidden(false);
    setDesktopLifestyleHidden(false);
    setCopySuccess(false);
    setBenefitIconHidden(false);
    setDynamicBenefit(null);
    setIsBenefitHighlighted(false);
    setShouldGuideToBenefitCta(false);
    setIsClaimingBenefit(false);
    setIsMobileRecommendationExpanded(false);
    setIsMobilePersonalityExpanded(false);
    setShouldShowMobilePersonalityToggle(false);
    setShareImageError(null);
    setBenefitActionError(null);

    if (benefitHighlightTimeoutRef.current) {
      window.clearTimeout(benefitHighlightTimeoutRef.current);
      benefitHighlightTimeoutRef.current = null;
    }
  }, [result.id]);

  useEffect(() => {
    if (coffeeStampResultIds.has(result.id)) {
      return;
    }

    setActiveGeneralStampIndex(
      Math.floor(Math.random() * generalStampOptions.length)
    );
  }, [result.id]);

  useEffect(() => {
    if (isBenefitLoading) {
      setShouldShowMobileRecommendationToggle(false);
      return;
    }

    const measureRecommendationOverflow = () => {
      const textElement = mobileRecommendationTextRef.current;

      if (!textElement) {
        setShouldShowMobileRecommendationToggle(false);
        return;
      }

      const computedStyles = window.getComputedStyle(textElement);
      const lineHeight = Number.parseFloat(computedStyles.lineHeight);

      if (!Number.isFinite(lineHeight)) {
        setShouldShowMobileRecommendationToggle(
          benefitData.description.trim().length > 80
        );
        return;
      }

      const collapsedHeight = lineHeight * 3;
      setShouldShowMobileRecommendationToggle(
        textElement.scrollHeight > collapsedHeight + 2
      );
    };

    const frame = window.requestAnimationFrame(measureRecommendationOverflow);
    window.addEventListener("resize", measureRecommendationOverflow);

    void document.fonts?.ready.then(() => {
      measureRecommendationOverflow();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measureRecommendationOverflow);
    };
  }, [benefitData.description, isBenefitLoading, result.id]);

  useEffect(() => {
    const measurePersonalityOverflow = () => {
      if (window.innerWidth >= 1024) {
        return;
      }

      if (isMobilePersonalityExpanded) {
        return;
      }

      const textElement = mobilePersonalityTextRef.current;

      if (!textElement) {
        return;
      }

      const computedStyles = window.getComputedStyle(textElement);
      const lineHeight = Number.parseFloat(computedStyles.lineHeight);

      if (!Number.isFinite(lineHeight)) {
        setShouldShowMobilePersonalityToggle(result.description.trim().length > 140);
        return;
      }

      const collapsedHeight = lineHeight * 6;
      setShouldShowMobilePersonalityToggle(
        textElement.scrollHeight > collapsedHeight + 2
      );
    };

    const frame = window.requestAnimationFrame(measurePersonalityOverflow);
    window.addEventListener("resize", measurePersonalityOverflow);

    void document.fonts?.ready.then(() => {
      measurePersonalityOverflow();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measurePersonalityOverflow);
    };
  }, [isMobilePersonalityExpanded, result.description, result.id]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [result.id]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (shouldReduceMotion) {
      return;
    }

    const isMobileCelebrationTarget =
      window.innerWidth < 1024 || window.matchMedia("(pointer: coarse)").matches;

    if (isMobileCelebrationTarget) {
      return;
    }

    try {
      confettiRef.current ??= new JSConfetti();

      const timeoutId = window.setTimeout(() => {
        void confettiRef.current?.addConfetti({
          confettiNumber: 90,
          confettiRadius: 5,
          confettiColors: [
            result.color || "#FF671F",
            result.accentColor || "#FFD9B8",
            "#E9539A",
            "#F2B11B",
            "#FFF4EA",
          ],
        });
      }, 0);

      return () => window.clearTimeout(timeoutId);
    } catch {
      // Some mobile browsers choke on the confetti canvas; fail silently.
    }
  }, [result.id, result.color, result.accentColor, shouldReduceMotion]);

  useEffect(() => {
    return () => {
      if (benefitHighlightTimeoutRef.current) {
        window.clearTimeout(benefitHighlightTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!formSubmitted || isBenefitLoading || !shouldGuideToBenefitCta) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const activeBenefitButton =
        window.innerWidth >= 1024
          ? desktopBenefitButtonRef.current
          : mobileBenefitButtonRef.current;

      if (!activeBenefitButton) {
        return;
      }

      const topOffset = window.innerWidth >= 1024 ? 88 : 28;
      const nextTop =
        activeBenefitButton.getBoundingClientRect().top +
        window.scrollY -
        topOffset;

      window.scrollTo({
        top: Math.max(nextTop, 0),
        behavior: "smooth",
      });

      setIsBenefitHighlighted(true);

      if (benefitHighlightTimeoutRef.current) {
        window.clearTimeout(benefitHighlightTimeoutRef.current);
      }

      benefitHighlightTimeoutRef.current = window.setTimeout(() => {
        setIsBenefitHighlighted(false);
        benefitHighlightTimeoutRef.current = null;
      }, 3200);
    });

    setShouldGuideToBenefitCta(false);

    return () => window.cancelAnimationFrame(frame);
  }, [formSubmitted, isBenefitLoading, shouldGuideToBenefitCta]);

  const handleShare = () => {
    const shareText =
      "Ya descubrí qué bebida Dunkin' va con mi mood y mi parche. Haz el test y mira cuál te sale a ti.";

    if (navigator.share) {
      navigator.share({
        title: "Comparte tu match Dunkin'",
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard
        .writeText(`${shareText} ${window.location.href}`)
        .then(() => {
          setCopySuccess(true);
          window.setTimeout(() => setCopySuccess(false), 2200);
        })
        .catch(() => {});
    }
  };

  const handleDownloadShareImage = async () => {
    if (!shareCaptureCardRef.current || isDownloadingShareImage) {
      return;
    }

    setShareImageError(null);
    setIsDownloadingShareImage(true);

    try {
      await document.fonts?.ready;

      const canvas = await html2canvas(shareCaptureCardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imageUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = `dunkin-match-${result.id}.png`;
      downloadLink.click();
    } catch {
      setShareImageError(
        "No pudimos descargar la imagen ahora. Intenta nuevamente."
      );
    } finally {
      setIsDownloadingShareImage(false);
    }
  };

  const handleClaimBenefit = async () => {
    if (benefitHighlightTimeoutRef.current) {
      window.clearTimeout(benefitHighlightTimeoutRef.current);
      benefitHighlightTimeoutRef.current = null;
    }

    setIsBenefitHighlighted(false);
    setBenefitActionError(null);

    if (!formSubmitted) {
      if (formSectionRef.current) {
        const topOffset = window.innerWidth >= 1024 ? 72 : 32;
        const nextTop =
          formSectionRef.current.getBoundingClientRect().top +
          window.scrollY -
          topOffset;

        window.scrollTo({
          top: Math.max(nextTop, 0),
          behavior: "smooth",
        });
      }
      return;
    }

    if (isClaimingBenefit) {
      return;
    }

    if (!sessionId) {
      if (isPermissiveMode) {
        window.location.assign(officialBenefitUrl);
        return;
      }

      setBenefitActionError(
        "No pudimos preparar el registro del clic. Intenta nuevamente."
      );
      return;
    }

    setIsClaimingBenefit(true);

    const trackingContext = getQuizTrackingClientContext();
    const trackingResponse = await postQuizTracking<{
      ready?: boolean;
      tracked?: boolean;
      targetUrl?: string | null;
    }>(
      "/api/quiz/event/view-in-dunkin",
      {
        sessionId,
        targetUrl: officialBenefitUrl,
        clickedAtClient: new Date().toISOString(),
        ...trackingContext,
      },
      { silent: true }
    );

    if (!trackingResponse?.tracked) {
      if (isPermissiveMode) {
        window.location.assign(officialBenefitUrl);
        return;
      }

      setIsClaimingBenefit(false);
      setBenefitActionError(
        "No pudimos registrar el clic en este momento. Vuelve a intentarlo."
      );
      return;
    }

    window.location.assign(trackingResponse.targetUrl || officialBenefitUrl);
  };

  const handleFormSuccess = () => {
    setShouldGuideToBenefitCta(true);
  };

  return (
    <div className="result-desktop-stage h-full overflow-y-auto overflow-x-hidden overscroll-y-contain px-5 py-5 [-webkit-overflow-scrolling:touch] sm:px-6 sm:py-6 lg:min-h-screen lg:h-auto lg:overflow-visible lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,234,0.18)_0%,rgba(247,241,234,0.1)_24%,rgba(247,241,234,0.06)_52%,rgba(247,241,234,0.12)_76%,rgba(247,241,234,0.22)_100%)]" />
      </div>
      <div className="result-desktop-shell relative mx-auto max-w-[1320px] bg-[linear-gradient(180deg,rgba(255,248,241,0.96)_0%,rgba(248,236,226,0.96)_100%)] lg:bg-transparent">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,251,246,0.74)_0%,rgba(255,248,242,0.62)_18%,rgba(255,246,239,0.54)_42%,rgba(255,246,239,0.58)_68%,rgba(255,248,242,0.72)_100%)]" />
        </div>
        <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#FF671F]/10 blur-[90px]" />
        <div
          className="pointer-events-none absolute right-[-5rem] top-[18%] h-80 w-80 rounded-full blur-[120px]"
          style={{
            backgroundColor: `${result.color || "#FF671F"}18`,
          }}
        />
        <div
          className="pointer-events-none absolute bottom-[-5rem] left-[26%] h-80 w-80 rounded-full blur-[120px]"
          style={{
            backgroundColor: `${result.accentColor || "#FFD9B8"}4F`,
          }}
        />

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[1.85rem] border border-[rgba(234,221,207,0.48)] bg-[linear-gradient(180deg,rgba(255,248,241,0.96)_0%,rgba(247,236,226,0.96)_100%)] px-4 py-5 shadow-[0_20px_48px_rgba(89,53,17,0.08)] sm:px-7 sm:py-7 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-90 lg:hidden"
              style={{
                background: `radial-gradient(circle_at_18%_28%, ${
                  result.color || "#FF7A00"
                }16 0%, rgba(255,255,255,0) 62%), radial-gradient(circle_at_84%_78%, ${
                  result.accentColor || "#FFD9B8"
                }32 0%, rgba(255,255,255,0) 58%)`,
              }}
            />
            <div className="bg-white/35 pointer-events-none absolute left-[-2rem] top-[14%] h-24 w-24 rounded-full blur-3xl lg:hidden" />
            <div
              className="pointer-events-none absolute right-[-2.4rem] top-[34%] h-28 w-28 rounded-full blur-3xl lg:hidden"
              style={{ backgroundColor: `${result.color || "#FF671F"}18` }}
            />
            <div
              className="pointer-events-none absolute bottom-[-1.8rem] left-[18%] h-24 w-24 rounded-full blur-3xl lg:hidden"
              style={{
                backgroundColor: `${result.accentColor || "#FFD9B8"}38`,
              }}
            />

            <div className="relative mb-7 lg:hidden">
              <div className="relative overflow-hidden rounded-[1.9rem] border border-[rgba(234,221,207,0.42)] bg-[linear-gradient(180deg,rgba(255,252,248,0.86)_0%,rgba(252,244,236,0.92)_100%)] px-4 py-4 shadow-[0_18px_40px_rgba(89,53,17,0.07)] backdrop-blur-[8px]">
                <QuizBadge
                  className="gap-2 rounded-full px-4 py-2 shadow-[0_10px_24px_rgba(89,53,17,0.06)]"
                  style={{
                    borderColor: `${result.accentColor || "#FFD9B8"}99`,
                    backgroundColor: "rgba(255,248,241,0.92)",
                    color: result.color || "#B86B2C",
                  }}
                >
                  <Heart
                    className="h-3.5 w-3.5"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                  <ShimmerText
                    className={`${quizTypography.matchBadge} font-display tracking-[0.16em]`}
                    baseColor={shimmerBaseColor}
                    accentColor={shimmerAccentColor}
                    glowColor={shimmerGlowColor}
                    duration={3.1}
                    delay={0.18}
                    reducedMotion={reduceMotion}
                  >
                    Tu Match Dunkin'
                  </ShimmerText>
                </QuizBadge>

                <div className="mt-4">
                  <h1
                    className={`${quizTypography.drinkHeroTitle} max-w-[10.6ch] overflow-visible pb-[0.16em] pr-[0.08em] text-balance text-[1.96rem] leading-[1.04]`}
                  >
                    <ShimmerText
                      className="inline-block overflow-visible pb-[0.05em] pr-[0.06em]"
                      baseColor={resultTitleColor}
                      accentColor={shimmerAccentColor}
                      glowColor={`${shimmerBaseColor}40`}
                      duration={4.1}
                      delay={0.3}
                      reducedMotion={reduceMotion}
                    >
                      {result.recommendedDrink}
                    </ShimmerText>
                  </h1>
                </div>

                <p className="mt-2 max-w-[34ch] font-sans text-[0.82rem] font-medium leading-[1.45] text-[#5D5047]">
                  {result.drinkDescription}
                </p>

                <div
                  className="relative mt-3 overflow-hidden rounded-[1.82rem] border border-[rgba(234,221,207,0.46)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(252,244,236,0.98)_100%)] p-1 shadow-[0_20px_42px_rgba(89,53,17,0.1)]"
                  style={{
                    borderColor: `${result.accentColor || "#FFD9B8"}A8`,
                    background:
                      "linear-gradient(180deg, rgba(244,236,229,0.96) 0%, rgba(234,223,213,0.98) 100%)",
                  }}
                >
                  <div className="pointer-events-none absolute left-[0.75rem] top-[1.45rem] text-[#FF7A00] lg:hidden">
                    <div className="mb-1 h-[2px] w-6 rounded-full bg-current" />
                    <div className="mb-1 ml-2 h-[2px] w-3.5 rounded-full bg-current" />
                    <div className="ml-1 h-[2px] w-5 rounded-full bg-current" />
                  </div>
                  <div className="pointer-events-none absolute left-[1.15rem] top-[48%] text-[#EE5F77] lg:hidden">
                    <div className="h-4.5 w-4.5 rounded-full border-2 border-current border-r-transparent border-t-transparent" />
                  </div>
                  <div className="pointer-events-none absolute right-[1.15rem] top-[45%] text-white lg:hidden">
                    <div className="h-5 w-5 rounded-full border-2 border-current border-b-transparent border-l-transparent" />
                  </div>
                  <div
                    className="relative aspect-[4/5] min-h-[26rem] overflow-hidden rounded-[1.42rem]"
                    style={{
                      background:
                        "linear-gradient(180deg, #F3E8DE 0%, #E8D9CC 100%)",
                    }}
                  >
                    {mobileHeroImageSrc && !resultImageHidden ? (
                      <img
                        src={mobileHeroImageSrc}
                        alt={`${result.recommendedDrink} lifestyle`}
                        className="h-full w-full object-contain object-center"
                        style={{
                          transform: mobileHeroImageTransform,
                          transformOrigin: "center center",
                        }}
                        onError={() => {
                          if (mobileHeroImageSrc !== result.image) {
                            setDesktopLifestyleHidden(true);
                            return;
                          }
                          setResultImageHidden(true);
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#FFF6ED_0%,#F5DEC6_100%)]">
                        <Coffee
                          className="h-10 w-10 text-[#B8895D]/70"
                          strokeWidth={1.7}
                        />
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,rgba(17,10,4,0)_0%,rgba(17,10,4,0.12)_100%)]" />
                  </div>

                  <div className="pointer-events-none absolute bottom-1 right-0 flex h-[132px] w-[132px] items-center justify-center sm:h-[146px] sm:w-[146px]">
                    <img
                      src={activeStampSrc}
                      alt={activeStampAlt}
                      className="h-full w-full object-contain drop-shadow-[0_16px_26px_rgba(89,53,17,0.18)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-14 xl:gap-16">
              <div className="min-w-0 order-2 space-y-5 lg:order-1 lg:space-y-8 lg:pt-3 xl:max-w-[560px]">
                <div className="hidden space-y-4 lg:block lg:space-y-5 lg:pl-6 xl:pl-8">
                  <QuizBadge
                    className="gap-2 rounded-full px-4 py-2 shadow-[0_10px_24px_rgba(89,53,17,0.06)] lg:shadow-none"
                    style={{
                      borderColor: `${result.accentColor || "#FFD9B8"}99`,
                      backgroundColor: "rgba(255,248,241,0.9)",
                      color: result.color || "#B86B2C",
                    }}
                  >
                    <Heart
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                    <ShimmerText
                      className={`${quizTypography.matchBadge} font-display tracking-[0.16em]`}
                      baseColor={shimmerBaseColor}
                      accentColor={shimmerAccentColor}
                      glowColor={shimmerGlowColor}
                      duration={3.1}
                      delay={0.18}
                      reducedMotion={reduceMotion}
                    >
                      Tu Match Dunkin'
                    </ShimmerText>
                  </QuizBadge>

                  <h1
                    className={`${quizTypography.drinkHeroTitle} max-w-[11.8ch] overflow-visible pb-[0.16em] pr-[0.08em] leading-[1.04] text-[2.9rem] sm:text-[3.55rem] lg:text-[4.4rem] xl:text-[5.1rem]`}
                  >
                    <ShimmerText
                      className="inline-block overflow-visible pb-[0.05em] pr-[0.06em]"
                      baseColor={resultTitleColor}
                      accentColor={shimmerAccentColor}
                      glowColor={`${shimmerBaseColor}40`}
                      duration={4.1}
                      delay={0.3}
                      reducedMotion={reduceMotion}
                    >
                      {result.recommendedDrink}
                    </ShimmerText>
                  </h1>

                  <p
                    className={`${quizTypography.supporting} max-w-[42ch] text-[1rem] lg:text-[1.06rem]`}
                  >
                    {result.drinkDescription}
                  </p>
                </div>

                <div className="min-w-0 hidden overflow-hidden rounded-[2rem] border border-[#EFD9C8] bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,248,242,0.78)_100%)] px-5 py-5 shadow-[0_18px_40px_rgba(89,53,17,0.06)] backdrop-blur-[10px] sm:px-6 sm:py-6 lg:ml-6 lg:block lg:px-7 xl:ml-8 xl:px-8">
                  <div className="grid gap-5 sm:grid-cols-[82px_minmax(0,1fr)] sm:items-start lg:gap-6">
                    <div className="relative flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-visible">
                      <img
                        src={personalityEmoticonSrc}
                        alt={result.personalityType || result.title}
                        className="pointer-events-none absolute left-1/2 top-1/2 block h-full w-full origin-center -translate-x-1/2 -translate-y-1/2 scale-[1.88] select-none object-contain object-center"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 space-y-4 lg:pr-4">
                      <div className="space-y-2">
                        <p className="font-sans text-[0.82rem] font-medium uppercase tracking-[0.2em] text-[#B0907C]">
                          Tu personalidad
                        </p>
                        <h2
                          className={`${quizTypography.personalityTitle} break-words text-[1.48rem] leading-[0.96] sm:text-[1.6rem]`}
                        >
                          {result.personalityType || result.title}
                        </h2>
                        <p className="max-w-[34ch] font-sans text-[0.98rem] font-medium leading-[1.75] text-[#5A4A40]">
                          {result.description}
                        </p>
                      </div>

                      {resultTraits.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {resultTraits.map((trait, index) => {
                            const TraitIcon = getResultTraitIcon(trait);
                            const isAccentTrait = index === 1;

                            return (
                              <QuizChip
                                key={trait}
                                className="gap-2 rounded-full border-2 px-4 py-2"
                                style={{
                                  borderColor: `${result.color || "#FF671F"}40`,
                                  backgroundColor: isAccentTrait
                                    ? "rgba(242, 119, 154, 0.12)"
                                    : "rgba(255, 249, 243, 0.92)",
                                  color: result.color || "#B86B2C",
                                }}
                              >
                                <span
                                  className="flex h-5 w-5 items-center justify-center rounded-full"
                                  style={{
                                    backgroundColor: isAccentTrait
                                      ? "rgba(242, 119, 154, 0.14)"
                                      : "rgba(255, 255, 255, 0.88)",
                                    color: isAccentTrait
                                      ? "#E9539A"
                                      : result.color || "#FF671F",
                                  }}
                                >
                                  <TraitIcon
                                    className="h-3.5 w-3.5"
                                    strokeWidth={2}
                                  />
                                </span>
                                <span className={quizTypography.chip}>
                                  {trait}
                                </span>
                              </QuizChip>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="lg:hidden">
                <div className="overflow-hidden rounded-[1.65rem] border border-[#EFD9C8] bg-[linear-gradient(180deg,rgba(255,248,241,0.94)_0%,rgba(247,236,226,0.92)_100%)] px-4 py-4 shadow-[0_16px_34px_rgba(89,53,17,0.06)] backdrop-blur-[10px]">
                    <div className="grid grid-cols-[82px_minmax(0,1fr)] items-start gap-4">
                      <div className="relative flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-visible">
                        <img
                          src={personalityEmoticonSrc}
                          alt={result.personalityType || result.title}
                          className="pointer-events-none absolute left-1/2 top-1/2 block h-full w-full origin-center -translate-x-1/2 -translate-y-1/2 scale-[1.88] select-none object-contain object-center"
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0 space-y-3">
                        <div className="space-y-2">
                          <p className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[#B0907C]">
                            Tu personalidad
                          </p>
                          <h2
                            className={`${quizTypography.personalityTitle} break-words text-[1.34rem] leading-[0.96]`}
                          >
                            {result.personalityType || result.title}
                          </h2>
                          <p
                            ref={mobilePersonalityTextRef}
                            className={`font-sans text-[0.94rem] font-medium leading-7 text-[#5A4A40] ${
                              isMobilePersonalityExpanded
                                ? "line-clamp-none"
                                : "line-clamp-6"
                            }`}
                          >
                            {result.description}
                          </p>
                          {shouldShowMobilePersonalityToggle ? (
                            <button
                              type="button"
                              onClick={() =>
                                setIsMobilePersonalityExpanded((current) => !current)
                              }
                              className="w-fit font-sans text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#EF6A00] transition-opacity hover:opacity-80"
                            >
                              {isMobilePersonalityExpanded ? "Ver menos" : "Ver más"}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {resultTraits.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {resultTraits.map((trait) => {
                          const TraitIcon = getResultTraitIcon(trait);

                          return (
                            <QuizChip
                              key={trait}
                              className="gap-2 rounded-full border-2 px-4 py-2"
                              style={{
                                borderColor: `${result.color || "#FF671F"}40`,
                                backgroundColor: "rgba(255, 249, 243, 0.92)",
                                color: result.color || "#B86B2C",
                              }}
                            >
                              <span
                                className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90"
                                style={{ color: result.color || "#FF671F" }}
                              >
                                <TraitIcon
                                  className="h-3.5 w-3.5"
                                  strokeWidth={2}
                                />
                              </span>
                              <span className={quizTypography.chip}>{trait}</span>
                            </QuizChip>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="lg:hidden">
                  <div className="relative min-h-[23rem] overflow-hidden rounded-[1.95rem] border border-[rgba(228,210,194,0.72)] bg-[linear-gradient(180deg,rgba(255,248,241,0.96)_0%,rgba(246,235,225,0.95)_100%)] px-4 py-4 shadow-[0_22px_46px_rgba(89,53,17,0.1)] backdrop-blur-[10px]">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-90"
                      style={{
                        background: `radial-gradient(circle at 18% 24%, ${
                          result.accentColor || "#FFD9B8"
                        }3D 0%, rgba(255,255,255,0) 44%), radial-gradient(circle at 84% 82%, ${
                          result.color || "#FF671F"
                        }16 0%, rgba(255,255,255,0) 54%)`,
                      }}
                    />
                    <div className="relative z-10 mb-3 flex items-center justify-between">
                      <span
                        className="inline-flex rounded-full border px-3 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em]"
                        style={{
                          borderColor: `${result.color || "#FF671F"}2F`,
                          backgroundColor: "rgba(255,255,255,0.92)",
                          color: result.color || "#FF671F",
                        }}
                      >
                        Promo oficial
                      </span>
                      <span className="inline-flex rounded-full bg-[#CF3F73] px-3 py-1 font-sans text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white shadow-[0_8px_18px_rgba(207,63,115,0.24)]">
                        Dunkin'
                      </span>
                    </div>
                    <div className="relative flex min-h-[calc(23rem-2rem)] flex-col">
                      <div className="grid grid-cols-[82px_minmax(0,1fr)] items-start gap-4">
                        <div
                          className="flex h-[86px] w-[86px] items-center justify-center overflow-hidden rounded-[1.35rem] border bg-[linear-gradient(180deg,#FFF8F2_0%,#FDEBDD_100%)] shadow-[0_16px_30px_rgba(89,53,17,0.1)]"
                          style={{
                            borderColor: `${result.accentColor || "#FFD9B8"}A6`,
                          }}
                        >
                          {isBenefitLoading ? (
                            <div className="bg-white/70 h-[72%] w-[72%] animate-pulse rounded-full" />
                          ) : !benefitIconHidden && benefitData.imageUrl ? (
                            <img
                              src={benefitData.imageUrl}
                              alt={benefitData.title}
                              className="h-[72%] w-[72%] object-contain"
                              onError={() => setBenefitIconHidden(true)}
                            />
                          ) : (
                            <Coffee
                              className="h-8 w-8 text-[#B8895D]/70"
                              strokeWidth={1.8}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em]"
                            style={{ color: result.color || "#FF671F" }}
                          >
                            Plan para tu mood
                          </p>

                          {isBenefitLoading ? (
                            <div className="animate-pulse space-y-2.5">
                              <div className="bg-white/74 h-6 w-[72%] rounded-full" />
                              <div className="h-4.5 bg-white/64 w-full rounded-full" />
                              <div className="h-4.5 bg-white/58 w-[92%] rounded-full" />
                              <div className="h-4.5 bg-white/52 w-[78%] rounded-full" />
                            </div>
                          ) : (
                            <div
                              className={`mt-2 flex flex-col space-y-2 ${
                                isMobileRecommendationExpanded
                                  ? "min-h-0"
                                  : "min-h-[8.7rem]"
                              }`}
                            >
                              <h3 className="line-clamp-2 min-h-[3.45rem] break-words font-display text-[1.06rem] font-extrabold tracking-[-0.03em] text-[#201711]">
                                {benefitData.title}
                              </h3>
                              <p
                                ref={mobileRecommendationTextRef}
                                className={`font-sans text-[0.96rem] font-medium leading-7 text-[#5D5047] ${
                                  isMobileRecommendationExpanded
                                    ? "line-clamp-none min-h-0"
                                    : "line-clamp-3 min-h-[6.1rem]"
                                }`}
                              >
                                {benefitData.description}
                              </p>
                              {shouldShowMobileRecommendationToggle ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setIsMobileRecommendationExpanded(
                                      (current) => !current
                                    )
                                  }
                                  className="w-fit font-sans text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#EF6A00] transition-opacity hover:opacity-80"
                                >
                                  {isMobileRecommendationExpanded
                                    ? "Ver menos"
                                    : "Ver más"}
                                </button>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>

                      {isBenefitLoading ? (
                        <>
                          <div className="mt-4 flex animate-pulse flex-wrap gap-2">
                            <div className="bg-white/74 h-8 w-[138px] rounded-full" />
                            <div className="bg-white/62 h-8 w-[104px] rounded-full" />
                          </div>
                          <div className="mt-auto pt-5">
                            <div className="bg-[#EF6A00]/18 h-[52px] w-full animate-pulse rounded-full" />
                          </div>
                        </>
                      ) : (
                        <>
                          {benefitData.discountLabel ||
                          benefitData.priceLabel ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {benefitData.discountLabel ? (
                                <span className="rounded-full bg-[#FF671F] px-3 py-1.5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#F8F4F1] shadow-[0_10px_18px_rgba(255,103,31,0.24)]">
                                  {benefitData.discountLabel}
                                </span>
                              ) : null}
                              {benefitData.priceLabel ? (
                                <span className="rounded-full border border-[#DECBBB] bg-white px-3 py-1.5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#4A281B] shadow-[0_8px_16px_rgba(89,53,17,0.06)]">
                                  {benefitData.priceLabel}
                                </span>
                              ) : null}
                            </div>
                          ) : null}

                          <div className="mt-auto pt-5">
                            <Button
                              ref={mobileBenefitButtonRef}
                              variant="quizCta"
                              size="quiz"
                              onClick={handleClaimBenefit}
                              disabled={isBenefitLoading || isClaimingBenefit}
                              className={`w-full justify-between border-[#BE2F62] bg-[#CF3F73] px-6 font-sans text-[0.98rem] text-[#FFF8F3] shadow-[0_14px_26px_rgba(207,63,115,0.24)] hover:border-[#CF3F73] hover:bg-[#B83263] disabled:cursor-wait disabled:opacity-70 ${benefitHighlightClass}`}
                            >
                              <span>
                                {isClaimingBenefit
                                  ? "Abriendo Dunkin..."
                                  : formSubmitted
                                  ? benefitData.cta
                                  : "Ver plan recomendado"}
                              </span>
                              <span className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#CF3F73] shadow-[0_10px_22px_rgba(89,53,17,0.1)]">
                                <ArrowRight
                                  className="h-4.5 w-4.5"
                                  strokeWidth={2.6}
                                />
                              </span>
                            </Button>
                            {benefitActionError ? (
                              <p className="mt-3 font-sans text-[0.78rem] leading-5 text-[#A13B2A]">
                                {benefitActionError}
                              </p>
                            ) : null}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="result-desktop-soft-surface relative hidden min-h-[20rem] overflow-hidden rounded-[1.9rem] border border-[rgba(228,210,194,0.72)] px-4 py-4 shadow-[0_22px_44px_rgba(89,53,17,0.08)] sm:px-5 sm:py-5 lg:ml-6 lg:block lg:rounded-[1.85rem] lg:px-7 lg:py-6 xl:ml-8 xl:px-8"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,251,247,0.86) 0%, rgba(252,244,236,0.94) 100%), radial-gradient(circle at 18% 26%, ${
                      result.accentColor || "#FFD9B8"
                    }24 0%, rgba(255,255,255,0) 48%), radial-gradient(circle at 82% 76%, ${
                      result.color || "#FF671F"
                    }12 0%, rgba(255,255,255,0) 56%)`,
                  }}
                >
                  <div className="relative z-10 mb-4 flex items-center justify-between">
                    <span
                      className="inline-flex rounded-full border px-3 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em]"
                      style={{
                        borderColor: `${result.color || "#FF671F"}2F`,
                        backgroundColor: "rgba(255,255,255,0.92)",
                        color: result.color || "#FF671F",
                      }}
                    >
                      Promo oficial
                    </span>
                    <span className="inline-flex rounded-full bg-[#CF3F73] px-3 py-1 font-sans text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white shadow-[0_8px_18px_rgba(207,63,115,0.24)]">
                      Dunkin'
                    </span>
                  </div>
                  <div className="relative grid min-h-[calc(20rem-3rem)] gap-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-start sm:gap-5 lg:grid-cols-[84px_minmax(0,1fr)] lg:gap-6">
                    <div
                      className="bg-white/90 lg:bg-white/78 flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-[1.55rem] border shadow-[0_18px_36px_rgba(89,53,17,0.1)] lg:h-[92px] lg:w-[92px] lg:border-[rgba(255,255,255,0.45)]"
                      style={{
                        borderColor: `${result.accentColor || "#FFD9B8"}88`,
                      }}
                    >
                      {isBenefitLoading ? (
                        <div className="bg-white/70 h-[70%] w-[70%] animate-pulse rounded-[1rem]" />
                      ) : !benefitIconHidden && benefitData.imageUrl ? (
                        <img
                          src={benefitData.imageUrl}
                          alt={benefitData.title}
                          className="h-full w-full object-cover"
                          onError={() => setBenefitIconHidden(true)}
                        />
                      ) : (
                        <Coffee
                          className="h-8 w-8 text-[#B8895D]/70"
                          strokeWidth={1.8}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex flex-col space-y-3 lg:pr-4">
                      {isBenefitLoading ? (
                        <>
                          <div className="flex animate-pulse flex-wrap items-center gap-2.5">
                            <div className="bg-white/74 h-8 w-[146px] rounded-full" />
                            <div className="bg-white/62 h-8 w-[110px] rounded-full" />
                          </div>
                          <div className="animate-pulse space-y-2.5">
                            <div className="bg-white/72 h-6 w-[76%] rounded-full" />
                            <div className="h-4.5 bg-white/62 w-full rounded-full" />
                            <div className="h-4.5 bg-white/56 w-[88%] rounded-full" />
                            <div className="h-4.5 bg-white/50 w-[68%] rounded-full" />
                          </div>
                          <div className="mt-auto pt-3">
                            <div className="bg-[#EF6A00]/18 h-[48px] w-full animate-pulse rounded-full sm:w-[240px]" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <QuizChip
                              className="border-2"
                              style={{
                                borderColor: `${result.color || "#FF671F"}36`,
                                backgroundColor: "rgba(255,255,255,0.92)",
                                color: result.color || "#B86B2C",
                              }}
                            >
                              <span className={quizTypography.chip}>
                                Plan para tu mood
                              </span>
                            </QuizChip>
                            {benefitData.discountLabel ? (
                              <span className="rounded-full bg-[#FF671F] px-3 py-1.5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#F8F4F1] shadow-[0_10px_18px_rgba(255,103,31,0.24)] sm:text-[0.72rem]">
                                {benefitData.discountLabel}
                              </span>
                            ) : null}
                            {benefitData.priceLabel ? (
                              <span className="rounded-full border border-[#DECBBB] bg-white px-3 py-1.5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#4A281B] shadow-[0_8px_16px_rgba(89,53,17,0.06)] sm:text-[0.72rem]">
                                {benefitData.priceLabel}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex min-h-[8.8rem] flex-col space-y-2">
                            <h3 className="line-clamp-2 min-h-[3.5rem] max-w-[30ch] break-words font-display text-[1.05rem] font-extrabold tracking-[-0.03em] text-[#201711] sm:text-[1.15rem]">
                              {benefitData.title}
                            </h3>
                            <p
                              className={`${quizTypography.supportingCompact} line-clamp-4 min-h-[6.2rem] max-w-[44ch]`}
                            >
                              {benefitData.description}
                            </p>
                          </div>

                          <div className="mt-auto">
                            <Button
                              ref={desktopBenefitButtonRef}
                              variant="quizCta"
                              size="quiz"
                              onClick={handleClaimBenefit}
                              disabled={isBenefitLoading || isClaimingBenefit}
                              className={`w-full justify-center border-[#BE2F62] bg-[#CF3F73] px-4 font-sans text-[0.92rem] text-[#FFF8F3] shadow-[0_14px_26px_rgba(207,63,115,0.22)] hover:border-[#CF3F73] hover:bg-[#B83263] disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[240px] ${benefitHighlightClass}`}
                            >
                              {isClaimingBenefit
                                ? "Abriendo Dunkin..."
                                : formSubmitted
                                  ? benefitData.cta
                                  : "Ver plan recomendado"}
                            </Button>
                            {benefitActionError ? (
                              <p className="mt-3 max-w-[32ch] font-sans text-[0.78rem] leading-5 text-[#A13B2A]">
                                {benefitActionError}
                              </p>
                            ) : null}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mx-auto lg:w-full lg:max-w-[720px] lg:justify-center lg:px-8 lg:pb-5 xl:max-w-[760px] xl:px-10 xl:pb-6">
                  <Button
                    variant="quizCta"
                    size="quiz"
                    onClick={handleShare}
                    className="w-full justify-center px-4 text-[0.92rem] sm:w-auto sm:min-w-[220px] lg:min-w-[236px]"
                  >
                    {copySuccess ? "Enlace copiado" : "Compartir tu match"}
                    {copySuccess ? (
                      <Check className="ml-2 h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <Share2 className="ml-2 h-4 w-4" strokeWidth={2.2} />
                    )}
                  </Button>

                  <Button
                    variant="quizSecondary"
                    size="quiz"
                    onClick={handleDownloadShareImage}
                    disabled={isDownloadingShareImage}
                    className="w-full justify-center px-4 text-[0.92rem] sm:w-auto sm:min-w-[220px] lg:min-w-[236px]"
                  >
                    {isDownloadingShareImage
                      ? "Descargando imagen..."
                      : "Descargar imagen"}
                    <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.2} />
                  </Button>

                  <Button
                    variant="quizSecondary"
                    size="quiz"
                    onClick={() => {
                      resetQuiz();
                      router.push("/quiz");
                    }}
                    className="w-full justify-center px-4 text-[0.92rem] sm:w-auto sm:min-w-[220px] lg:min-w-[236px]"
                  >
                    Repetir test
                    <RefreshCw className="ml-2 h-4 w-4" strokeWidth={2.2} />
                  </Button>
                </div>
                {shareImageError ? (
                  <p className="mx-auto max-w-[34ch] text-center font-sans text-[0.8rem] leading-5 text-[#A13B2A]">
                    {shareImageError}
                  </p>
                ) : null}
              </div>

              <div className="min-w-0 order-1 hidden lg:order-2 lg:-ml-7 lg:block xl:-ml-8">
                <div className="min-w-0 relative mx-auto flex w-full max-w-[640px] flex-col items-center justify-center gap-0 lg:max-w-[700px] lg:pt-7 xl:pt-8">
                  <div className="pointer-events-none absolute left-[0.3rem] top-[9rem] hidden text-[#FF7A00] lg:block">
                    <div className="bg-current mb-1 h-[2px] w-7 rounded-full" />
                    <div className="bg-current mb-1 ml-2 h-[2px] w-4 rounded-full" />
                    <div className="bg-current ml-1 h-[2px] w-6 rounded-full" />
                  </div>

                  <div className="pointer-events-none absolute left-[1.4rem] top-[47%] hidden text-[#EE5F77] lg:block">
                    <div className="border-current border-t-transparent border-r-transparent h-5 w-5 rounded-full border-2" />
                  </div>

                  <div className="text-white pointer-events-none absolute right-[2.6rem] top-[48%] hidden lg:block">
                    <div className="border-current border-l-transparent border-b-transparent h-6 w-6 rounded-full border-2" />
                  </div>

                  <div
                    className="result-desktop-media-panel relative w-full overflow-hidden rounded-[2rem] p-2.5 shadow-[0_22px_48px_rgba(89,53,17,0.12)] sm:rounded-[2.6rem] sm:p-4 lg:rounded-[var(--result-radius-xl)] lg:p-5 lg:shadow-none"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,249,243,0.98) 100%), radial-gradient(circle at 18% 22%, ${
                        result.accentColor || "#FFD9B8"
                      }24 0%, rgba(255,255,255,0) 42%), radial-gradient(circle at 82% 84%, ${
                        result.color || "#FF671F"
                      }12 0%, rgba(255,255,255,0) 48%)`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-x-[18%] top-2 h-10 rounded-full blur-2xl lg:hidden"
                      style={{
                        backgroundColor: `${result.accentColor || "#FFD9B8"}72`,
                      }}
                    />
                    <div
                      className="pointer-events-none absolute bottom-4 left-1/2 h-10 w-[58%] -translate-x-1/2 rounded-full blur-2xl lg:hidden"
                      style={{
                        backgroundColor: `${result.color || "#FF671F"}24`,
                      }}
                    />
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#FFF8F1_0%,#F8E3D2_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] sm:rounded-[2.2rem] lg:rounded-[1.9rem] lg:shadow-none">
                      {!resultImageHidden && result.image ? (
                        <img
                          src={result.image}
                          alt={result.recommendedDrink}
                          className="h-full w-full object-cover lg:hidden"
                          style={{
                            transform: mobileResultImageTransform,
                            transformOrigin: "center center",
                          }}
                          onError={() => setResultImageHidden(true)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#FFF6ED_0%,#F5DEC6_100%)] lg:hidden">
                          <Coffee
                            className="h-16 w-16 text-[#B8895D]/70 sm:h-20 sm:w-20"
                            strokeWidth={1.7}
                          />
                        </div>
                      )}

                      {!desktopLifestyleHidden && desktopLifestyleAsset ? (
                        <img
                          src={desktopLifestyleAsset.src}
                          alt={`${result.recommendedDrink} lifestyle`}
                          className="hidden h-full w-full object-cover lg:block"
                          onError={() => setDesktopLifestyleHidden(true)}
                        />
                      ) : null}

                      {desktopLifestyleAsset && desktopLifestyleHidden ? (
                        <div className="hidden h-full w-full items-center justify-center bg-[linear-gradient(180deg,rgba(255,248,241,0.96)_0%,rgba(248,227,210,0.98)_100%)] px-10 text-center lg:flex">
                          <div className="max-w-[360px] space-y-4">
                            <div className="bg-white/72 mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#F0C9A9] text-[#FF7A00] shadow-[0_14px_28px_rgba(89,53,17,0.08)]">
                              <Sparkles className="h-7 w-7" strokeWidth={1.8} />
                            </div>
                            <div className="space-y-2">
                              <p className="font-sans text-[0.74rem] font-medium uppercase tracking-[0.22em] text-[#C3895A]">
                                Espacio reservado para foto lifestyle desktop
                              </p>
                              <p className="font-display text-[1.1rem] font-extrabold tracking-[-0.04em] text-[#2A1D17]">
                                {desktopLifestyleAsset.fileName}
                              </p>
                              <p className="font-sans text-[0.95rem] font-medium leading-7 text-[#6B5A4E]">
                                Pon la foto en{" "}
                                <span className="font-sans font-medium text-[#B86B2C]">
                                  /public/assets/quiz-results/lifestyle/
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(180deg,rgba(17,10,4,0)_0%,rgba(17,10,4,0.12)_100%)] lg:hidden" />
                    </div>

                    <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[158px] w-[158px] items-center justify-center xl:h-[174px] xl:w-[174px] lg:flex">
                      <img
                        src={activeStampSrc}
                        alt={activeStampAlt}
                        className="h-full w-full object-contain drop-shadow-[0_20px_32px_rgba(89,53,17,0.18)]"
                      />
                    </div>
                  </div>

                  {resultFeatureRail.length > 0 ? (
                    <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1 lg:hidden">
                      {resultFeatureRail.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="border-white/60 min-w-[176px] shrink-0 rounded-[1.35rem] border bg-[linear-gradient(180deg,rgba(255,251,247,0.92)_0%,rgba(252,244,236,0.96)_100%)] px-4 py-3 shadow-[0_14px_30px_rgba(89,53,17,0.08)]"
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-white/78 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#B06235] shadow-[0_8px_18px_rgba(89,53,17,0.06)]">
                                <Icon
                                  className="h-4.5 w-4.5"
                                  strokeWidth={1.8}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#A05C35]">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-[0.84rem] leading-5 text-[#5D5047]">
                                  {item.caption}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {resultFeatureRail.length > 0 ? (
                    <div className="result-desktop-rail relative z-10 mt-4 hidden w-full max-w-[600px] grid-cols-3 overflow-hidden lg:mx-auto lg:grid">
                      {resultFeatureRail.map((item, index) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className={`flex min-h-[90px] items-center gap-3 px-4 py-3.5 xl:px-5 ${
                              index < resultFeatureRail.length - 1
                                ? "border-r border-[#EEDFD2]"
                                : ""
                            }`}
                          >
                            <div className="bg-white/74 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#B06235] shadow-[0_8px_18px_rgba(89,53,17,0.06)]">
                              <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#A05C35] xl:text-[0.7rem]">
                                {item.title}
                              </p>
                              <p className="mt-0.5 font-sans text-[0.82rem] font-medium leading-5 text-[#5D5047] xl:text-[0.84rem]">
                                {item.caption}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>

          <div ref={formSectionRef} className="scroll-mt-6 lg:scroll-mt-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: 0.08 }}
            >
              <QuizForm onSuccess={handleFormSuccess} />
            </motion.div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-[-10000px] top-0 z-[-1] opacity-0"
        >
          <div
            ref={shareCaptureCardRef}
            className="w-[1080px] overflow-hidden rounded-[46px] bg-[linear-gradient(180deg,#FFF9F4_0%,#FFF0E5_100%)] p-10 text-[#3A2418] shadow-[0_30px_70px_rgba(89,53,17,0.14)]"
          >
            <div
              className="relative overflow-hidden rounded-[36px] px-10 py-10 shadow-[0_18px_40px_rgba(89,53,17,0.06)]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,247,240,0.98) 100%), radial-gradient(circle at 18% 22%, ${
                  result.accentColor || "#FFD9B8"
                }52 0%, rgba(255,255,255,0) 48%), radial-gradient(circle at 84% 78%, ${
                  result.color || "#FF671F"
                }26 0%, rgba(255,255,255,0) 56%)`,
              }}
            >
              <div className="relative flex items-start justify-between gap-10">
                <div className="max-w-[610px] space-y-7">
                  <QuizBadge
                    className="gap-3 rounded-full px-5 py-3 shadow-[0_12px_24px_rgba(89,53,17,0.06)]"
                    style={{
                      borderColor: `${result.color || "#FF671F"}45`,
                      backgroundColor: "rgba(255,255,255,0.94)",
                      color: result.color || "#FF671F",
                    }}
                  >
                    <Heart
                      className="h-4 w-4"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                    <span className="font-display text-[1rem] font-extrabold uppercase tracking-[0.18em]">
                      Tu Match Dunkin'
                    </span>
                  </QuizBadge>

                  <div className="space-y-4">
                    <p className="font-sans text-[0.88rem] font-bold uppercase tracking-[0.22em] text-[#B0907C]">
                      Tu personalidad
                    </p>
                    <h2 className="font-display text-[2.35rem] font-extrabold leading-[0.94] tracking-[-0.05em] text-[#2A1D17]">
                      {personalityLabel}
                    </h2>
                    <h1 className="font-display text-[4.3rem] font-extrabold leading-[0.98] tracking-[-0.07em]">
                      <span
                        style={{
                          color: resultTitleColor,
                        }}
                      >
                        {result.recommendedDrink}
                      </span>
                    </h1>
                    <p className="max-w-[34ch] font-sans text-[1.18rem] font-medium leading-8 text-[#5D5047]">
                      {result.drinkDescription}
                    </p>
                  </div>
                </div>

                <div
                  className="relative flex h-[360px] w-[340px] shrink-0 items-center justify-center overflow-hidden rounded-[34px] shadow-[0_22px_50px_rgba(89,53,17,0.12)]"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,246,238,0.98) 100%), radial-gradient(circle at 22% 18%, ${
                      result.accentColor || "#FFD9B8"
                    }72 0%, rgba(255,255,255,0) 54%), radial-gradient(circle at 78% 84%, ${
                      result.color || "#FF671F"
                    }28 0%, rgba(255,255,255,0) 58%)`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute -left-14 top-10 h-56 w-56 rounded-full blur-[70px]"
                    style={{
                      backgroundColor: `${result.accentColor || "#FFD9B8"}A8`,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full blur-[80px]"
                    style={{
                      backgroundColor: `${result.color || "#FF671F"}54`,
                    }}
                  />
                  <div className="pointer-events-none absolute inset-x-8 bottom-10 h-10 rounded-full bg-white/60 blur-2xl" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0)_58%)]" />
                  {result.image ? (
                    <img
                      src={result.image}
                      alt={result.recommendedDrink}
                      className="relative z-10 h-[94%] w-[94%] object-contain drop-shadow-[0_26px_50px_rgba(89,53,17,0.22)]"
                      loading="eager"
                    />
                  ) : (
                    <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white/70 text-[#FF7A00] shadow-[0_14px_28px_rgba(89,53,17,0.08)]">
                      <Coffee className="h-10 w-10" strokeWidth={1.7} />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-9 grid gap-6 rounded-[32px] border border-[#EED9CB] bg-white/90 p-7 shadow-[0_18px_34px_rgba(89,53,17,0.07)]">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex rounded-full border px-4 py-2 font-sans text-[0.78rem] font-bold uppercase tracking-[0.16em]"
                    style={{
                      borderColor: `${result.color || "#FF671F"}30`,
                      backgroundColor: "rgba(255,255,255,0.96)",
                      color: result.color || "#FF671F",
                    }}
                  >
                    Plan para tu mood
                  </span>
                  {benefitData.discountLabel ? (
                    <span className="rounded-full bg-[#FF671F] px-4 py-2 font-sans text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#FFF8F3]">
                      {benefitData.discountLabel}
                    </span>
                  ) : null}
                  {benefitData.priceLabel ? (
                    <span className="rounded-full border border-[#DECBBB] bg-white px-4 py-2 font-sans text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#4A281B]">
                      {benefitData.priceLabel}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <h3 className="max-w-[28ch] font-display text-[2rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#201711]">
                    {benefitData.title}
                  </h3>
                  <p className="max-w-[54ch] font-sans text-[1.05rem] font-medium leading-8 text-[#5D5047]">
                    {benefitData.description}
                  </p>
                </div>

                {resultTraits.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {resultTraits.map((trait) => {
                      const TraitIcon = getResultTraitIcon(trait);

                      return (
                        <div
                          key={trait}
                          className="inline-flex items-center gap-2 rounded-full border border-[#ECD6C7] bg-[#FFF9F4] px-4 py-2.5 text-[#7A5238]"
                        >
                          <TraitIcon
                            className="h-4 w-4"
                            style={{ color: result.color || "#FF671F" }}
                            strokeWidth={2}
                          />
                          <span className="font-sans text-[0.82rem] font-bold uppercase tracking-[0.14em]">
                            {trait}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
