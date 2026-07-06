// Preguntas de ejemplo para el quiz de Dunkin Colombia
// Estas podrían reemplazarse con datos de Supabase en el futuro
import { QuizQuestion } from "@/types/quiz";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "¿Cuál es tu bebida ideal para empezar el día?",
    options: [
      { id: "q1a1", label: "Café caliente y fuerte", emoji: "☕", value: "coffee_lover" },
      { id: "q1a2", label: "Bebida fría y energética", emoji: "🧊", value: "energetic" },
      { id: "q1a3", label: "Algo dulce y cremoso", emoji: "🍦", value: "sweet_lover" },
      { id: "q1a4", label: "Más bien un té", emoji: "🍵", value: "relaxed" },
    ],
  },
  {
    id: "q2",
    question: "¿Cómo te gusta disfrutar tu tiempo libre?",
    options: [
      { id: "q2a1", label: "Aventuras al aire libre", emoji: "🏃", value: "adventurous" },
      { id: "q2a2", label: "Relajándome en casa", emoji: "🏠", value: "homebody" },
      { id: "q2a3", label: "Reuniones con amigos", emoji: "🎉", value: "social" },
      { id: "q2a4", label: "Explorando nuevos lugares", emoji: "🌍", value: "explorer" },
    ],
  },
  {
    id: "q3",
    question: "¿Qué color representa tu personalidad?",
    options: [
      { id: "q3a1", label: "Naranja - Energía y creatividad", emoji: "🧡", value: "creative" },
      { id: "q3a2", label: "Rojo - Pasión y determinación", emoji: "❤️", value: "passionate" },
      { id: "q3a3", label: "Azul - Calma y equilibrio", emoji: "💙", value: "balanced" },
      { id: "q3a4", label: "Verde - Naturaleza y tranquilidad", emoji: "💚", value: "peaceful" },
    ],
  },
  {
    id: "q4",
    question: "¿Cuál es tu snack ideal para acompañar tu bebida?",
    options: [
      { id: "q4a1", label: "Donas glaseadas", emoji: "🍩", value: "traditional" },
      { id: "q4a2", label: "Algo salado", emoji: "🍟", value: "salty" },
      { id: "q4a3", label: "Frutas frescas", emoji: "🍓", value: "healthy" },
      { id: "q4a4", label: "Postres decadentes", emoji: "🍰", value: "indulgent" },
    ],
  },
];
