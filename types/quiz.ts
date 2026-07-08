// Tipos de datos para el quiz de Dunkin Colombia

// Tipo para una opción de respuesta
export interface QuizOption {
  id: string;
  label: string;
  emoji?: string;
  icon?: string;
  value: string | number;
}

// Tipo para una pregunta del quiz
export interface QuizQuestion {
  id: string;
  eyebrow?: string;
  question: string;
  supportingText?: string;
  image?: string;
  imageAlt?: string;
  accentColor?: string;
  decorativeColor?: string;
  options: QuizOption[];
}

// Tipo para el estado de respuesta del usuario
export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

// Tipo para los resultados del quiz
export interface QuizResult {
  id: string;
  personalityType: string;
  title: string;
  badge?: string;
  description: string;
  recommendedDrink: string;
  drinkDescription: string;
  benefit: string;
  image?: string;
  color?: string;
  accentColor?: string;
  benefitTitle?: string;
  benefitDescription?: string;
  benefitCta?: string;
  benefitIcon?: string;
}

// Tipo para los datos del formulario
export interface FormData {
  name: string;
  email: string;
  phone?: string;
  acceptDataProcessing: boolean;
  acceptPromotions: boolean;
}

// Tipo para un registro completo en Supabase
export interface QuizParticipant {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  accept_data_processing: boolean;
  accept_promotions: boolean;
  quiz_result: string;
  answers: QuizAnswer[];
  created_at?: string;
}
