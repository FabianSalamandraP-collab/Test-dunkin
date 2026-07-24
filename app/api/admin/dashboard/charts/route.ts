import { NextResponse } from "next/server";
import { getDashboardData, parseDashboardFilters } from "@/lib/admin-dashboard";
import { requireAdminApiAccess } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const data = await getDashboardData(parseDashboardFilters(searchParams));

    return NextResponse.json(data.charts);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible cargar las gráficas del dashboard.",
      },
      { status: 500 }
    );
  }
}
