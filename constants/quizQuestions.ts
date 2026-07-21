// Preguntas de ejemplo para el quiz de Dunkin Colombia
// Estas podrían reemplazarse con datos de Supabase en el futuro
import { QuizQuestion, QuizResult } from "@/types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    eyebrow: "Pregunta 1 de 4",
    question:
      'Si hoy tu grupo de amigos escribe: "¿Quién arma el plan?", ¿qué haces?',
    questionHighlight: '"¿Quién arma el plan?"',
    supportingText:
      "Elige la respuesta que más se parece a tu forma natural de moverte con tu parche.",
    image: "/assets/quiz-questions/q1-drink.webp",
    imageAlt: "Bebida para la pregunta 1",
    mobileImageScale: 0.88,
    accentColor: "#FF7A00",
    decorativeColor: "#F6D8BF",
    options: [
      {
        id: "q1a1",
        label: "Empiezo a buscar opciones y organizo todo para que salga bien.",
        icon: "send",
        value: "creative",
      },
      {
        id: "q1a2",
        label: "Propongo un café para hablar tranquilos y ponernos al día.",
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
        label: "Lo importante es pasarla bien. Donde estén todos, ahí estoy.",
        icon: "smile",
        value: "passionate",
      },
    ],
  },
  {
    id: "q2",
    eyebrow: "Pregunta 2 de 4",
    question: "Cuando aparece un problema inesperado, normalmente...",
    questionHighlight: "problema inesperado",
    supportingText:
      "Piensa en cómo reaccionas de verdad cuando toca resolver algo en el momento.",
    image: "/assets/quiz-questions/q2-drink.webp",
    imageAlt: "Bebida para la pregunta 2",
    mobileImageScale: 0.86,
    accentColor: "#FF9A3D",
    decorativeColor: "#F8E2CC",
    options: [
      {
        id: "q2a1",
        label: "Busco la solución sin darle muchas vueltas.",
        icon: "sparkles",
        value: "creative",
      },
      {
        id: "q2a2",
        label: "Escucho primero antes de opinar.",
        icon: "users",
        value: "balanced",
      },
      {
        id: "q2a3",
        label: "Improviso y encuentro otra forma de hacerlo.",
        icon: "compass",
        value: "energetic",
      },
      {
        id: "q2a4",
        label: "Trato de mantener el buen ánimo porque todo tiene solución.",
        icon: "sun-medium",
        value: "passionate",
      },
    ],
  },
  {
    id: "q3",
    eyebrow: "Pregunta 3 de 4",
    question: "Tus amigos dirían que eres la persona que...",
    questionHighlight: "la persona que...",
    supportingText:
      "Escoge la opción que más te describa cuando estás con tu grupo cercano.",
    image: "/assets/quiz-questions/q3-drink.webp",
    imageAlt: "Bebida para la pregunta 3",
    mobileImageScale: 0.88,
    accentColor: "#FF7A00",
    decorativeColor: "#FFE0B3",
    options: [
      {
        id: "q3a1",
        label: "Siempre encuentra la forma de resolver cualquier situación.",
        icon: "star",
        value: "creative",
      },
      {
        id: "q3a2",
        label: "Da los mejores consejos y sabe escuchar.",
        icon: "messages-square",
        value: "balanced",
      },
      {
        id: "q3a3",
        label: "Nunca deja que falten planes o aventuras.",
        icon: "party-popper",
        value: "energetic",
      },
      {
        id: "q3a4",
        label: "Hace que cualquier momento sea más divertido.",
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
    mobileImageScale: 0.87,
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
        label: '"Cuénteme una cosa..."',
        icon: "messages-square",
        value: "balanced",
      },
      {
        id: "q4a3",
        label: '"Vamos y en el camino resolvemos."',
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
    personalityType: "El Curioso",
    badge: "Tu personalidad es",
    title: "EL CURIOSO",
    description:
      "Te mueves con iniciativa, te gusta resolver y casi siempre terminas organizando para que el plan salga bien.",
    recommendedDrink: "Iced Latte",
    drinkDescription:
      "Versátil, suave y con actitud. Una bebida que acompaña tu energía práctica sin perder estilo.",
    benefit: "Productos y promociones oficiales para Iced Latte",
    image: "/assets/quiz-results/iced-latte.webp",
    mobileImageScale: 0.92,
    color: "#D97706",
    accentColor: "#F3C087",
    benefitTitle: "Opciones oficiales para tu bebida",
    benefitDescription:
      "Al finalizar te mostramos productos, combos y promociones vigentes relacionadas con tu Iced Latte.",
    benefitCta: "Ver opciones oficiales",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "balanced",
    personalityType: "El Mentor",
    badge: "Tu personalidad es",
    title: "EL MENTOR",
    description:
      "Tienes esa capacidad de escuchar, acompañar y dar calma. Eres de quienes convierten una conversación en un buen momento.",
    recommendedDrink: "Ice Té",
    drinkDescription:
      "Profundo, equilibrado y perfecto para una pausa con buena conversación. Va contigo porque no necesita exagerar para destacar.",
    benefit: "Productos y promociones oficiales para Ice Té",
    image: "/assets/quiz-results/iced-tea.webp",
    mobileImageScale: 0.9,
    color: "#5A361F",
    accentColor: "#D8C1AF",
    benefitTitle: "Opciones oficiales para tu bebida",
    benefitDescription:
      "Al finalizar te mostramos productos, combos y promociones vigentes relacionadas con tu Ice Té.",
    benefitCta: "Ver opciones oficiales",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "energetic",
    personalityType: "El Aventurero",
    badge: "Tu personalidad es",
    title: "EL AVENTURERO",
    description:
      "Siempre aparece una idea contigo. Eres de los que propone, improvisa y encuentra el parche incluso en el camino.",
    recommendedDrink: "Refresher Mango Piña",
    drinkDescription:
      "Refrescante, vibrante y con un toque tropical que invita a salir del plan de siempre. Así de aventurero como tú.",
    benefit: "Productos y promociones oficiales para Refresher Mango Piña",
    image: "/assets/quiz-results/refresher-mango-pina.webp",
    mobileImageScale: 0.88,
    color: "#FF9A1F",
    accentColor: "#FFD8A8",
    benefitTitle: "Opciones oficiales para tu bebida",
    benefitDescription:
      "Al finalizar te mostramos productos, combos y promociones vigentes relacionadas con tu Refresher Mango Piña.",
    benefitCta: "Ver opciones oficiales",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "passionate",
    personalityType: "La Influencer",
    badge: "Tu personalidad es",
    title: "LA INFLUENCER",
    description:
      "Tienes la capacidad de levantar el ánimo del grupo y hacer que cualquier plan se sienta más liviano y divertido.",
    recommendedDrink: "Frutibatido de Mora",
    drinkDescription:
      "Fresco, alegre y con mucha vibra. Una bebida que encaja con tu forma de contagiar buena energía.",
    benefit: "Productos y promociones oficiales para Frutibatido de Mora",
    image: "/assets/quiz-results/frutibatido.webp",
    mobileImageScale: 0.9,
    color: "#E9539A",
    accentColor: "#FFC27A",
    benefitTitle: "Opciones oficiales para tu bebida",
    benefitDescription:
      "Al finalizar te mostramos productos, combos y promociones vigentes relacionadas con tu Frutibatido de Mora.",
    benefitCta: "Ver opciones oficiales",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
];
