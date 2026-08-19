import { QUIZ_RESULTS } from "@/constants/quizQuestions";
import type {
  DashboardChartDatum,
  DashboardChartsPayload,
  DashboardDataPayload,
  DashboardEventRecord,
  DashboardFilters,
  DashboardFilterOptions,
  DashboardParticipantRow,
  DashboardSessionRecord,
  DashboardSummaryMetrics,
  DashboardTablePayload,
  DashboardTimeSeriesDatum,
} from "@/lib/admin-dashboard-types";

export function normalizeText(value: string | null | undefined) {
  return value?.trim() || null;
}

export function buildEmptyDashboardData(
  filters: DashboardFilters
): DashboardDataPayload {
  const emptyChart: DashboardChartDatum[] = [];
  const emptyTimeSeries: DashboardTimeSeriesDatum[] = [];
  const summary: DashboardSummaryMetrics = {
    totalParticipants: 0,
    completedTests: 0,
    submittedForms: 0,
    conversionRate: 0,
    averageDurationSeconds: null,
    abandonmentRate: 0,
    viewInDunkinClicks: 0,
    viewInDunkinCtr: 0,
    topClickedDrink: {
      drinkKey: null,
      drinkLabel: null,
      clicks: 0,
    },
  };
  const charts: DashboardChartsPayload = {
    byDrink: emptyChart,
    byPersonality: emptyChart,
    byDevice: emptyChart,
    byBrowser: emptyChart,
    byTrafficSource: emptyChart,
    byClickedDrink: emptyChart,
    clicksByDevice: emptyChart,
    clicksByCampaign: emptyChart,
    clicksByTrafficSource: emptyChart,
    byAbandonQuestion: emptyChart,
    participationByDay: emptyTimeSeries,
    participationByHour: emptyTimeSeries,
  };
  const filterOptions: DashboardFilterOptions = {
    drinks: [],
    personalities: [],
    devices: [],
    trafficSources: [],
  };
  const table: DashboardTablePayload = {
    rows: [],
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      totalItems: 0,
      totalPages: 0,
    },
  };

  return {
    summary,
    charts,
    table,
    filterOptions,
    appliedFilters: filters,
  };
}

export function getTrafficSourceLabel(session: DashboardSessionRecord) {
  const utmSource = normalizeText(session.utm_source);

  if (utmSource) {
    return utmSource;
  }

  const referrer = normalizeText(session.referrer);

  if (!referrer) {
    return "directo";
  }

  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "referido";
  }
}

export function matchesTrafficSource(
  session: DashboardSessionRecord,
  trafficSource: string | null
) {
  if (!trafficSource) {
    return true;
  }

  return getTrafficSourceLabel(session) === trafficSource;
}

function getEventMetadata(event: DashboardEventRecord) {
  if (!event.metadata || typeof event.metadata !== "object") {
    return {};
  }

  return event.metadata;
}

function getEventMetadataText(event: DashboardEventRecord, key: string) {
  const value = getEventMetadata(event)[key];
  return typeof value === "string" ? normalizeText(value) : null;
}

export function getClickTrafficSourceLabel(event: DashboardEventRecord) {
  const utmSource = getEventMetadataText(event, "utmSource");

  if (utmSource) {
    return utmSource;
  }

  const referrer = getEventMetadataText(event, "referrer");

  if (!referrer) {
    return "directo";
  }

  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "referido";
  }
}

export function getClickCampaignLabel(event: DashboardEventRecord) {
  return getEventMetadataText(event, "utmCampaign") || "sin-campana";
}

export function buildClickEvents(events: DashboardEventRecord[]) {
  return events.filter(
    (event) => event.event_type === "view_in_dunkin_clicked"
  );
}

export function getDateRange(filters: DashboardFilters) {
  const start = filters.startDate
    ? new Date(`${filters.startDate}T00:00:00.000Z`)
    : null;
  const end = filters.endDate
    ? new Date(`${filters.endDate}T23:59:59.999Z`)
    : null;

  return {
    startIso: start?.toISOString() ?? null,
    endIso: end?.toISOString() ?? null,
  };
}

function mapCountsToChartData(
  counts: Map<string, { label: string; value: number }>
): DashboardChartDatum[] {
  return Array.from(counts.entries())
    .map(([key, entry]) => ({
      key,
      label: entry.label,
      value: entry.value,
    }))
    .sort((left, right) => right.value - left.value);
}

export function buildDistributionChart(
  items: Array<{ key: string | null; label: string | null }>
): DashboardChartDatum[] {
  const counts = new Map<string, { label: string; value: number }>();

  items.forEach((item) => {
    const key = item.key || "sin-dato";
    const label = item.label || "Sin dato";
    const existing = counts.get(key);

    counts.set(key, {
      label,
      value: (existing?.value || 0) + 1,
    });
  });

  return mapCountsToChartData(counts);
}

export function buildParticipationByDay(
  sessions: DashboardSessionRecord[]
): DashboardTimeSeriesDatum[] {
  const counts = new Map<string, number>();

  sessions.forEach((session) => {
    const date = new Date(session.started_at);
    const key = date.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => ({
      key,
      label: new Intl.DateTimeFormat("es-CO", {
        month: "short",
        day: "numeric",
      }).format(new Date(`${key}T00:00:00.000Z`)),
      value,
    }));
}

export function buildParticipationByHour(
  sessions: DashboardSessionRecord[]
): DashboardTimeSeriesDatum[] {
  const counts = new Map<number, number>();

  for (let hour = 0; hour < 24; hour += 1) {
    counts.set(hour, 0);
  }

  sessions.forEach((session) => {
    const hour = new Date(session.started_at).getUTCHours();
    counts.set(hour, (counts.get(hour) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([hour, value]) => ({
    key: String(hour),
    label: `${String(hour).padStart(2, "0")}:00`,
    value,
  }));
}

export function buildParticipantRows(
  sessions: DashboardSessionRecord[]
): DashboardParticipantRow[] {
  return sessions
    .map((session) => {
      const participant = Array.isArray(session.participant)
        ? session.participant[0]
        : session.participant;

      return {
        sessionId: session.id,
        participantId: session.participant_id,
        fullName: participant?.name || null,
        email: participant?.email || null,
        phone: participant?.phone || null,
        result: session.personality_label || null,
        drink: session.recommended_drink_label || null,
        date:
          participant?.registered_at ||
          session.completed_at ||
          session.abandoned_at ||
          session.started_at,
        durationSeconds: session.total_duration_seconds,
        deviceType: session.device_type || null,
        status: session.status,
        trafficSource: getTrafficSourceLabel(session),
      };
    })
    .sort(
      (left, right) =>
        new Date(right.date).getTime() - new Date(left.date).getTime()
    );
}

export function buildSummaryMetrics(
  sessions: DashboardSessionRecord[],
  events: DashboardEventRecord[]
): DashboardSummaryMetrics {
  const totalParticipants = sessions.length;
  const completedTests = sessions.filter(
    (session) => session.status === "completed"
  ).length;
  const submittedForms = events.filter(
    (event) => event.event_type === "form_submitted"
  ).length;
  const clickEvents = buildClickEvents(events);
  const viewInDunkinClicks = clickEvents.length;
  const abandonedSessions = sessions.filter(
    (session) => session.status === "abandoned"
  ).length;
  const durations = sessions
    .filter((session) => session.status === "completed")
    .map((session) => session.total_duration_seconds)
    .filter((value): value is number => typeof value === "number" && value > 0);

  const topClickedDrink =
    buildDistributionChart(
      clickEvents.map((event) => ({
        key: event.recommended_drink_key,
        label: event.recommended_drink_label,
      }))
    )[0] || null;

  return {
    totalParticipants,
    completedTests,
    submittedForms,
    conversionRate:
      completedTests > 0 ? Number((submittedForms / completedTests) * 100) : 0,
    averageDurationSeconds:
      durations.length > 0
        ? Math.round(
            durations.reduce((sum, value) => sum + value, 0) / durations.length
          )
        : null,
    abandonmentRate:
      totalParticipants > 0
        ? Number((abandonedSessions / totalParticipants) * 100)
        : 0,
    viewInDunkinClicks,
    viewInDunkinCtr:
      submittedForms > 0
        ? Number((viewInDunkinClicks / submittedForms) * 100)
        : 0,
    topClickedDrink: {
      drinkKey: topClickedDrink?.key || null,
      drinkLabel: topClickedDrink?.label || null,
      clicks: topClickedDrink?.value || 0,
    },
  };
}

export function buildFilterOptions(
  sessions: DashboardSessionRecord[]
): DashboardFilterOptions {
  const trafficSources = Array.from(
    new Set(sessions.map((session) => getTrafficSourceLabel(session)))
  )
    .sort((left, right) => left.localeCompare(right))
    .map((source) => ({
      key: source,
      label: source === "directo" ? "Directo" : source,
    }));

  return {
    drinks: QUIZ_RESULTS.map((result) => ({
      key: result.id,
      label: result.recommendedDrink,
    })),
    personalities: QUIZ_RESULTS.map((result) => ({
      key: result.id,
      label: result.personalityType,
    })),
    devices: [
      { key: "desktop", label: "Desktop" },
      { key: "tablet", label: "Tablet" },
      { key: "mobile", label: "Móvil" },
    ],
    trafficSources,
  };
}

export function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    rows: rows.slice(start, start + pageSize),
    pagination: {
      page: currentPage,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}
