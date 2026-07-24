const baseUrl = process.env.QUIZ_API_BASE_URL || "http://localhost:3000";

async function postJson(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `[${response.status}] ${path} -> ${payload?.error || payload?.message || "Error desconocido"}`
    );
  }

  return payload;
}

function logStep(title, data) {
  console.log(`\n[ok] ${title}`);
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  console.log(`Probando tracking local contra ${baseUrl}`);

  const startPayload = {
    deviceType: "desktop",
    browserName: "chrome",
    osName: "windows",
    language: "es-CO",
    screenWidth: 1440,
    screenHeight: 900,
    referrer: "http://localhost:3000/",
    utmSource: "local",
    utmMedium: "script",
    utmCampaign: "quiz-tracking-smoke",
  };

  const start = await postJson("/api/quiz/session/start", startPayload);
  const sessionId = start.sessionId;
  logStep("Sesion iniciada", start);

  const answers = [
    {
      questionKey: "q1",
      questionOrder: 1,
      selectedOptionKey: "q1a1",
      selectedOptionLabel:
        "En cinco minutos mandas opciones, ubicación y hasta horario.",
      selectedValue: "creative",
    },
    {
      questionKey: "q2",
      questionOrder: 2,
      selectedOptionKey: "q2a1",
      selectedOptionLabel: "Buscas cómo salvar el día.",
      selectedValue: "creative",
    },
    {
      questionKey: "q3",
      questionOrder: 3,
      selectedOptionKey: "q3a1",
      selectedOptionLabel: "Solucionador de crisis.",
      selectedValue: "creative",
    },
    {
      questionKey: "q4",
      questionOrder: 4,
      selectedOptionKey: "q4a1",
      selectedOptionLabel: '"Hágale, eso sale."',
      selectedValue: "creative",
    },
  ];

  for (const answer of answers) {
    const response = await postJson("/api/quiz/session/answer", {
      sessionId,
      browserName: "chrome",
      deviceType: "desktop",
      ...answer,
    });
    logStep(`Respuesta registrada ${answer.questionKey}`, response);
  }

  const completed = await postJson("/api/quiz/session/complete", {
    sessionId,
    personalityKey: "creative",
    personalityLabel: "Curioso Aventurero",
    recommendedDrinkKey: "iced-latte",
    recommendedDrinkLabel: "Iced Latte",
    score: 4,
    totalDurationSeconds: 51,
    browserName: "chrome",
    deviceType: "desktop",
  });
  logStep("Sesion completada", completed);

  const form = await postJson("/api/quiz/form/submit", {
    sessionId,
    fullName: "Prueba Local Tracking",
    email: `tracking+${Date.now()}@example.com`,
    phone: "+57 300 000 0000",
    acceptDataProcessing: true,
    acceptPromotions: true,
    browserName: "chrome",
    deviceType: "desktop",
  });
  logStep("Formulario registrado", form);

  const click = await postJson("/api/quiz/event/view-in-dunkin", {
    sessionId,
    browserName: "chrome",
    deviceType: "desktop",
    targetUrl: "https://www.dunkincolombia.com/pedir",
  });
  logStep("Click final registrado", click);

  console.log("\nSmoke test completado correctamente.");
}

main().catch((error) => {
  console.error("\nSmoke test fallido.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
