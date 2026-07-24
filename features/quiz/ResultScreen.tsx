"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import JSConfetti from "js-confetti";
import {
  ArrowRight,
  Check,
  Coffee,
  Heart,
  RefreshCw,
  Share2,
  Snowflake,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  getFallbackBenefit,
  type ResolvedCampaignBenefit,
} from "@/lib/campaign-benefits";
import { useQuizStore } from "@/store/quizStore";
import { QuizForm } from "./QuizForm";
import { QuizBadge } from "./components/QuizBadge";
import { QuizChip } from "./components/QuizChip";
import {
  quizTypography,
  resultTraitMap,
} from "./quizVisualSystem";

const desktopLifestyleAssetMap: Record<
  string,
  {
    src: string;
    fileName: string;
  }
> = {
  creative: {
    src: "/assets/quiz-results/lifestyle/iced-latte-desktop-lifestyle.webp",
    fileName: "iced-latte-desktop-lifestyle.webp",
  },
  balanced: {
    src: "/assets/quiz-results/lifestyle/cold-brew-desktop-lifestyle.webp",
    fileName: "cold-brew-desktop-lifestyle.webp",
  },
  energetic: {
    src: "/assets/quiz-results/lifestyle/refresher-mango-pina-desktop-lifestyle.webp",
    fileName: "refresher-mango-pina-desktop-lifestyle.webp",
  },
  passionate: {
    src: "/assets/quiz-results/lifestyle/frutibatido-desktop-lifestyle.webp",
    fileName: "frutibatido-desktop-lifestyle.webp",
  },
};

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
    { title: "Tropical al instante", caption: "Se siente fresco", icon: Snowflake },
    { title: "Explosión frutal", caption: "Mucho color y sabor", icon: Sparkles },
    { title: "Plan que despega", caption: "Vibra que contagia", icon: Zap },
  ],
  passionate: [
    { title: "Frío y alegre", caption: "Mood buen parche", icon: Snowflake },
    { title: "Dulce con flow", caption: "Ligero y smooth", icon: Heart },
    { title: "Buena energía", caption: "Te sube la vibra", icon: Zap },
  ],
};

export function ResultScreen() {
  const router = useRouter();
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const confettiRef = useRef<JSConfetti | null>(null);
  const { result, resetQuiz, formSubmitted } = useQuizStore();
  const shouldReduceMotion = useReducedMotion();
  const [resultImageHidden, setResultImageHidden] = useState(false);
  const [desktopLifestyleHidden, setDesktopLifestyleHidden] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [benefitIconHidden, setBenefitIconHidden] = useState(false);
  const [dynamicBenefit, setDynamicBenefit] =
    useState<ResolvedCampaignBenefit | null>(null);
  const [isBenefitLoading, setIsBenefitLoading] = useState(true);

  if (!result) {
    return null;
  }

  const mobileResultImageTransform = `translate(${result.mobileImageOffsetX || 0}px, ${
    result.mobileImageOffsetY || 0
  }px) scale(${result.mobileImageScale || 1})`;
  const resultTraits = resultTraitMap[result.id] || [];
  const resultFeatureRail = resultFeatureRailMap[result.id] || [];
  const desktopLifestyleAsset = desktopLifestyleAssetMap[result.id];
  const mobileHeroImageSrc =
    desktopLifestyleAsset && !desktopLifestyleHidden
      ? desktopLifestyleAsset.src
      : result.image;
  const benefitData = dynamicBenefit || getFallbackBenefit(result);
  const resultTitleColor = `${result.color || "#FF671F"}D9`;

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
  }, [result.id]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [result.id]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    confettiRef.current ??= new JSConfetti();

    void confettiRef.current.addConfetti({
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
  }, [result.id, result.color, result.accentColor, shouldReduceMotion]);

  const handleShare = () => {
    const shareText =
      "Ya descubrí mi match Dunkin'. Haz el test y mira cuál te sale a ti.";

    if (navigator.share) {
      navigator.share({
        title: "Comparte tu resultado Dunkin'",
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

  const handleClaimBenefit = () => {
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

    if (benefitData.url) {
      window.open(benefitData.url, "_blank", "noopener,noreferrer");
      return;
    }

    navigator.clipboard.writeText(result.benefit).catch(() => {});
  };

  const handleFormSuccess = () => {
    return;
  };

  return (
    <div className="result-desktop-stage min-h-screen px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
        <div
          className="absolute inset-0 opacity-[0.44]"
          style={{
            backgroundImage:
              "url('/assets/quiz-results/backgrounds/mobile/result-stage-background.jpg')",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-x-[-10%] top-[-6%] h-[34%] bg-cover bg-top bg-no-repeat opacity-[0.88]"
          style={{
            backgroundImage:
              "url('/assets/quiz-results/backgrounds/mobile/result-stage-background.jpg')",
            backgroundPosition: "center top",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-x-[-10%] top-[22%] h-[34%] bg-cover bg-center bg-no-repeat opacity-[0.8]"
          style={{
            backgroundImage:
              "url('/assets/quiz-results/backgrounds/mobile/result-stage-background.jpg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            transform: "rotate(180deg) scale(1.02)",
            transformOrigin: "center center",
          }}
        />
        <div
          className="absolute inset-x-[-10%] top-[50%] h-[34%] bg-cover bg-center bg-no-repeat opacity-[0.82]"
          style={{
            backgroundImage:
              "url('/assets/quiz-results/backgrounds/mobile/result-stage-background.jpg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        />
        <div
          className="absolute inset-x-[-10%] bottom-[-6%] h-[34%] bg-cover bg-bottom bg-no-repeat opacity-[0.78]"
          style={{
            backgroundImage:
              "url('/assets/quiz-results/backgrounds/mobile/result-stage-background.jpg')",
            backgroundPosition: "center bottom",
            backgroundSize: "cover",
            transform: "rotate(180deg) scale(1.02)",
            transformOrigin: "center center",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,234,0.12)_0%,rgba(247,241,234,0.04)_22%,rgba(247,241,234,0.02)_48%,rgba(247,241,234,0.08)_78%,rgba(247,241,234,0.18)_100%)]" />
      </div>
      <div className="result-desktop-shell relative mx-auto max-w-[1320px]">
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
            className="relative overflow-hidden rounded-[1.85rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,252,248,0.92)_0%,rgba(252,244,236,0.94)_100%)] px-4 py-5 shadow-[0_20px_48px_rgba(89,53,17,0.09)] sm:px-7 sm:py-7 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none"
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
            <div className="pointer-events-none absolute left-[-2rem] top-[14%] h-24 w-24 rounded-full bg-white/35 blur-3xl lg:hidden" />
            <div
              className="pointer-events-none absolute right-[-2.4rem] top-[34%] h-28 w-28 rounded-full blur-3xl lg:hidden"
              style={{ backgroundColor: `${result.color || "#FF671F"}18` }}
            />
            <div
              className="pointer-events-none absolute bottom-[-1.8rem] left-[18%] h-24 w-24 rounded-full blur-3xl lg:hidden"
              style={{ backgroundColor: `${result.accentColor || "#FFD9B8"}38` }}
            />

            <div className="relative mb-7 lg:hidden">
              <div className="relative overflow-hidden rounded-[1.9rem] border border-transparent bg-[linear-gradient(180deg,rgba(255,252,248,0.86)_0%,rgba(252,244,236,0.92)_100%)] px-4 py-4 shadow-[0_18px_40px_rgba(89,53,17,0.08)] backdrop-blur-[8px]">
                <div
                  className="pointer-events-none absolute right-3 top-3 h-[78px] w-[78px] rotate-[8deg] rounded-[1.55rem] border border-white/60 bg-white/72 p-2 shadow-[0_12px_24px_rgba(89,53,17,0.08)]"
                  style={{ borderColor: `${result.accentColor || "#FFD9B8"}AA` }}
                >
                  {!resultImageHidden && result.image ? (
                    <img
                      src={result.image}
                      alt={result.recommendedDrink}
                      className="h-full w-full object-contain"
                      onError={() => setResultImageHidden(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[1rem] bg-white/82">
                      <Coffee className="h-7 w-7 text-[#B8895D]/70" strokeWidth={1.8} />
                    </div>
                  )}
                </div>

                <QuizBadge
                  className="gap-2 rounded-full px-4 py-2 shadow-[0_10px_24px_rgba(89,53,17,0.06)]"
                  style={{
                    borderColor: `${result.accentColor || "#FFD9B8"}99`,
                    backgroundColor: "rgba(255,248,241,0.92)",
                    color: result.color || "#B86B2C",
                  }}
                >
                  <Heart className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                  <span className={quizTypography.matchBadge}>Tu Match Dunkin'</span>
                </QuizBadge>

                <div className="mt-4 grid grid-cols-[minmax(0,1fr)_138px] gap-3">
                  <div className="min-w-0 space-y-3 pt-1">
                    <h1
                      className={`${quizTypography.drinkHeroTitle} max-w-[6ch] text-[2.55rem] leading-[0.88] text-balance`}
                      style={{ color: resultTitleColor }}
                    >
                      {result.recommendedDrink}
                    </h1>
                    <p className="font-sans max-w-[22ch] text-[0.9rem] font-medium leading-7 text-[#5D5047]">
                      {result.drinkDescription}
                    </p>
                  </div>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-[-0.8rem] top-6 text-[#FF7A00]">
                      <div className="mb-1 h-[2px] w-5 rounded-full bg-current" />
                      <div className="mb-1 ml-1 h-[2px] w-3 rounded-full bg-current" />
                      <div className="ml-2 h-[2px] w-4 rounded-full bg-current" />
                    </div>

                    <div className="pointer-events-none absolute left-[-0.55rem] top-[4.5rem] text-[#EE5F77]">
                      <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent border-r-transparent" />
                    </div>

                    <div
                      className="relative overflow-hidden rounded-[1.7rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(252,244,236,0.96)_100%)] p-2 shadow-[0_20px_42px_rgba(89,53,17,0.11)]"
                      style={{
                        borderColor: `${result.accentColor || "#FFD9B8"}A8`,
                      }}
                    >
                      <motion.div
                        className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-[linear-gradient(180deg,#FFF8F1_0%,#F8E3D2_100%)]"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 6.4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        {mobileHeroImageSrc && !resultImageHidden ? (
                          <img
                            src={mobileHeroImageSrc}
                            alt={result.recommendedDrink}
                            className="h-full w-full object-cover"
                            style={{
                              transform: mobileResultImageTransform,
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
                            <Coffee className="h-10 w-10 text-[#B8895D]/70" strokeWidth={1.7} />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,rgba(17,10,4,0)_0%,rgba(17,10,4,0.12)_100%)]" />
                      </motion.div>

                      <div className="pointer-events-none absolute bottom-[-0.9rem] left-[-0.85rem] flex h-[76px] w-[76px] rotate-[-14deg] items-center justify-center rounded-full border border-[#FFC9A4] bg-[radial-gradient(circle_at_30%_30%,#FFF7EF_0%,#FDE6D4_64%,#F8D3BA_100%)] text-center font-display text-[0.58rem] font-extrabold uppercase tracking-[0.13em] text-[#EE5F77] shadow-[0_16px_30px_rgba(89,53,17,0.12)]">
                        <div className="space-y-0.5">
                          <p>Match</p>
                          <Heart className="mx-auto h-3 w-3" fill="currentColor" strokeWidth={0} />
                          <p>Perfecto</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-14 xl:gap-16">
              <div className="order-2 min-w-0 space-y-5 lg:order-1 lg:space-y-8 lg:pt-3 xl:max-w-[560px]">
                <div className="hidden space-y-4 lg:block lg:space-y-5 lg:pl-6 xl:pl-8">
                  <QuizBadge
                    className="gap-2 rounded-full px-4 py-2 shadow-[0_10px_24px_rgba(89,53,17,0.06)] lg:shadow-none"
                    style={{
                      borderColor: `${result.accentColor || "#FFD9B8"}99`,
                      backgroundColor: "rgba(255,248,241,0.9)",
                      color: result.color || "#B86B2C",
                    }}
                  >
                    <Heart className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                    <span className={quizTypography.matchBadge}>
                      Tu Match Dunkin'
                    </span>
                  </QuizBadge>

                  <h1
                    className={`${quizTypography.drinkHeroTitle} max-w-[10ch] text-[2.9rem] sm:text-[3.55rem] lg:text-[4.4rem] xl:text-[5.1rem]`}
                    style={{ color: resultTitleColor }}
                  >
                    {result.recommendedDrink}
                  </h1>

                  <p className={`${quizTypography.supporting} max-w-[42ch] text-[1rem] lg:text-[1.06rem]`}>
                    {result.drinkDescription}
                  </p>
                </div>

                <div className="hidden min-w-0 overflow-hidden rounded-[2rem] border border-[#EFD9C8] bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(255,248,242,0.78)_100%)] px-5 py-5 shadow-[0_18px_40px_rgba(89,53,17,0.06)] backdrop-blur-[10px] sm:px-6 sm:py-6 lg:block lg:ml-6 lg:px-7 xl:ml-8 xl:px-8">
                  <div className="grid gap-5 sm:grid-cols-[82px_minmax(0,1fr)] sm:items-start lg:gap-6">
                    <div
                      className="flex h-[82px] w-[82px] items-center justify-center rounded-full border bg-[linear-gradient(180deg,#FFF9F3_0%,#FDEBDD_100%)] text-[#F08A2B] shadow-[0_10px_24px_rgba(89,53,17,0.07)]"
                      style={{ borderColor: `${result.accentColor || "#FFD9B8"}B0` }}
                    >
                      <Sparkles className="h-8 w-8" strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0 space-y-4 lg:pr-4">
                      <div className="space-y-2">
                        <p className="font-sans text-[0.82rem] font-medium uppercase tracking-[0.2em] text-[#B0907C]">
                          Tu personalidad
                        </p>
                        <h2 className={`${quizTypography.personalityTitle} break-words text-[1.48rem] leading-[0.96] sm:text-[1.6rem]`}>
                          {result.personalityType || result.title}
                        </h2>
                        <p className="font-sans max-w-[34ch] text-[0.98rem] font-medium leading-[1.75] text-[#5A4A40]">
                          {result.description}
                        </p>
                      </div>

                      {resultTraits.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {resultTraits.map((trait) => (
                            <QuizChip
                              key={trait}
                              className="gap-2 rounded-full px-4 py-2"
                              style={{
                                borderColor: `${result.color || "#FF671F"}1F`,
                                backgroundColor:
                                  trait === resultTraits[1]
                                    ? "rgba(242, 119, 154, 0.12)"
                                    : "rgba(255, 249, 243, 0.92)",
                                color: result.color || "#B86B2C",
                              }}
                            >
                              <span
                                className="flex h-5 w-5 items-center justify-center rounded-full"
                                style={{
                                  backgroundColor:
                                    trait === resultTraits[1]
                                      ? "rgba(242, 119, 154, 0.14)"
                                      : "rgba(255, 255, 255, 0.88)",
                                  color:
                                    trait === resultTraits[1]
                                      ? "#E9539A"
                                      : result.color || "#FF671F",
                                }}
                              >
                                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                              </span>
                              <span className={quizTypography.chip}>{trait}</span>
                            </QuizChip>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="lg:hidden">
                  <div
                    className="relative min-h-[23rem] overflow-hidden rounded-[1.85rem] border border-transparent bg-[linear-gradient(180deg,rgba(255,252,248,0.86)_0%,rgba(252,244,236,0.92)_100%)] px-4 py-4 shadow-[0_18px_40px_rgba(89,53,17,0.08)] backdrop-blur-[10px]"
                  >
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
                    <div className="relative flex min-h-[calc(23rem-2rem)] flex-col">
                      <div className="grid grid-cols-[82px_minmax(0,1fr)] items-start gap-4">
                        <div
                          className="flex h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-full border bg-[linear-gradient(180deg,#FFF8F2_0%,#FDEBDD_100%)] shadow-[0_14px_28px_rgba(89,53,17,0.08)]"
                          style={{
                            borderColor: `${result.accentColor || "#FFD9B8"}A6`,
                          }}
                        >
                          {isBenefitLoading ? (
                            <div className="h-[72%] w-[72%] animate-pulse rounded-full bg-white/70" />
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
                            className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.16em]"
                            style={{ color: result.color || "#FF671F" }}
                          >
                            Recomendación
                          </p>

                          {isBenefitLoading ? (
                            <div className="space-y-2.5 animate-pulse">
                              <div className="h-6 w-[72%] rounded-full bg-white/74" />
                              <div className="h-4.5 w-full rounded-full bg-white/64" />
                              <div className="h-4.5 w-[92%] rounded-full bg-white/58" />
                              <div className="h-4.5 w-[78%] rounded-full bg-white/52" />
                            </div>
                          ) : (
                            <div className="mt-2 flex min-h-[8.7rem] flex-col space-y-2">
                              <h3 className="line-clamp-2 min-h-[3.45rem] font-display break-words text-[1.06rem] font-extrabold tracking-[-0.03em] text-[#201711]">
                                {benefitData.title}
                              </h3>
                              <p className="line-clamp-3 min-h-[6.1rem] font-sans text-[0.96rem] font-medium leading-7 text-[#5D5047]">
                                {benefitData.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {isBenefitLoading ? (
                        <>
                          <div className="mt-4 flex flex-wrap gap-2 animate-pulse">
                            <div className="h-8 w-[138px] rounded-full bg-white/74" />
                            <div className="h-8 w-[104px] rounded-full bg-white/62" />
                          </div>
                          <div className="mt-auto pt-5">
                            <div className="h-[52px] w-full animate-pulse rounded-full bg-[#EF6A00]/18" />
                          </div>
                        </>
                      ) : (
                        <>
                          {benefitData.discountLabel || benefitData.priceLabel ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {benefitData.discountLabel ? (
                                <span className="rounded-full bg-[#FF671F] px-3 py-1.5 font-sans text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#F8F4F1]">
                                  {benefitData.discountLabel}
                                </span>
                              ) : null}
                              {benefitData.priceLabel ? (
                                <span className="rounded-full border border-[#E8DCCF] bg-white/78 px-3 py-1.5 font-sans text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#4A281B]">
                                  {benefitData.priceLabel}
                                </span>
                              ) : null}
                            </div>
                          ) : null}

                          <div className="mt-auto pt-5">
                            <Button
                              variant="quizCta"
                              size="quiz"
                              onClick={handleClaimBenefit}
                              disabled={isBenefitLoading}
                              className="w-full justify-between px-6 font-sans text-[0.98rem] disabled:opacity-70"
                            >
                              <span>{formSubmitted ? benefitData.cta : "Ver recomendación"}</span>
                              <span className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#EE5F77] shadow-[0_10px_22px_rgba(89,53,17,0.1)]">
                                <ArrowRight className="h-4.5 w-4.5" strokeWidth={2.6} />
                              </span>
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="result-desktop-soft-surface relative hidden min-h-[20rem] overflow-hidden rounded-[1.8rem] px-4 py-4 sm:px-5 sm:py-5 lg:ml-6 lg:block lg:rounded-[1.75rem] lg:px-7 lg:py-6 xl:ml-8 xl:px-8"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,251,247,0.86) 0%, rgba(252,244,236,0.94) 100%), radial-gradient(circle at 18% 26%, ${
                      result.accentColor || "#FFD9B8"
                    }24 0%, rgba(255,255,255,0) 48%), radial-gradient(circle at 82% 76%, ${
                      result.color || "#FF671F"
                    }12 0%, rgba(255,255,255,0) 56%)`,
                  }}
                >
                  <div className="pointer-events-none absolute right-4 top-3 hidden text-[#F3B36A] lg:block">
                    <Sparkles className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div className="relative grid min-h-[calc(20rem-3rem)] gap-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:items-start sm:gap-5 lg:grid-cols-[84px_minmax(0,1fr)] lg:gap-6">
                    <div
                      className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-[1.45rem] border bg-white/80 shadow-[0_16px_34px_rgba(89,53,17,0.08)] lg:h-[84px] lg:w-[84px] lg:border-[rgba(255,255,255,0.45)] lg:bg-white/68 lg:shadow-none"
                      style={{
                        borderColor: `${result.accentColor || "#FFD9B8"}88`,
                      }}
                    >
                      {isBenefitLoading ? (
                        <div className="h-[70%] w-[70%] animate-pulse rounded-[1rem] bg-white/70" />
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

                    <div className="flex min-w-0 flex-col space-y-3 lg:pr-4">
                      {isBenefitLoading ? (
                        <>
                          <div className="flex flex-wrap items-center gap-2.5 animate-pulse">
                            <div className="h-8 w-[146px] rounded-full bg-white/74" />
                            <div className="h-8 w-[110px] rounded-full bg-white/62" />
                          </div>
                          <div className="space-y-2.5 animate-pulse">
                            <div className="h-6 w-[76%] rounded-full bg-white/72" />
                            <div className="h-4.5 w-full rounded-full bg-white/62" />
                            <div className="h-4.5 w-[88%] rounded-full bg-white/56" />
                            <div className="h-4.5 w-[68%] rounded-full bg-white/50" />
                          </div>
                          <div className="mt-auto pt-3">
                            <div className="h-[48px] w-full animate-pulse rounded-full bg-[#EF6A00]/18 sm:w-[240px]" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <QuizChip
                              style={{
                                borderColor: `${result.color || "#FF671F"}26`,
                                backgroundColor: "rgba(255,255,255,0.76)",
                                color: result.color || "#B86B2C",
                              }}
                            >
                              <span className={quizTypography.chip}>Recomendación</span>
                            </QuizChip>
                            {benefitData.discountLabel ? (
                              <span className="rounded-full bg-[#FF671F] px-3 py-1.5 font-sans text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[#F8F4F1] sm:text-[0.72rem]">
                                {benefitData.discountLabel}
                              </span>
                            ) : null}
                            {benefitData.priceLabel ? (
                              <span className="rounded-full border border-[#E8DCCF] bg-white/78 px-3 py-1.5 font-sans text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#4A281B] sm:text-[0.72rem]">
                                {benefitData.priceLabel}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex min-h-[8.8rem] flex-col space-y-2">
                            <h3 className="line-clamp-2 min-h-[3.5rem] max-w-[30ch] break-words font-display text-[1.05rem] font-extrabold tracking-[-0.03em] text-[#201711] sm:text-[1.15rem]">
                              {benefitData.title}
                            </h3>
                            <p className={`${quizTypography.supportingCompact} line-clamp-4 min-h-[6.2rem] max-w-[44ch]`}>
                              {benefitData.description}
                            </p>
                          </div>

                          <Button
                            variant="quizCta"
                            size="quiz"
                            onClick={handleClaimBenefit}
                            disabled={isBenefitLoading}
                            className="mt-auto w-full justify-center px-4 font-sans text-[0.92rem] disabled:opacity-70 sm:w-auto sm:min-w-[240px]"
                          >
                            {formSubmitted ? benefitData.cta : "Ver recomendación"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:mx-auto lg:w-full lg:max-w-[600px] lg:justify-center lg:px-8 lg:pb-5 xl:max-w-[620px] xl:px-10 xl:pb-6">
                  <Button
                    variant="quizCta"
                    size="quiz"
                    onClick={handleShare}
                    className="w-full justify-center px-4 text-[0.92rem] sm:w-auto sm:min-w-[220px] lg:min-w-[236px]"
                  >
                    {copySuccess ? "Enlace copiado" : "Compartir"}
                    {copySuccess ? (
                      <Check className="ml-2 h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <Share2 className="ml-2 h-4 w-4" strokeWidth={2.2} />
                    )}
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
              </div>

              <div className="order-1 hidden min-w-0 lg:-ml-7 lg:order-2 lg:block xl:-ml-8">
                <div className="relative mx-auto flex w-full max-w-[640px] min-w-0 flex-col items-center justify-center gap-0 lg:max-w-[700px] lg:pt-7 xl:pt-8">
                  <div
                    className="pointer-events-none absolute right-[1rem] top-[1rem] hidden h-[104px] w-[104px] rotate-[14deg] items-center justify-center rounded-full border border-[#FFC9A4] bg-[radial-gradient(circle_at_30%_30%,#FFF7EF_0%,#FDE6D4_64%,#F8D3BA_100%)] text-center font-display text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#EE5F77] shadow-[0_18px_38px_rgba(89,53,17,0.12)] lg:flex"
                  >
                    <div className="space-y-1">
                      <p>Match</p>
                      <Heart className="mx-auto h-4 w-4" fill="currentColor" strokeWidth={0} />
                      <p>Perfecto</p>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute left-[0.3rem] top-[9rem] hidden text-[#FF7A00] lg:block">
                    <div className="mb-1 h-[2px] w-7 rounded-full bg-current" />
                    <div className="mb-1 ml-2 h-[2px] w-4 rounded-full bg-current" />
                    <div className="ml-1 h-[2px] w-6 rounded-full bg-current" />
                  </div>

                  <div className="pointer-events-none absolute left-[1.4rem] top-[47%] hidden text-[#EE5F77] lg:block">
                    <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent border-r-transparent" />
                  </div>

                  <div className="pointer-events-none absolute right-[2.6rem] top-[48%] hidden text-white lg:block">
                    <div className="h-6 w-6 rounded-full border-2 border-current border-l-transparent border-b-transparent" />
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
                      style={{ backgroundColor: `${result.accentColor || "#FFD9B8"}72` }}
                    />
                    <div
                      className="pointer-events-none absolute bottom-4 left-1/2 h-10 w-[58%] -translate-x-1/2 rounded-full blur-2xl lg:hidden"
                      style={{ backgroundColor: `${result.color || "#FF671F"}24` }}
                    />
                    <motion.div
                      className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#FFF8F1_0%,#F8E3D2_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] sm:rounded-[2.2rem] lg:rounded-[1.9rem] lg:shadow-none"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 6.4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
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
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#F0C9A9] bg-white/72 text-[#FF7A00] shadow-[0_14px_28px_rgba(89,53,17,0.08)]">
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
                                Pon la foto en
                                {" "}
                                <span className="font-sans font-medium text-[#B86B2C]">
                                  /public/assets/quiz-results/lifestyle/
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(180deg,rgba(17,10,4,0)_0%,rgba(17,10,4,0.12)_100%)] lg:hidden" />
                    </motion.div>

                    
                  </div>

                  {resultFeatureRail.length > 0 ? (
                    <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1 lg:hidden">
                      {resultFeatureRail.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.title}
                            className="min-w-[176px] shrink-0 rounded-[1.35rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,251,247,0.92)_0%,rgba(252,244,236,0.96)_100%)] px-4 py-3 shadow-[0_14px_30px_rgba(89,53,17,0.08)]"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/78 text-[#B06235] shadow-[0_8px_18px_rgba(89,53,17,0.06)]">
                                <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
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
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/74 text-[#B06235] shadow-[0_8px_18px_rgba(89,53,17,0.06)]">
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
      </div>
    </div>
  );
}
