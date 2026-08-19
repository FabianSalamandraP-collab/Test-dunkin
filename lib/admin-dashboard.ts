import {
  buildClickEvents,
  buildDistributionChart,
  buildFilterOptions,
  buildParticipantRows,
  buildParticipationByDay,
  buildParticipationByHour,
  buildSummaryMetrics,
  getDateRange,
  getClickCampaignLabel,
  getClickTrafficSourceLabel,
  matchesTrafficSource,
  paginateRows,
} from "@/lib/admin-dashboard-utils";
import type {
  DashboardDataPayload,
  DashboardEventRecord,
  DashboardFilters,
  DashboardSessionRecord,
} from "@/lib/admin-dashboard-types";
import { getQuizTrackingAdminContext } from "@/lib/quiz-tracking";

type SearchParamsInput =
  URLSearchParams | Record<string, string | string[] | undefined>;

function readParam(
  searchParams: SearchParamsInput,
  key: string
): string | null {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key);
  }

  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
}

export function parseDashboardFilters(
  searchParams: SearchParamsInput
): DashboardFilters {
  const page = Number.parseInt(readParam(searchParams, "page") || "1", 10);
  const pageSize = Number.parseInt(
    readParam(searchParams, "pageSize") || "12",
    10
  );
  const deviceType = readParam(searchParams, "deviceType");

  return {
    startDate: readParam(searchParams, "startDate"),
    endDate: readParam(searchParams, "endDate"),
    drinkKey: readParam(searchParams, "drinkKey"),
    personalityKey: readParam(searchParams, "personalityKey"),
    deviceType:
      deviceType === "mobile" ||
      deviceType === "tablet" ||
      deviceType === "desktop"
        ? deviceType
        : null,
    trafficSource: readParam(searchParams, "trafficSource"),
    page: Number.isNaN(page) ? 1 : Math.max(page, 1),
    pageSize: Number.isNaN(pageSize) ? 12 : Math.min(Math.max(pageSize, 5), 50),
  };
}

async function fetchSessions(filters: DashboardFilters) {
  const context = getQuizTrackingAdminContext();

  if (!context.ok) {
    throw new Error(context.error);
  }

  const { admin } = context.value;
  const { startIso, endIso } = getDateRange(filters);
  let query = admin
    .from("quiz_sessions")
    .select(
      "id,started_at,completed_at,abandoned_at,status,participant_id,personality_key,personality_label,recommended_drink_key,recommended_drink_label,total_duration_seconds,device_type,browser_name,utm_source,utm_medium,utm_campaign,referrer,abandoned_question_key,abandoned_question_order,participant:quiz_participants(id,full_name,email,phone,registered_at)"
    )
    .order("started_at", { ascending: false });

  if (startIso) {
    query = query.gte("started_at", startIso);
  }

  if (endIso) {
    query = query.lte("started_at", endIso);
  }

  if (filters.drinkKey) {
    query = query.eq("recommended_drink_key", filters.drinkKey);
  }

  if (filters.personalityKey) {
    query = query.eq("personality_key", filters.personalityKey);
  }

  if (filters.deviceType) {
    query = query.eq("device_type", filters.deviceType);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data || []) as DashboardSessionRecord[]).filter((session) =>
    matchesTrafficSource(session, filters.trafficSource)
  );
}

async function fetchEvents(filters: DashboardFilters, sessionIds: string[]) {
  const context = getQuizTrackingAdminContext();

  if (!context.ok) {
    throw new Error(context.error);
  }

  if (sessionIds.length === 0) {
    return [] as DashboardEventRecord[];
  }

  const { admin } = context.value;
  const { startIso, endIso } = getDateRange(filters);
  let query = admin
    .from("quiz_events")
    .select(
      "id,created_at,event_type,session_id,participant_id,result_personality_key,recommended_drink_key,recommended_drink_label,device_type,browser_name,metadata"
    )
    .in("session_id", sessionIds);

  if (startIso) {
    query = query.gte("created_at", startIso);
  }

  if (endIso) {
    query = query.lte("created_at", endIso);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []) as DashboardEventRecord[];
}

export async function getDashboardData(
  filters: DashboardFilters
): Promise<DashboardDataPayload> {
  const sessions = await fetchSessions(filters);
  const sessionIds = sessions.map((session) => session.id);
  const events = await fetchEvents(filters, sessionIds);
  const clickEvents = buildClickEvents(events);
  const rows = buildParticipantRows(sessions);
  const paginated = paginateRows(rows, filters.page, filters.pageSize);

  return {
    summary: buildSummaryMetrics(sessions, events),
    charts: {
      byDrink: buildDistributionChart(
        sessions.map((session) => ({
          key: session.recommended_drink_key,
          label: session.recommended_drink_label,
        }))
      ),
      byPersonality: buildDistributionChart(
        sessions.map((session) => ({
          key: session.personality_key,
          label: session.personality_label,
        }))
      ),
      byDevice: buildDistributionChart(
        sessions.map((session) => ({
          key: session.device_type,
          label: session.device_type,
        }))
      ),
      byBrowser: buildDistributionChart(
        sessions.map((session) => ({
          key: session.browser_name,
          label: session.browser_name,
        }))
      ),
      byTrafficSource: buildDistributionChart(
        sessions.map((session) => ({
          key: session.utm_source || session.referrer || "directo",
          label: session.utm_source || session.referrer || "Directo",
        }))
      ),
      byClickedDrink: buildDistributionChart(
        clickEvents.map((event) => ({
          key: event.recommended_drink_key,
          label: event.recommended_drink_label,
        }))
      ),
      clicksByDevice: buildDistributionChart(
        clickEvents.map((event) => ({
          key: event.device_type,
          label: event.device_type,
        }))
      ),
      clicksByCampaign: buildDistributionChart(
        clickEvents.map((event) => ({
          key: getClickCampaignLabel(event),
          label: getClickCampaignLabel(event),
        }))
      ),
      clicksByTrafficSource: buildDistributionChart(
        clickEvents.map((event) => {
          const trafficSource = getClickTrafficSourceLabel(event);

          return {
            key: trafficSource,
            label: trafficSource,
          };
        })
      ),
      byAbandonQuestion: buildDistributionChart(
        sessions
          .filter((session) => session.status === "abandoned")
          .map((session) => ({
            key: session.abandoned_question_key,
            label: session.abandoned_question_key
              ? `Pregunta ${String(session.abandoned_question_order || "")}`.trim()
              : "Sin dato",
          }))
      ),
      participationByDay: buildParticipationByDay(sessions),
      participationByHour: buildParticipationByHour(sessions),
    },
    table: paginated,
    filterOptions: buildFilterOptions(sessions),
    appliedFilters: filters,
  };
}

export async function getDashboardExportRows(filters: DashboardFilters) {
  const sessions = await fetchSessions(filters);
  return buildParticipantRows(sessions);
}
