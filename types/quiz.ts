// Tipos de datos para el quiz de Dunkin Colombia

// Tipo para una opción de respuesta
export interface QuizOption {
  id: string;
  label: string;
  emoji?: string;
  value: string | number;
}

// Tipo para una pregunta del quiz
export interface QuizQuestion {
  id: string;
  question: string;
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
  description: string;
  recommendedDrink: string;
  drinkDescription: string;
  benefit: string;
  image?: string;
  color?: string;
}
