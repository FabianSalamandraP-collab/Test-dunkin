import { AdminDashboardView } from "@/features/admin/components/AdminDashboardView";
import {
  getDashboardData,
  parseDashboardFilters,
} from "@/lib/admin-dashboard";
import type { DashboardDataPayload } from "@/lib/admin-dashboard-types";
import { buildEmptyDashboardData } from "@/lib/admin-dashboard-utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseDashboardFilters(resolvedSearchParams);
  let data: DashboardDataPayload;

  try {
    data = await getDashboardData(filters);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No pudimos cargar los datos del panel administrativo.";

    data = {
      ...buildEmptyDashboardData(filters),
      loadError: message,
    } as DashboardDataPayload & { loadError: string };
  }

  return <AdminDashboardView data={data} mode="overview" />;
}
