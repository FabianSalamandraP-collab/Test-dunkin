import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchLiveCampaignBenefits } from "@/lib/campaign-benefits";

export const dynamic = "force-dynamic";

function getProvidedSecret(request: Request) {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "").trim();
  }

  const { searchParams } = new URL(request.url);
  return searchParams.get("secret");
}

export async function POST(request: Request) {
  const expectedSecret = process.env.BENEFITS_SYNC_SECRET;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const providedSecret = getProvidedSecret(request);

  if (!expectedSecret || !serviceRoleKey || !supabaseUrl) {
    return NextResponse.json(
      {
        error:
          "Faltan BENEFITS_SYNC_SECRET, SUPABASE_SERVICE_ROLE_KEY o NEXT_PUBLIC_SUPABASE_URL",
      },
      { status: 500 }
    );
  }

  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const benefits = await fetchLiveCampaignBenefits();
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const syncedAt = new Date().toISOString();
    const payload = benefits.map((benefit) => ({
      ...benefit,
      synced_at: syncedAt,
    }));

    const { error: deactivateError } = await admin
      .from("campaign_benefits")
      .update({ is_active: false })
      .eq("is_active", true);

    if (deactivateError) {
      throw deactivateError;
    }

    const { error: upsertError } = await admin
      .from("campaign_benefits")
      .upsert(payload, { onConflict: "external_id" });

    if (upsertError) {
      throw upsertError;
    }

    return NextResponse.json({
      synced: payload.length,
      syncedAt,
      message: "Beneficios actualizados correctamente",
    });
  } catch (error) {
    console.error("Error sincronizando beneficios:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No fue posible sincronizar los beneficios",
      },
      { status: 500 }
    );
  }
}
