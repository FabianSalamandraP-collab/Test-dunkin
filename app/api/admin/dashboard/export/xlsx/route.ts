import { NextResponse } from "next/server";
import {
  getDashboardExportRows,
  parseDashboardFilters,
} from "@/lib/admin-dashboard";
import { requireAdminApiAccess } from "@/lib/admin-auth";
import { createDashboardWorkbook } from "@/lib/admin-export";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await requireAdminApiAccess();

  if (!access.ok) {
    return access.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const buffer = createDashboardWorkbook(
      await getDashboardExportRows(parseDashboardFilters(searchParams))
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "content-type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "content-disposition": 'attachment; filename="dunkin-dashboard.xlsx"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible exportar el Excel.",
      },
      { status: 500 }
    );
  }
}
