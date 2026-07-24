// Preguntas de ejemplo para el quiz de Dunkin Colombia
// Estas podrían reemplazarse con datos de Supabase en el futuro
import { QuizQuestion, QuizResult } from "@/types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    eyebrow: "Pregunta 1 de 4",
    question:
      'Si en el grupo escriben: "¿Quién arma el plan?" tu...',
    questionHighlight: '"¿Quién arma el plan?"',
    supportingText:
      "Elige la respuesta que más se parece a tu forma natural de moverte con tu parche.",
    image: "/assets/quiz-questions/q1-drink.webp",
    imageAlt: "Bebida para la pregunta 1",
    mobileImageScale: 0.98,
    accentColor: "#FF7A00",
    decorativeColor: "#F6D8BF",
    options: [
      {
        id: "q1a1",
        label:
          "En cinco minutos mandas opciones, ubicación y hasta horario.",
        icon: "send",
        value: "creative",
      },
      {
        id: "q1a2",
        label: "Propones ir por un café y una buena conversación.",
        icon: "messages-square",
        value: "balanced",
      },
      {
        id: "q1a3",
        label: 'Respondo: "¡De una! Yo conozco un parche buenísimo."',
        icon: "map-pin",
        value: "energetic",
      },
      {
        id: "q1a4",
        label:
          "Donde vayan todos... allá llegas. Tú solo quieres pasarla bien.",
        icon: "smile",
        value: "passionate",
      },
    ],
  },
  {
    id: "q2",
    eyebrow: "Pregunta 2 de 4",
    question: "El plan se complica a última hora. Tú...",
    questionHighlight: "se complica a última hora",
    supportingText:
      "Piensa en cómo reaccionas de verdad cuando el parche cambia de rumbo sin aviso.",
    image: "/assets/quiz-questions/q2-drink.webp",
    imageAlt: "Bebida para la pregunta 2",
    mobileImageScale: 0.96,
    accentColor: "#FF9A3D",
    decorativeColor: "#F8E2CC",
    options: [
      {
        id: "q2a1",
        label: "Buscas cómo salvar el día.",
        icon: "sparkles",
        value: "creative",
      },
      {
        id: "q2a2",
        label: "Preguntas qué pasó antes de sacar conclusiones.",
        icon: "users",
        value: "balanced",
      },
      {
        id: "q2a3",
        label: "Propones otro plan y sigues como si nada.",
        icon: "compass",
        value: "energetic",
      },
      {
        id: "q2a4",
        label: "Te ríes de la situación. Al final siempre sale algo bueno.",
        icon: "sun-medium",
        value: "passionate",
      },
    ],
  },
  {
    id: "q3",
    eyebrow: "Pregunta 3 de 4",
    question: "Tu “cargo oficial” en tu grupo de amigos es:",
    questionHighlight: "cargo oficial",
    supportingText:
      "Escoge el rol que más se parece a ti cuando el parche se junta.",
    image: "/assets/quiz-questions/q3-drink.webp",
    imageAlt: "Bebida para la pregunta 3",
    mobileImageScale: 0.98,
    accentColor: "#FF7A00",
    decorativeColor: "#FFE0B3",
    options: [
      {
        id: "q3a1",
        label: "Solucionador de crisis.",
        icon: "star",
        value: "creative",
      },
      {
        id: "q3a2",
        label: "Consejero de confianza.",
        icon: "messages-square",
        value: "balanced",
      },
      {
        id: "q3a3",
        label: "Director de planes.",
        icon: "party-popper",
        value: "energetic",
      },
      {
        id: "q3a4",
        label: "Embajador de la buena energía.",
        icon: "music-4",
        value: "passionate",
      },
    ],
  },
  {
    id: "q4",
    eyebrow: "Pregunta 4 de 4",
    question: "Elige la frase con la que más te identificas.",
    questionHighlight: "más te identificas",
    supportingText:
      "No lo pienses mucho. Marca la frase que más se parece a tu forma de ser.",
    image: "/assets/quiz-questions/q4-drink.webp",
    imageAlt: "Bebida para la pregunta 4",
    mobileImageScale: 0.97,
    accentColor: "#FF8A1E",
    decorativeColor: "#F6E7D6",
    options: [
      {
        id: "q4a1",
        label: '"Hágale, eso sale."',
        icon: "flame",
        value: "creative",
      },
      {
        id: "q4a2",
        label: '"Primero cuénteme bien qué pasó."',
        icon: "messages-square",
        value: "balanced",
      },
      {
        id: "q4a3",
        label: '"Vamos y ahí vemos qué pasa."',
        icon: "compass",
        value: "energetic",
      },
      {
        id: "q4a4",
        label: '"Todo tiene solución."',
        icon: "smile",
        value: "passionate",
      },
    ],
  },
];

export const QUIZ_RESULTS: QuizResult[] = [
  {
    id: "creative",
    personalityType: "Curioso Aventurero",
    badge: "Tu personalidad es",
    title: "CURIOSO AVENTURERO",
    description:
      "Tomas la iniciativa, resuelves rápido y casi siempre terminas armando el parche para que todo salga bien.",
    recommendedDrink: "Iced Latte",
    drinkDescription:
      "Suave, versátil y con actitud. Va contigo porque mezcla iniciativa, curiosidad y una energía lista para arrancar el plan.",
    benefit: "Productos y promociones oficiales para Iced Latte",
    image: "/assets/quiz-results/lifestyle/result-lifestyle-iced-latte.png",
    mobileImageScale: 1.02,
    desktopImageScale: 1.04,
    desktopImageOffsetY: 0,
    color: "#D97706",
    accentColor: "#F3C087",
    benefitTitle: "Opciones oficiales para tu bebida",
    benefitDescription:
      "Consulta opciones oficiales vigentes para tu Iced Latte.",
    benefitCta: "Ver opciones oficiales",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "balanced",
    personalityType: "Cuidador Mentor",
    badge: "Tu personalidad es",
    title: "CUIDADOR MENTOR",
    description:
      "Escuchas, acompañas y entiendes antes de reaccionar. Eres esa persona que baja el ruido y le da sentido al momento.",
    recommendedDrink: "Ice Té",
    drinkDescription:
      "Profundo, equilibrado y con carácter. Una bebida ideal para quienes prefieren la calma, la conversación y las decisiones con cabeza fría.",
    benefit: "Productos y promociones oficiales para Ice Té",
    image: "/assets/quiz-results/lifestyle/result-lifestyle-ice-te.png",
    mobileImageScale: 1,
    desktopImageScale: 1.06,
    desktopImageOffsetY: 0,
    color: "#5A361F",
    accentColor: "#D8C1AF",
    benefitTitle: "Opciones oficiales para tu bebida",
    benefitDescription:
      "Consulta opciones oficiales vigentes para tu Ice Té.",
    benefitCta: "Ver opciones oficiales",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "energetic",
    personalityType: "Explorador Aventurero",
    badge: "Tu personalidad es",
    title: "EXPLORADOR AVENTURERO",
    description:
      "Siempre traes una idea nueva. Propones, improvisas y encuentras plan incluso cuando todo cambia sobre la marcha.",
    recommendedDrink: "Refresher Mango Piña",
    drinkDescription:
      "Refrescante, vibrante y tropical. Va con tu forma de lanzarte a lo nuevo sin perder el impulso del parche.",
    benefit: "Productos y promociones oficiales para Refresher Mango Piña",
    image: "/assets/quiz-results/lifestyle/result-lifestyle-refresher-mango-pina.png",
    mobileImageScale: 0.98,
    desktopImageScale: 1.08,
    desktopImageOffsetY: 0,
    color: "#FF9A1F",
    accentColor: "#FFD8A8",
    benefitTitle: "Opciones oficiales para tu bebida",
    benefitDescription:
      "Consulta opciones oficiales vigentes para tu Refresher Mango Piña.",
    benefitCta: "Ver opciones oficiales",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "passionate",
    personalityType: "Optimista",
    badge: "Tu personalidad es",
    title: "OPTIMISTA",
    description:
      "Le ves el lado bueno a todo y contagias una energía que hace que el grupo se relaje y disfrute más.",
    recommendedDrink: "Frutibatido",
    drinkDescription:
      "Fresco, alegre y lleno de buena vibra. Encaja contigo porque siempre llegas con actitud ligera y ganas de pasarla bien.",
    benefit: "Productos y promociones oficiales para Frutibatido",
    image: "/assets/quiz-results/lifestyle/result-lifestyle-frutibatido.png",
    mobileImageScale: 1,
    desktopImageScale: 1.05,
    desktopImageOffsetY: 0,
    color: "#E9539A",
    accentColor: "#FFC27A",
    benefitTitle: "Opciones oficiales para tu bebida",
    benefitDescription:
      "Consulta opciones oficiales vigentes para tu Frutibatido.",
    benefitCta: "Ver opciones oficiales",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
];
