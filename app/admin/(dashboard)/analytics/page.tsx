import { AdminDashboardView } from "@/features/admin/components/AdminDashboardView";
import { getDashboardData, parseDashboardFilters } from "@/lib/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const data = await getDashboardData(
    parseDashboardFilters(resolvedSearchParams)
  );

  return <AdminDashboardView data={data} mode="analytics" />;
}
