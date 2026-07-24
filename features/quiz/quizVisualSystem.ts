export const quizTypography = {
  eyebrow:
    "font-sans text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[#8D7768] sm:text-[0.78rem]",
  sectionLabel:
    "font-sans text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[#A28673] sm:text-[0.76rem]",
  matchBadge:
    "font-sans text-[0.72rem] font-medium uppercase tracking-[0.18em] sm:text-[0.78rem]",
  displayTitle:
    "font-display font-extrabold tracking-[-0.06em] text-[#17120F] leading-[0.9] text-[2rem] sm:text-[2.7rem] lg:text-[3.5rem] xl:text-[4.1rem]",
  drinkHeroTitle:
    "font-display font-extrabold tracking-[-0.06em] text-[#17120F] leading-[0.88] text-[2.35rem] sm:text-[3.15rem] lg:text-[3.85rem] xl:text-[4.5rem]",
  personalityTitle:
    "font-display font-extrabold tracking-[-0.055em] text-[#2A1D17] leading-[0.92] text-[1.25rem] sm:text-[1.5rem] lg:text-[1.65rem]",
  questionTitle:
    "font-display font-extrabold tracking-[-0.055em] text-[#17120F] leading-[0.94] text-[1.8rem] sm:text-[2.5rem] lg:text-[3.25rem] xl:text-[3.8rem]",
  supporting:
    "font-sans text-[0.95rem] font-medium leading-7 text-[#5D5047] sm:text-[1rem] lg:text-[1.05rem]",
  supportingCompact:
    "font-sans text-[0.9rem] font-medium leading-[1.65] text-[#5D5047] sm:text-[0.95rem] sm:leading-7 lg:text-[1rem]",
  optionLabel:
    "font-sans text-[0.95rem] font-medium tracking-[-0.02em] leading-6 sm:text-[1rem] lg:text-[1.02rem]",
  drinkName:
    "font-display font-extrabold tracking-[-0.055em] text-[#2A1D17] leading-[0.92] text-[1.6rem] sm:text-[2.3rem] lg:text-[2.9rem]",
  chip: "font-sans text-[0.72rem] font-medium uppercase tracking-[0.16em] sm:text-[0.76rem]",
};

export const quizPanelClass =
  "rounded-[1.6rem] border border-white/70 bg-white/68 shadow-[0_24px_50px_rgba(89,53,17,0.08)] backdrop-blur-[6px]";

export const quizOptionThemes: Record<
  string,
  {
    accent: string;
    border: string;
    soft: string;
    text: string;
    glow: string;
  }
> = {
  creative: {
    accent: "#D5A064",
    border: "rgba(213,160,100,0.34)",
    soft: "rgba(244,227,205,0.86)",
    text: "#6E4C2E",
    glow: "rgba(213,160,100,0.22)",
  },
  balanced: {
    accent: "#5A361F",
    border: "rgba(90,54,31,0.28)",
    soft: "rgba(223,211,201,0.88)",
    text: "#4C2B18",
    glow: "rgba(90,54,31,0.2)",
  },
  energetic: {
    accent: "#F2B11B",
    border: "rgba(242,177,27,0.34)",
    soft: "rgba(255,241,198,0.86)",
    text: "#7B5314",
    glow: "rgba(242,177,27,0.24)",
  },
  passionate: {
    accent: "#E9539A",
    border: "rgba(233,83,154,0.3)",
    soft: "rgba(255,222,236,0.88)",
    text: "#8B2F5D",
    glow: "rgba(233,83,154,0.2)",
  },
};

export const resultTraitMap: Record<string, string[]> = {
  creative: ["Curioso", "Resolutivo", "Lanzado"],
  balanced: ["Empático", "Tranquilo", "Guía"],
  energetic: ["Explorador", "Espontáneo", "Líder"],
  passionate: ["Optimista", "Ligero", "Social"],
};
