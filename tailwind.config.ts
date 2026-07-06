import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // =====================================================
    // 1. PALETA DE COLORES OFICIALES DE DUNKIN
    // =====================================================
    colors: {
      primary: {
        50: "#FFF7F0",
        100: "#FFEBD8",
        200: "#FFD3AD",
        300: "#FFB575",
        400: "#FF8F3A",
        500: "#FF671F", // Dunkin' Orange (Principal)
        600: "#F04A07",
        700: "#C73807",
        800: "#9E2E0E",
        900: "#80290F",
        950: "#451106",
      },
      secondary: {
        50: "#FFECEC",
        100: "#FFD9D9",
        200: "#FFB8B8",
        300: "#FF8888",
        400: "#FF5454",
        500: "#FF2D2D", // Dunkin' Red (Secundario)
        600: "#F21414",
        700: "#CC0D0D",
        800: "#A50E0E",
        900: "#881212",
        950: "#4B0404",
      },
      dunkin: {
        orange: "#FF671F", // Dunkin' Orange (Official)
        red: "#FF2D2D", // Dunkin' Red (Official)
        brown: "#8B4513", // Coffee Brown (Accent)
        cream: "#FFF5E6", // Cream White
        white: "#FFFFFF",
        black: "#222222",
      },
      neutral: {
        50: "#F8F8F8",
        100: "#F0F0F0",
        200: "#E6E6E6",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#3F3F3F",
        800: "#262626",
        900: "#171717",
        950: "#0A0A0A",
      },
      background: "var(--background)",
      foreground: "var(--foreground)",
    },

    // =====================================================
    // 2. TIPOGRAFÍA
    // =====================================================
    fontFamily: {
      sans: [
        "var(--font-inter)",
        "system-ui",
        "sans-serif",
      ],
      display: [
        "var(--font-display)",
        "system-ui",
        "sans-serif",
      ],
    },

    fontSize: {
      xs: ["0.75rem", { lineHeight: "1.25rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.75rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "2rem" }],
      "2xl": ["1.5rem", { lineHeight: "2.25rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.5rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.75rem" }],
      "5xl": ["3rem", { lineHeight: "3.5rem" }],
      "6xl": ["3.75rem", { lineHeight: "4.25rem" }],
      "7xl": ["4.5rem", { lineHeight: "5rem" }],
      "8xl": ["6rem", { lineHeight: "6.5rem" }],
      "9xl": ["8rem", { lineHeight: "8.5rem" }],
    },

    // =====================================================
    // 3. ESPACIADOS (Mobile First)
    // =====================================================
    spacing: {
      0: "0px",
      px: "1px",
      0.5: "0.125rem",
      1: "0.25rem",
      1.5: "0.375rem",
      2: "0.5rem",
      2.5: "0.625rem",
      3: "0.75rem",
      3.5: "0.875rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      9: "2.25rem",
      10: "2.5rem",
      11: "2.75rem",
      12: "3rem",
      14: "3.5rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
      28: "7rem",
      32: "8rem",
      36: "9rem",
      40: "10rem",
      44: "11rem",
      48: "12rem",
      52: "13rem",
      56: "14rem",
      60: "15rem",
      64: "16rem",
      72: "18rem",
      80: "20rem",
      96: "24rem",
    },

    // =====================================================
    // 4. BORDER RADIUS
    // =====================================================
    borderRadius: {
      none: "0px",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      full: "9999px",
    },

    // =====================================================
    // 5. ELEVACIONES (Sombras suaves)
    // =====================================================
    boxShadow: {
      none: "none",
      sm: "0 1px 2px 0px rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
      soft: "0 2px 8px 0px rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
      card: "0 4px 20px 0px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
    },

    // =====================================================
    // 6. BREAKPOINTS (Mobile First)
    // =====================================================
    screens: {
      xs: "360px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    // =====================================================
    // 7. TAMAÑOS
    // =====================================================
    minWidth: {
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
    },
    maxWidth: {
      xs: "20rem",
      sm: "24rem",
      md: "28rem",
      lg: "32rem",
      xl: "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      "5xl": "64rem",
      "6xl": "72rem",
      "7xl": "80rem",
      "8xl": "96rem",
    },

    // =====================================================
    // 8. OTRAS UTILIDADES
    // =====================================================
    extend: {
      aspectRatio: {
        "4/5": "4 / 5",
        "5/4": "5 / 4",
        "16/10": "16 / 10",
      },
    },
  },

  // =====================================================
  // 9. PLUGINS
  // =====================================================
  plugins: [],
};

export default config;
