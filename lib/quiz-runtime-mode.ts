const PREVIEW_RUNTIME_MODE = "preview";
const LIVE_RUNTIME_MODE = "live";

function normalizeRuntimeMode(value: string | undefined) {
  return value?.trim().toLowerCase() || "";
}

export function getQuizRuntimeMode() {
  const publicMode = normalizeRuntimeMode(
    process.env.NEXT_PUBLIC_QUIZ_RUNTIME_MODE
  );

  if (publicMode === PREVIEW_RUNTIME_MODE) {
    return PREVIEW_RUNTIME_MODE as const;
  }

  if (publicMode === LIVE_RUNTIME_MODE) {
    return LIVE_RUNTIME_MODE as const;
  }

  // Safe default for handoff and QA environments: without an explicit public
  // mode, the quiz should allow a full preview flow without writing data.
  return PREVIEW_RUNTIME_MODE as const;
}

export function isQuizPreviewMode() {
  return getQuizRuntimeMode() === PREVIEW_RUNTIME_MODE;
}

export function isQuizPermissiveMode() {
  return process.env.NODE_ENV !== "production" || isQuizPreviewMode();
}
