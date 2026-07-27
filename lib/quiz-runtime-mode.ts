export type QuizRuntimeMode = "preview" | "live";

function normalizeRuntimeMode(value: string | undefined) {
  return value?.trim().toLowerCase() || "";
}

export function getQuizRuntimeMode(): QuizRuntimeMode {
  const publicMode = normalizeRuntimeMode(
    process.env.NEXT_PUBLIC_QUIZ_RUNTIME_MODE
  );

  if (publicMode === "preview") {
    return "preview";
  }

  if (publicMode === "live") {
    return "live";
  }

  return "preview";
}

export function isQuizPreviewMode() {
  return getQuizRuntimeMode() === "preview";
}

export function isQuizPermissiveMode() {
  return process.env.NODE_ENV !== "production" || isQuizPreviewMode();
}
