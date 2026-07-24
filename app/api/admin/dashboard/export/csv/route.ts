import { NextResponse } from "next/server";
import {
  getDashboardExportRows,
  parseDashboardFilters,
} from "@/lib/admin-dashboard";
import { requireAdminApiAccess } from "@/lib/admin-auth";
import { createDashboardCsv } from "@/lib/admin-export";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const csv = createDashboardCsv(
      await getDashboardExportRows(parseDashboardFilters(searchParams))
    );

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="dunkin-dashboard.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible exportar el CSV.",
      },
      { status: 500 }
    );
  }
}
