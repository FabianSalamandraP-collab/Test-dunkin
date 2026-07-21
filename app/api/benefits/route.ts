import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { QUIZ_RESULTS } from "@/constants/quizQuestions";
import {
  fetchLiveCampaignBenefits,
  getFallbackBenefit,
  resolveBenefitForResult,
  type CampaignBenefitRecord,
} from "@/lib/campaign-benefits";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resultId = searchParams.get("resultId");
  const quizResult =
    QUIZ_RESULTS.find((result) => result.id === resultId) || QUIZ_RESULTS[0];

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    if (supabase) {
      const { data, error } = await supabase
        .from("campaign_benefits")
        .select(
          "external_id,title,description,image_url,source_url,category_names,target_results,benefit_type,price,original_price,discount_label,is_active,synced_at"
        )
        .eq("is_active", true)
        .limit(40);

      if (!error && data?.length) {
        const benefit = resolveBenefitForResult(
          data as CampaignBenefitRecord[],
          quizResult.id
        );

        if (benefit) {
          return NextResponse.json({
            benefit,
            source: "supabase",
          });
        }
      }
    }
  } catch (error) {
    console.error("No se pudieron leer beneficios desde Supabase:", error);
  }

  try {
    const liveBenefits = await fetchLiveCampaignBenefits();
    const benefit = resolveBenefitForResult(liveBenefits, quizResult.id);

    if (benefit) {
      return NextResponse.json({
        benefit: { ...benefit, source: "live" },
        source: "live",
      });
    }
  } catch (error) {
    console.error("No se pudieron sincronizar beneficios en vivo:", error);
  }

  return NextResponse.json({
    benefit: getFallbackBenefit(quizResult),
    source: "fallback",
  });
}
