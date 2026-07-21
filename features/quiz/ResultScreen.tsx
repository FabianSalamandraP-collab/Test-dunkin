"use client";

// Pantalla de resultados del quiz
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Coffee,
  RefreshCw,
  Share2,
  Gift,
  Menu,
  ArrowRight,
  ArrowUp,
  Heart,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  getFallbackBenefit,
  type ResolvedCampaignBenefit,
} from "@/lib/campaign-benefits";
import { useQuizStore } from "@/store/quizStore";
import { QuizForm } from "./QuizForm";

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
      ? "/assets/quiz-intro/borders/side-ribbon-left.webp"
      : "/assets/quiz-intro/borders/side-ribbon-right.webp";

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

export function ResultScreen() {
  const router = useRouter();
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const { result, resetQuiz, formSubmitted } = useQuizStore();
  const [resultImageHidden, setResultImageHidden] = useState(false);
  const [benefitIconHidden, setBenefitIconHidden] = useState(false);
  const [dynamicBenefit, setDynamicBenefit] =
    useState<ResolvedCampaignBenefit | null>(null);
  const [isBenefitLoading, setIsBenefitLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!result) {
    return null;
  }

  const benefitData = dynamicBenefit || getFallbackBenefit(result);
  const mobileResultImageTransform = `translate(${result.mobileImageOffsetX || 0}px, ${
    result.mobileImageOffsetY || 0
  }px) scale(${result.mobileImageScale || 1})`;

  useEffect(() => {
    let isMounted = true;

    const loadBenefit = async () => {
      setIsBenefitLoading(true);

      try {
        const response = await fetch(`/api/benefits?resultId=${result.id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No fue posible consultar el beneficio");
        }

        const payload = (await response.json()) as {
          benefit?: ResolvedCampaignBenefit;
        };

        if (isMounted && payload.benefit) {
          setDynamicBenefit(payload.benefit);
          setBenefitIconHidden(false);
          setIsBenefitLoading(false);
        }
      } catch (error) {
        console.error("Error cargando beneficio dinamico:", error);

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
    const updateScrollState = () => setShowBackToTop(window.scrollY > 520);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const handleShare = () => {
    const shareText =
      "Ya descubrí mi match Dunkin. Haz el test y mira cuál te sale a ti.";

    if (navigator.share) {
      navigator.share({
        title: "Comparte tu resultado Dunkin",
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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopySuccess(true);
        window.setTimeout(() => setCopySuccess(false), 2200);
      })
      .catch(() => {});
  };

  const handleClaimBenefit = () => {
    if (!formSubmitted) {
      formSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (benefitData.url) {
      window.open(benefitData.url, "_blank", "noopener,noreferrer");
      return;
    }

    navigator.clipboard.writeText(result.benefit).catch(() => {});
  };

  const handleFormSuccess = () => {
    // Se ejecuta cuando el formulario se envía correctamente
    // Aquí podrías mostrar más botones o navegar a otra página
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f4eee7] px-3 py-3 sm:px-5 sm:py-5">
      <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f8f4ef_0%,#fbf8f4_100%)] shadow-[0_30px_80px_rgba(89,53,17,0.12)]">
        <SideRibbon side="left" />
        <SideRibbon side="right" />
        <div className="mx-[26px] space-y-4 px-4 py-4 sm:mx-[34px] sm:space-y-6 sm:px-8 sm:py-8 md:mx-[42px] md:px-7 md:py-7 lg:mx-[72px] lg:px-10 xl:mx-[78px] xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/82 relative overflow-hidden rounded-[1.8rem] px-4 py-5 shadow-[0_24px_55px_rgba(89,53,17,0.08)] ring-1 ring-[#ECE2D8] backdrop-blur-[3px] sm:rounded-[2rem] sm:px-8 sm:py-7 lg:px-10 lg:py-10"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background: `radial-gradient(circle_at_18%_28%, ${
                result.color || "#FF7A00"
              }18 0%, rgba(255,255,255,0) 62%), radial-gradient(circle_at_84%_78%, ${
                result.accentColor || "#FFD9B8"
              }26 0%, rgba(255,255,255,0) 58%)`,
            }}
          />
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

          <div className="relative flex flex-col gap-3 md:grid md:grid-cols-[0.96fr_0.84fr] md:items-center md:gap-7 lg:grid-cols-[0.95fr_0.85fr] xl:gap-10">
            <div className="space-y-3 text-left md:space-y-7">
              <div
                className="relative overflow-hidden rounded-[1.35rem] border border-[#EEE1D4] p-3.5 shadow-[0_16px_30px_rgba(89,53,17,0.05)] md:space-y-3 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none"
                style={{
                  background: `linear-gradient(180deg, rgba(255,252,248,0.96) 0%, ${
                    result.accentColor || "#FFF0E0"
                  }64 100%)`,
                }}
              >
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[16%] top-[18%] h-[180px] w-[180px] rounded-full blur-[34px] md:h-[240px] md:w-[240px]"
                  style={{
                    background: `radial-gradient(circle, ${
                      result.color || "#FF7A00"
                    }8a 0%, ${result.accentColor || "#FFD9B8"}00 72%)`,
                  }}
                  animate={{
                    scale: [0.92, 1.1, 0.96],
                    opacity: [0.4, 0.72, 0.46],
                    x: [0, 18, -8],
                    y: [0, -16, 10],
                  }}
                  transition={{
                    duration: 6.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[-18%] right-[-10%] h-[150px] w-[150px] rounded-full blur-[30px] md:h-[220px] md:w-[220px]"
                  style={{
                    background: `radial-gradient(circle, ${
                      result.accentColor || "#FFD9B8"
                    }88 0%, rgba(255,255,255,0) 74%)`,
                  }}
                  animate={{
                    scale: [0.88, 1.06, 0.92],
                    opacity: [0.28, 0.52, 0.32],
                    x: [0, -18, 10],
                    y: [0, 12, -10],
                  }}
                  transition={{
                    duration: 7.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <div
                  className="relative inline-flex rounded-full border bg-[#FFF3E8]/92 px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.16em] shadow-[0_8px_18px_rgba(89,53,17,0.05)] sm:text-[0.68rem]"
                  style={{
                    color: result.color || "#B86B2C",
                    borderColor: `${result.accentColor || "#F2D8C4"}66`,
                  }}
                >
                  Tu match Dunkin
                </div>
                <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7A6A5B] sm:text-sm">
                  {result.badge || "Tu personalidad"}
                </p>
                <h1
                  className="max-w-[13rem] text-[1.62rem] font-black uppercase leading-[0.86] tracking-[-0.05em] sm:max-w-none sm:text-[3rem] md:text-[2.8rem] lg:text-[3.35rem] xl:text-[3.7rem]"
                  style={{ color: result.color || "#FF7A00" }}
                >
                  {result.title}
                </h1>
                <p className="max-w-[17.25rem] text-[0.8rem] leading-[1.38] text-[#5E5146] md:max-w-[560px] md:text-[1.02rem] md:leading-7 xl:max-w-[620px] xl:text-[1.08rem] xl:leading-8">
                  {result.description}
                </p>
                <div className="mt-3 space-y-3 md:hidden">
                  <div
                    className="relative mx-auto flex w-full max-w-[280px] items-center justify-center overflow-hidden rounded-[1.9rem] border bg-[linear-gradient(180deg,rgba(255,251,246,0.98)_0%,rgba(247,237,226,0.98)_100%)] px-5 pb-4 pt-5 shadow-[0_18px_34px_rgba(89,53,17,0.08),inset_0_1px_0_rgba(255,255,255,0.56)]"
                    style={{
                      borderColor: `${result.accentColor || "#E8D7C8"}7a`,
                    }}
                  >
                    <div
                      className="absolute left-1/2 top-5 h-[138px] w-[138px] -translate-x-1/2 rounded-full opacity-90 blur-[2px]"
                      style={{
                        background: `radial-gradient(circle, ${result.color || "#FF7A00"} 0%, ${result.accentColor || "#FFD9B8"} 58%, rgba(255,255,255,0) 68%)`,
                      }}
                    />
                    <div className="absolute inset-x-7 top-4 h-5 rounded-full bg-white/60 blur-md" />
                    <div className="absolute bottom-4 left-1/2 h-5 w-[68%] -translate-x-1/2 rounded-[999px] blur-md" style={{ backgroundColor: `${result.color || "#C98F5C"}26` }} />
                    {!resultImageHidden && result.image ? (
                      <div className="relative z-10 flex h-[190px] w-full items-center justify-center px-2">
                        <img
                          src={result.image}
                          alt={result.recommendedDrink}
                          className="h-full w-full object-contain drop-shadow-[0_20px_28px_rgba(87,45,0,0.16)]"
                          style={{
                            transform: mobileResultImageTransform,
                            transformOrigin: "center center",
                          }}
                          onError={() => setResultImageHidden(true)}
                        />
                      </div>
                    ) : (
                      <div className="relative z-10 flex h-[178px] w-[128px] items-end justify-center rounded-[1.55rem] bg-[linear-gradient(180deg,#f6dfc7_0%,#d49755_100%)] shadow-[0_16px_24px_rgba(140,81,24,0.14)]">
                        <div className="bg-white/50 absolute inset-x-3 top-3 h-4 rounded-full blur-md" />
                        <div className="border-white/70 absolute -top-3 left-1/2 h-8 w-[72%] -translate-x-1/2 rounded-full border-[3px] bg-[#f6d8b7]" />
                        <span className="absolute inset-y-0 right-4 flex items-center text-[1.02rem] font-black tracking-[-0.08em] text-[#FF7A00] [writing-mode:vertical-rl]">
                          DUNKIN'
                        </span>
                        <Coffee
                          className="text-white/70 absolute left-1/2 top-[41%] h-8 w-8 -translate-x-1/2"
                          strokeWidth={1.8}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="relative overflow-hidden space-y-2 rounded-[1.15rem] border p-3 shadow-[0_12px_24px_rgba(89,53,17,0.05)]"
                    style={{
                      borderColor: `${result.accentColor || "#F0E1D4"}7a`,
                      background: `linear-gradient(180deg, #FFF8F2 0%, ${
                        result.accentColor || "#FFF2E6"
                      }70 100%)`,
                    }}
                  >
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-[18%] top-[22%] h-[120px] w-[120px] rounded-full blur-[28px]"
                      style={{
                        background: `radial-gradient(circle, ${
                          result.color || "#FF7A00"
                        }58 0%, rgba(255,255,255,0) 72%)`,
                      }}
                      animate={{
                        scale: [0.94, 1.08, 0.98],
                        opacity: [0.36, 0.64, 0.4],
                        x: [0, 10, -6],
                        y: [0, -12, 8],
                      }}
                      transition={{
                        duration: 6.2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-[-28%] right-[-14%] h-[115px] w-[115px] rounded-full blur-[26px]"
                      style={{
                        background: `radial-gradient(circle, ${
                          result.accentColor || "#FFD9B8"
                        }88 0%, rgba(255,255,255,0) 74%)`,
                      }}
                      animate={{
                        scale: [0.88, 1.04, 0.92],
                        opacity: [0.28, 0.5, 0.3],
                        x: [0, -10, 6],
                        y: [0, 8, -8],
                      }}
                      transition={{
                        duration: 7.4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[#7A6A5B]">
                      La bebida que va contigo
                    </p>
                    <div className="flex items-start gap-2">
                      <h2 className="text-[1.32rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-[#4A281B]">
                        {result.recommendedDrink}
                      </h2>
                      <Heart className="mt-0.5 h-4.5 w-4.5 shrink-0 fill-[#FF5DB1] text-[#FF5DB1]" />
                    </div>
                    <p className="text-[0.78rem] leading-[1.36] text-[#5E5146]">
                      {result.drinkDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="relative hidden overflow-hidden space-y-2 rounded-[1.15rem] border border-[#F0E1D4] p-3.5 shadow-[0_12px_24px_rgba(89,53,17,0.05)] md:block md:space-y-2.5 md:rounded-[1.5rem] md:p-5"
                style={{
                  borderColor: `${result.accentColor || "#F0E1D4"}7a`,
                  background: `linear-gradient(180deg, #FFF8F2 0%, ${
                    result.accentColor || "#FFF2E6"
                  }66 100%)`,
                }}
              >
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[10%] top-[16%] h-[190px] w-[190px] rounded-full blur-[34px]"
                  style={{
                    background: `radial-gradient(circle, ${
                      result.color || "#FF7A00"
                    }5e 0%, rgba(255,255,255,0) 72%)`,
                  }}
                  animate={{
                    scale: [0.94, 1.1, 0.98],
                    opacity: [0.38, 0.68, 0.42],
                    x: [0, 14, -10],
                    y: [0, -18, 10],
                  }}
                  transition={{
                    duration: 6.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[-26%] right-[-6%] h-[180px] w-[180px] rounded-full blur-[32px]"
                  style={{
                    background: `radial-gradient(circle, ${
                      result.accentColor || "#FFD9B8"
                    }92 0%, rgba(255,255,255,0) 74%)`,
                  }}
                  animate={{
                    scale: [0.9, 1.06, 0.94],
                    opacity: [0.3, 0.54, 0.34],
                    x: [0, -14, 8],
                    y: [0, 12, -10],
                  }}
                  transition={{
                    duration: 7.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7A6A5B] sm:text-sm">
                  La bebida que va contigo
                </p>
                <div className="flex items-start gap-2">
                  <h2 className="text-[1.42rem] font-black uppercase leading-[0.92] tracking-[-0.05em] text-[#4A281B] sm:text-[2.8rem] md:text-[2.45rem] xl:text-[3rem]">
                    {result.recommendedDrink}
                  </h2>
                  <Heart className="mt-0.5 h-5 w-5 shrink-0 fill-[#FF5DB1] text-[#FF5DB1] sm:h-7 sm:w-7" />
                </div>
                <p className="max-w-[560px] text-[0.8rem] leading-[1.42] text-[#5E5146] md:text-[1.02rem] md:leading-7 xl:max-w-[620px] xl:text-[1.08rem] xl:leading-8">
                  {result.drinkDescription}
                </p>
                <p className="rounded-[0.9rem] bg-white/84 px-3 py-2 text-[0.7rem] font-medium leading-[1.3] text-[#7F5F4D] sm:text-[0.82rem]">
                  La bebida que mejor acompaña tu mood.
                </p>
              </div>
            </div>

            <div className="pointer-events-none hidden md:pointer-events-auto md:relative md:flex md:min-h-[390px] md:w-auto md:items-center md:justify-center md:pt-0 lg:min-h-[420px] xl:min-h-[460px]">
              <div
                className="absolute right-[4px] top-[12px] h-[100px] w-[100px] rounded-full opacity-78 blur-[1px] md:bottom-[12%] md:right-[16%] md:top-auto md:h-[220px] md:w-[220px] md:opacity-100 md:blur-0 xl:h-[280px] xl:w-[280px]"
                style={{
                  background: `radial-gradient(circle, ${result.color || "#FF7A00"} 0%, ${result.accentColor || "#FFD9B8"} 58%, rgba(255,255,255,0) 62%)`,
                }}
              />

              {!resultImageHidden && result.image ? (
                <div className="relative z-10 flex h-[154px] w-[112px] items-center justify-center rounded-[1.55rem] border border-[#D9B288]/34 bg-[linear-gradient(180deg,rgba(255,248,240,0.98)_0%,rgba(242,217,183,0.98)_100%)] shadow-[0_20px_34px_rgba(140,81,24,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] md:h-[332px] md:w-[228px] md:rounded-[2.3rem] md:border md:border-[#E7D2BF]/70 md:bg-[linear-gradient(180deg,rgba(255,252,247,0.92)_0%,rgba(247,237,227,0.98)_100%)] md:p-4 md:shadow-[0_28px_54px_rgba(89,53,17,0.12),inset_0_1px_0_rgba(255,255,255,0.56)] lg:h-[372px] lg:w-[248px] xl:h-[420px] xl:w-[278px]">
                  <div className="absolute inset-x-2.5 top-2.5 h-4 rounded-full bg-white/24 blur-md md:hidden" />
                  <span className="absolute right-2.5 top-2.5 text-[0.96rem] font-black tracking-[-0.08em] text-[#FF7A00] [writing-mode:vertical-rl] md:hidden">
                    DUNKIN'
                  </span>
                  <div className="absolute inset-x-5 top-4 hidden h-5 rounded-full bg-white/55 blur-md md:block" />
                  <div
                    className="absolute bottom-4 left-1/2 hidden h-6 w-[68%] -translate-x-1/2 rounded-[999px] blur-md md:block"
                    style={{ backgroundColor: `${result.color || "#FF7A00"}28` }}
                  />
                  <img
                    src={result.image}
                    alt={result.recommendedDrink}
                    className="relative z-10 max-h-[132px] w-auto object-contain drop-shadow-[0_18px_26px_rgba(87,45,0,0.16)] md:max-h-[292px] md:drop-shadow-[0_24px_40px_rgba(87,45,0,0.14)] lg:max-h-[332px] xl:max-h-[374px]"
                    onError={() => setResultImageHidden(true)}
                  />
                </div>
              ) : (
                <div className="relative z-10 flex h-[144px] w-[104px] items-end justify-center rounded-[1.45rem] bg-[linear-gradient(180deg,#f6dfc7_0%,#d49755_100%)] shadow-[0_16px_28px_rgba(140,81,24,0.16)] md:h-[332px] md:w-[228px] md:rounded-[2.3rem] md:border md:border-[#E7D2BF]/70 md:bg-[linear-gradient(180deg,rgba(255,252,247,0.92)_0%,rgba(247,237,227,0.98)_100%)] md:p-4 md:shadow-[0_28px_54px_rgba(89,53,17,0.12)] lg:h-[372px] lg:w-[248px] xl:h-[420px] xl:w-[278px]">
                  <div className="bg-white/50 absolute inset-x-2.5 top-2.5 h-4 rounded-full blur-md md:inset-x-4 md:top-4 md:h-6" />
                  <div className="border-white/70 absolute -top-3 left-1/2 h-7 w-[72%] -translate-x-1/2 rounded-full border-[3px] bg-[#f6d8b7] md:-top-5 md:h-10 md:border-[5px]" />
                  <span className="absolute inset-y-0 right-3 flex items-center text-[1.05rem] font-black tracking-[-0.08em] text-[#FF7A00] [writing-mode:vertical-rl] md:right-8 md:text-[2.3rem] xl:text-[2.8rem]">
                    DUNKIN'
                  </span>
                  <Coffee
                    className="text-white/70 absolute left-1/2 top-[41%] h-7 w-7 -translate-x-1/2 md:h-14 md:w-14"
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
          className="grid gap-2.5 md:gap-5 lg:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div
            className="rounded-[1.35rem] px-3.5 py-3.5 ring-1 ring-[#EADDCF] sm:rounded-[1.7rem] sm:px-6 sm:py-5"
            style={{
              background: `linear-gradient(180deg, rgba(255,248,242,0.92) 0%, ${
                result.accentColor || "#FFD9B8"
              }26 100%)`,
            }}
          >
            {isBenefitLoading ? (
              <div className="grid animate-pulse grid-cols-[60px_minmax(0,1fr)] items-start gap-3 md:grid-cols-[132px_minmax(0,1fr)] md:items-stretch md:gap-5 lg:grid-cols-[168px_minmax(0,1fr)] lg:gap-6">
                <div className="h-[60px] w-[60px] rounded-[1rem] bg-[linear-gradient(180deg,#FFF1E0_0%,#FFE3C3_100%)] md:h-full md:w-[132px] md:rounded-[1.35rem] lg:w-[168px] lg:rounded-[1.5rem]" />
                <div className="min-w-0 space-y-2 md:flex md:flex-col md:justify-center md:space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="h-6 w-32 rounded-full bg-[#FFE5CC]" />
                    <span className="h-6 w-20 rounded-full bg-[#FFD4B2]" />
                  </div>
                  <div className="h-5 w-[72%] rounded-full bg-white/80 sm:h-7" />
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded-full bg-white/75" />
                    <div className="h-4 w-[88%] rounded-full bg-white/70" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-[60px_minmax(0,1fr)] items-start gap-3 md:grid-cols-[132px_minmax(0,1fr)] md:items-stretch md:gap-5 lg:grid-cols-[168px_minmax(0,1fr)] lg:gap-6">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[1rem] bg-[#FFE6CF] text-[#FF7A00] md:h-full md:w-[132px] md:rounded-[1.35rem] md:bg-[linear-gradient(180deg,#FFF1E0_0%,#FFE3C3_100%)] md:p-3 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] lg:w-[168px] lg:rounded-[1.5rem]">
                  {!benefitIconHidden &&
                  (benefitData.imageUrl || result.benefitIcon) ? (
                    <img
                      src={benefitData.imageUrl || result.benefitIcon}
                      alt={benefitData.title}
                      className="h-full w-full object-contain md:rounded-[1rem] md:object-cover"
                      onError={() => setBenefitIconHidden(true)}
                    />
                  ) : (
                    <Gift className="h-6 w-6 md:h-12 md:w-12 lg:h-14 lg:w-14" strokeWidth={2} />
                  )}
                </div>
                <div className="min-w-0 space-y-2 md:flex md:flex-col md:justify-center md:space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-[#FFE5CC] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#C16A22]">
                      Recomendación para tu match
                    </span>
                    {benefitData.discountLabel ? (
                      <span className="inline-flex rounded-full bg-[#FF7A00] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white">
                        {benefitData.discountLabel}
                      </span>
                    ) : null}
                    {benefitData.priceLabel ? (
                      <span className="inline-flex rounded-full border border-[#E5CEBB] bg-white/75 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#7A5A45]">
                        {benefitData.priceLabel}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-[0.95rem] font-bold leading-5 text-[#4A281B] sm:text-xl md:text-[1.25rem] md:leading-7 lg:text-[1.55rem] lg:leading-8">
                    {benefitData.title}
                  </h3>
                  <p className="text-[0.8rem] leading-5 text-[#65594E] sm:text-base md:text-[0.97rem] md:leading-6 lg:max-w-[780px] lg:text-[1rem] lg:leading-7">
                    {benefitData.description}
                  </p>
                </div>
              </div>
            )}
          </div>
          <Button
            size="lg"
            onClick={handleClaimBenefit}
            disabled={isBenefitLoading}
            className="group relative w-full overflow-hidden rounded-full border border-[#D95816] bg-[linear-gradient(180deg,#FFB064_0%,#FF671F_50%,#DE4F0D_100%)] px-7 py-3 text-white shadow-[0_18px_30px_rgba(255,122,0,0.22)] ring-1 ring-[#FFF1E4]/80 disabled:cursor-wait disabled:opacity-75 lg:w-auto lg:self-center lg:px-8 lg:py-3.5"
          >
            <span className="pointer-events-none absolute inset-y-[12%] left-[-24%] w-[34%] rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.16)_28%,rgba(255,255,255,0.34)_48%,rgba(255,255,255,0)_72%)] blur-md transition-transform duration-500 group-hover:translate-x-[350%]" />
            {isBenefitLoading ? "Cargando recomendación..." : benefitData.cta}
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
            <div
              className="space-y-3 rounded-[1.35rem] border bg-[linear-gradient(180deg,#FFF8F2_0%,#FFF2E8_100%)] p-4 shadow-[0_18px_34px_rgba(89,53,17,0.06)] sm:p-5"
              style={{
                borderColor: `${result.accentColor || "#EADDCF"}7a`,
                background: `linear-gradient(180deg, #FFF8F2 0%, ${
                  result.accentColor || "#FFF2E8"
                }22 100%)`,
              }}
            >
              <div className="space-y-1.5">
                <h3 className="text-[1.05rem] font-black tracking-[-0.03em] text-[#4A281B] sm:text-[1.25rem]">
                  Compártelo con tu parche
                </h3>
                <p className="max-w-[620px] text-[0.84rem] leading-6 text-[#6B5B4F] sm:text-[0.96rem]">
                  Ya tienes tu match Dunkin. Compártelo y mira qué le sale a tu parche.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  size="lg"
                  onClick={handleShare}
                  className="group relative w-full overflow-hidden rounded-full border border-[#D95816] bg-[linear-gradient(180deg,#FFB064_0%,#FF671F_50%,#DE4F0D_100%)] py-4 text-base text-white shadow-[0_18px_30px_rgba(255,122,0,0.22)] ring-1 ring-[#FFF1E4]/80 sm:text-lg"
                >
                  <span className="pointer-events-none absolute inset-y-[12%] left-[-24%] w-[34%] rounded-full bg-[linear-gradient(115deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.16)_28%,rgba(255,255,255,0.34)_48%,rgba(255,255,255,0)_72%)] blur-md transition-transform duration-500 group-hover:translate-x-[350%]" />
                  Compartir mi resultado
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleCopyLink}
                  className="w-full rounded-full border-[#E8DCCF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF6ED_100%)] py-4 text-base text-[#4A281B] shadow-[0_10px_20px_rgba(89,53,17,0.06)] sm:text-lg"
                >
                  {copySuccess ? "Enlace copiado" : "Copiar enlace"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  resetQuiz();
                  router.push("/quiz");
                }}
                className="rounded-full border-[#E8DCCF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF6ED_100%)] py-4 text-lg text-[#4A281B] shadow-[0_10px_20px_rgba(89,53,17,0.06)]"
              >
                Volver al inicio
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={resetQuiz}
                className="rounded-full border-[#E8DCCF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF6ED_100%)] py-4 text-lg text-[#4A281B] shadow-[0_10px_20px_rgba(89,53,17,0.06)]"
              >
                Volver a intentar
              </Button>
            </div>
          </motion.div>
        )}
        <div className="hidden lg:flex lg:justify-end">
          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center rounded-full border border-[#E6C8B3] bg-[#FFF3E8]/95 px-4 py-2.5 text-[0.92rem] font-semibold text-[#4A281B] shadow-[0_12px_28px_rgba(102,66,30,0.08)] transition-colors hover:bg-[#FFF7F0]"
          >
            Volver arriba
          </button>
        </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleBackToTop}
        className={`fixed right-[calc(1rem+26px)] top-1/2 z-[120] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E6C8B3] bg-[#FFF7F0]/95 text-[#4A281B] shadow-[0_14px_34px_rgba(116,75,33,0.18)] transition-all duration-200 active:scale-[0.97] md:hidden ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-label="Subir al inicio del resultado"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}
