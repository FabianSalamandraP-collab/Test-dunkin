// Preguntas de ejemplo para el quiz de Dunkin Colombia
// Estas podrían reemplazarse con datos de Supabase en el futuro
import { QuizQuestion, QuizResult } from "@/types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    eyebrow: "Pregunta 1 de 4",
    question:
      'Si en el grupo escriben: "¿Quién arma el plan?" tú:',
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
        label: "En cinco minutos mandas opciones.",
        icon: "send",
        value: "creative",
      },
      {
        id: "q1a2",
        label: "Propones ir por un café.",
        icon: "messages-square",
        value: "balanced",
      },
      {
        id: "q1a3",
        label: "Respondes: ¡De una!",
        icon: "map-pin",
        value: "energetic",
      },
      {
        id: "q1a4",
        label: "Donde vayan todos allá llegas.",
        icon: "smile",
        value: "passionate",
      },
    ],
  },
  {
    id: "q2",
    eyebrow: "Pregunta 2 de 4",
    question: "Si el plan se complica. Tú:",
    questionHighlight: "plan se complica",
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
        label: "Primero preguntas qué pasó.",
        icon: "users",
        value: "balanced",
      },
      {
        id: "q2a3",
        label: "Propones otro plan.",
        icon: "compass",
        value: "energetic",
      },
      {
        id: "q2a4",
        label: "Solo te ríes de la situación.",
        icon: "sun-medium",
        value: "passionate",
      },
    ],
  },
  {
    id: "q3",
    eyebrow: "Pregunta 3 de 4",
    question: "Tu “cargo oficial” es:",
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
        label: "Embajador de buena energía.",
        icon: "music-4",
        value: "passionate",
      },
    ],
  },
  {
    id: "q4",
    eyebrow: "Pregunta 4 de 4",
    question: "La frase con la que más te identificas es:",
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
        label: '"Pero cuénteme bien qué pasó."',
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
        label: '"Tranqui, todo tiene solución."',
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
      "Tomas la iniciativa, resuelves rápido y casi siempre terminas armando el parche para que todo salga bien. Eres de los que le ponen energía y dirección al plan.",
    recommendedDrink: "Iced Latte",
    drinkDescription:
      "Suave, versátil y con actitud. Va con tu mood porque arranca fácil, acompaña bien cualquier parche y cae perfecto cuando te toca mover el plan.",
    benefit: "Productos y promociones oficiales para Iced Latte",
    image: "/assets/quiz-results/lifestyle/result-lifestyle-iced-latte.webp",
    mobileImageScale: 1.02,
    desktopImageScale: 1.04,
    desktopImageOffsetY: 0,
    color: "#D97706",
    accentColor: "#F3C087",
    benefitTitle: "Un plan oficial para tu mood",
    benefitDescription:
      "Consulta opciones oficiales vigentes para seguir tu match o compartir el plan con tu parche.",
    benefitCta: "Ver plan oficial",
    benefitIcon: "/assets/quiz-benefits/gift-icon.svg",
  },
  {
    id: "balanced",
    personalityType: "Cuidador Mentor",
    badge: "Tu personalidad es",
    title: "CUIDADOR MENTOR",
    description:
      "Escuchas, acompañas y entiendes antes de reaccionar. Eres esa persona que baja el ruido, sostiene al parche y le da sentido al momento.",
    recommendedDrink: "Ice Té",
    drinkDescription:
      "Profundo, equilibrado y con carácter. Es una bebida para tu mood tranquilo, de buena conversación y de esos parches que se disfrutan sin afán.",
    benefit: "Productos y promociones oficiales para Ice Té",
    image: "/assets/quiz-results/lifestyle/result-lifestyle-ice-te.webp",
    mobileImageScale: 1,
    desktopImageScale: 1.06,
    desktopImageOffsetY: 0,
    color: "#5A361F",
    accentColor: "#D8C1AF",
    benefitTitle: "Un plan oficial para tu mood",
    benefitDescription:
      "Consulta opciones oficiales vigentes para seguir tu match o compartir el plan con tu parche.",
    benefitCta: "Ver plan oficial",
    benefitIcon: "/assets/quiz-benefits/gift-icon.svg",
  },
  {
    id: "energetic",
    personalityType: "Explorador Aventurero",
    badge: "Tu personalidad es",
    title: "EXPLORADOR AVENTURERO",
    description:
      "Siempre traes una idea nueva. Propones, improvisas y encuentras plan incluso cuando todo cambia sobre la marcha. Contigo el parche siempre despega.",
    recommendedDrink: "Refresher Mango Piña",
    drinkDescription:
      "Refrescante, vibrante y tropical. Va con tu forma de ser porque le mete color al mood, prende el parche y acompaña esa energía que siempre llevas arriba.",
    benefit: "Productos y promociones oficiales para Refresher Mango Piña",
    image: "/assets/quiz-results/lifestyle/result-lifestyle-refresher-mango-pina.webp",
    mobileImageScale: 0.98,
    desktopImageScale: 1.08,
    desktopImageOffsetY: 0,
    color: "#FF9A1F",
    accentColor: "#FFD8A8",
    benefitTitle: "Un plan oficial para tu mood",
    benefitDescription:
      "Consulta opciones oficiales vigentes para seguir tu match o compartir el plan con tu parche.",
    benefitCta: "Ver plan oficial",
    benefitIcon: "/assets/quiz-benefits/gift-icon.svg",
  },
  {
    id: "passionate",
    personalityType: "Optimista",
    badge: "Tu personalidad es",
    title: "OPTIMISTA",
    description:
      "Le ves el lado bueno a todo y contagias una energía que hace que el grupo se relaje, se anime y disfrute más cuando cae contigo.",
    recommendedDrink: "Frutibatido",
    drinkDescription:
      "Fresco, alegre y lleno de buena vibra. Encaja con tu mood porque acompaña planes ligeros, suma al parche y se siente tan buena onda como tú.",
    benefit: "Productos y promociones oficiales para Frutibatido",
    image: "/assets/quiz-results/lifestyle/result-lifestyle-frutibatido.webp",
    mobileImageScale: 1,
    desktopImageScale: 1.05,
    desktopImageOffsetY: 0,
    color: "#E9539A",
    accentColor: "#FFC27A",
    benefitTitle: "Un plan oficial para tu mood",
    benefitDescription:
      "Consulta opciones oficiales vigentes para seguir tu match o compartir el plan con tu parche.",
    benefitCta: "Ver plan oficial",
    benefitIcon: "/assets/quiz-benefits/gift-icon.svg",
  },
];
