export type DeviceFilter = "mobile" | "tablet" | "desktop";

export interface DashboardFilters {
  startDate: string | null;
  endDate: string | null;
  drinkKey: string | null;
  personalityKey: string | null;
  deviceType: DeviceFilter | null;
  trafficSource: string | null;
  page: number;
  pageSize: number;
}

export interface DashboardChartDatum {
  key: string;
  label: string;
  value: number;
}

export interface DashboardTimeSeriesDatum {
  key: string;
  label: string;
  value: number;
}

export interface DashboardSummaryMetrics {
  totalParticipants: number;
  completedTests: number;
  submittedForms: number;
  conversionRate: number;
  averageDurationSeconds: number | null;
  abandonmentRate: number;
  viewInDunkinClicks: number;
  viewInDunkinCtr: number;
  topClickedDrink: {
    drinkKey: string | null;
    drinkLabel: string | null;
    clicks: number;
  };
}

export interface DashboardChartsPayload {
  byDrink: DashboardChartDatum[];
  byPersonality: DashboardChartDatum[];
  byDevice: DashboardChartDatum[];
  byBrowser: DashboardChartDatum[];
  byTrafficSource: DashboardChartDatum[];
  byClickedDrink: DashboardChartDatum[];
  clicksByDevice: DashboardChartDatum[];
  clicksByCampaign: DashboardChartDatum[];
  clicksByTrafficSource: DashboardChartDatum[];
  byAbandonQuestion: DashboardChartDatum[];
  participationByDay: DashboardTimeSeriesDatum[];
  participationByHour: DashboardTimeSeriesDatum[];
}

export interface DashboardParticipantRow {
  sessionId: string;
  participantId: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  result: string | null;
  drink: string | null;
  date: string;
  durationSeconds: number | null;
  deviceType: string | null;
  status: "completed" | "abandoned" | "started";
  trafficSource: string;
}

export interface DashboardPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface DashboardFilterOption {
  key: string;
  label: string;
}

export interface DashboardFilterOptions {
  drinks: DashboardFilterOption[];
  personalities: DashboardFilterOption[];
  devices: DashboardFilterOption[];
  trafficSources: DashboardFilterOption[];
}

export interface DashboardTablePayload {
  rows: DashboardParticipantRow[];
  pagination: DashboardPagination;
}

export interface DashboardDataPayload {
  summary: DashboardSummaryMetrics;
  charts: DashboardChartsPayload;
  table: DashboardTablePayload;
  filterOptions: DashboardFilterOptions;
  appliedFilters: DashboardFilters;
}

export interface DashboardSessionRecord {
  id: string;
  started_at: string;
  completed_at: string | null;
  abandoned_at: string | null;
  status: "started" | "completed" | "abandoned";
  participant_id: string | null;
  personality_key: string | null;
  personality_label: string | null;
  recommended_drink_key: string | null;
  recommended_drink_label: string | null;
  total_duration_seconds: number | null;
  device_type: string | null;
  browser_name: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  abandoned_question_key: string | null;
  abandoned_question_order: number | null;
  participant:
    | {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        registered_at: string | null;
      }
    | {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        registered_at: string | null;
      }[]
    | null;
}

export interface DashboardEventRecord {
  id: number;
  created_at: string;
  event_type:
    | "test_started"
    | "question_answered"
    | "test_completed"
    | "form_submitted"
    | "view_in_dunkin_clicked"
    | "test_abandoned";
  session_id: string;
  participant_id: string | null;
  result_personality_key: string | null;
  recommended_drink_key: string | null;
  recommended_drink_label: string | null;
  device_type: string | null;
  browser_name: string | null;
  metadata: Record<string, unknown> | null;
}
