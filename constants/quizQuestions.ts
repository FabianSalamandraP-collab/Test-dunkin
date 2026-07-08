// Preguntas de ejemplo para el quiz de Dunkin Colombia
// Estas podrían reemplazarse con datos de Supabase en el futuro
import { QuizQuestion, QuizResult } from "@/types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    eyebrow: "Pregunta 1 de 4",
    question:
      "Cuando tus amigos te dicen “¿vamos por algo de tomar?”, ¿tú eres el que…",
    supportingText:
      "Elige la respuesta que más se parece a tu forma natural de vivir el plan.",
    image: "/assets/quiz-questions/q1-drink.png",
    imageAlt: "Bebida helada para la pregunta 1",
    accentColor: "#FF7A00",
    decorativeColor: "#F6D8BF",
    options: [
      {
        id: "q1a1",
        label: "Propone probar algo nuevo",
        icon: "send",
        value: "creative",
      },
      {
        id: "q1a2",
        label: "Quiere sentarse y hablar un rato",
        icon: "messages-square",
        value: "balanced",
      },
      {
        id: "q1a3",
        label: "Busca el lugar más cool",
        icon: "map-pin",
        value: "passionate",
      },
      {
        id: "q1a4",
        label: "Dice “vamos a ver qué sale”",
        icon: "smile",
        value: "energetic",
      },
    ],
  },
  {
    id: "q2",
    eyebrow: "Pregunta 2 de 4",
    question:
      "Si pudieras regalarte una pausa perfecta en mitad del día, elegirías…",
    supportingText:
      "Piensa en ese momento que te recarga y te pone otra vez en tu mejor mood.",
    image: "/assets/quiz-questions/q2-drink.png",
    imageAlt: "Bebida cremosa para la pregunta 2",
    accentColor: "#FF9A3D",
    decorativeColor: "#F8E2CC",
    options: [
      {
        id: "q2a1",
        label: "Un plan con música y energía",
        icon: "music-4",
        value: "energetic",
      },
      {
        id: "q2a2",
        label: "Un café tranquilo para pensar",
        icon: "sparkles",
        value: "balanced",
      },
      {
        id: "q2a3",
        label: "Una salida espontánea",
        icon: "compass",
        value: "creative",
      },
      {
        id: "q2a4",
        label: "Un antojo dulce sin culpa",
        icon: "ice-cream-cone",
        value: "passionate",
      },
    ],
  },
  {
    id: "q3",
    eyebrow: "Pregunta 3 de 4",
    question: "¿Qué disfrutas más en tu tiempo libre?",
    supportingText:
      "No lo pienses tanto: marca lo que más te representa cuando el día se siente tuyo.",
    image: "/assets/quiz-questions/q3-drink.png",
    imageAlt: "Frozen coffee para la pregunta 3",
    accentColor: "#FF7A00",
    decorativeColor: "#FFE0B3",
    options: [
      {
        id: "q3a1",
        label: "Aprender algo nuevo",
        icon: "star",
        value: "creative",
      },
      {
        id: "q3a2",
        label: "Hablar con alguien sin afán",
        icon: "users",
        value: "balanced",
      },
      {
        id: "q3a3",
        label: "Buscar planes diferentes",
        icon: "compass",
        value: "energetic",
      },
      {
        id: "q3a4",
        label: "Salir a recorrer sin destino",
        icon: "trophy",
        value: "passionate",
      },
    ],
  },
  {
    id: "q4",
    eyebrow: "Pregunta 4 de 4",
    question: "¿Qué te gustaría que dijera de ti tu bebida ideal?",
    supportingText:
      "Tu respuesta nos ayuda a cerrar la mezcla entre personalidad, mood y bebida.",
    image: "/assets/quiz-questions/q4-drink.png",
    imageAlt: "Café caliente para la pregunta 4",
    accentColor: "#FF8A1E",
    decorativeColor: "#F6E7D6",
    options: [
      {
        id: "q4a1",
        label: "Que siempre sorprendes",
        icon: "sparkles",
        value: "creative",
      },
      {
        id: "q4a2",
        label: "Que transmites calma",
        icon: "sun-medium",
        value: "balanced",
      },
      {
        id: "q4a3",
        label: "Que eres pura actitud",
        icon: "flame",
        value: "passionate",
      },
      {
        id: "q4a4",
        label: "Que conviertes todo en plan",
        icon: "party-popper",
        value: "energetic",
      },
    ],
  },
];

export const QUIZ_RESULTS: QuizResult[] = [
  {
    id: "energetic",
    personalityType: "El Energético",
    badge: "Tu personalidad es",
    title: "EL IMPULSADOR",
    description:
      "Siempre estás buscando nuevas experiencias y vives el día sin quedarte en lo de siempre.",
    recommendedDrink: "Frozen Original",
    drinkDescription:
      "Intenso, refrescante y con la energía perfecta para acompañarte en cada plan.",
    benefit: "2x1 en bebidas frías",
    image: "/assets/quiz-results/frozen-original.png",
    color: "#FF7A00",
    accentColor: "#FFB066",
    benefitTitle: "Disfruta los beneficios vigentes en Dunkin'",
    benefitDescription:
      "Activa tu beneficio y úsalo con tu bebida favorita en la siguiente visita.",
    benefitCta: "Ver beneficio",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "creative",
    personalityType: "El Creativo",
    badge: "Tu personalidad es",
    title: "EL EXPLORADOR",
    description:
      "Tu curiosidad siempre te lleva un paso más allá. Te gusta descubrir sabores, ideas y planes distintos.",
    recommendedDrink: "Iced Latte",
    drinkDescription:
      "Suave, versátil y con el balance perfecto para acompañar tu lado creativo.",
    benefit: "Dona gratis con tu bebida",
    image: "/assets/quiz-results/iced-latte.png",
    color: "#D97706",
    accentColor: "#F3C087",
    benefitTitle: "Tu beneficio está listo para activarse",
    benefitDescription:
      "Completa la experiencia y desbloquea el beneficio asociado a tu resultado.",
    benefitCta: "Ver beneficio",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "balanced",
    personalityType: "El Equilibrado",
    badge: "Tu personalidad es",
    title: "EL SERENO",
    description:
      "Tienes una energía tranquila que hace que todo se sienta más simple, más rico y mejor acompañado.",
    recommendedDrink: "Refresher Mango Piña",
    drinkDescription:
      "Ligero, tropical y con una vibra fresca que combina con tu forma de vivir el día.",
    benefit: "20% de descuento en tu próxima visita",
    image: "/assets/quiz-results/refresher-mango-pina.png",
    color: "#3B82F6",
    accentColor: "#C9DDF8",
    benefitTitle: "Tu beneficio Dunkin' ya está disponible",
    benefitDescription:
      "Guárdalo y úsalo cuando quieras darte una pausa con tu bebida favorita.",
    benefitCta: "Ver beneficio",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
  {
    id: "passionate",
    personalityType: "El Apasionado",
    badge: "Tu personalidad es",
    title: "EL INTENSO",
    description:
      "Tu presencia se siente. Te gusta vivir con intención, con gusto y con planes que sí se disfrutan.",
    recommendedDrink: "Frutibatido",
    drinkDescription:
      "Cremoso, potente y con mucha personalidad. Una bebida que se roba la atención como tú.",
    benefit: "Regalo especial en tu próxima visita",
    image: "/assets/quiz-results/frutibatido.png",
    color: "#DC2626",
    accentColor: "#FFC27A",
    benefitTitle: "Tu beneficio especial te está esperando",
    benefitDescription:
      "Completa tus datos y descubre cómo reclamarlo dentro de la experiencia.",
    benefitCta: "Ver beneficio",
    benefitIcon: "/assets/quiz-benefits/gift-icon.png",
  },
];
