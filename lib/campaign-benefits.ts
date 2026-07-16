import { QUIZ_RESULTS } from "@/constants/quizQuestions";
import { QuizResult } from "@/types/quiz";

export const DUNKIN_ORDER_URL = "https://www.dunkincolombia.com/pedir";

export interface CampaignBenefitRecord {
  external_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  source_url: string;
  category_names: string[];
  target_results: string[];
  benefit_type: "drink" | "combo";
  price: number | null;
  original_price: number | null;
  discount_label: string | null;
  is_active: boolean;
  synced_at?: string;
}

export interface ResolvedCampaignBenefit {
  title: string;
  description: string;
  cta: string;
  url: string | null;
  imageUrl?: string | null;
  discountLabel?: string | null;
  priceLabel?: string | null;
  source: "supabase" | "live" | "fallback";
}

interface RawCatalogProduct {
  _id?: string;
  name?: string;
  description?: string | null;
  path?: string;
  categories?: Array<{ name?: string | null }>;
  images?: Array<{
    resizedData?: {
      largeURL?: string;
      mediumURL?: string;
      smallURL?: string;
    };
  }>;
  availabilityAt?: {
    basePrice?: number | null;
    finalPrice?: number | null;
    available?: boolean | null;
    visible?: boolean | null;
  };
}

const GENERIC_DRINK_KEYWORDS = [
  "bebida",
  "bebidas",
  "cafe",
  "café",
  "coffee",
  "latte",
  "iced",
  "iced tea",
  "refresher",
  "mango",
  "piña",
  "pina",
  "dragonfruit",
  "frozen",
  "frutibatido",
  "capuccino",
  "cappuccino",
  "chai",
  "chocolate",
  "limonada",
  "tinto",
  "caliente",
  "fria",
  "fría",
];

const RESULT_KEYWORDS: Record<string, string[]> = {
  creative: ["iced latte", "latte", "cappuccino", "chai", "cafe", "café"],
  balanced: ["iced tea", "tea", "iced", "te", "té", "cafe", "café", "coffee"],
  energetic: ["refresher", "mango", "piña", "pina", "dragonfruit", "limonada"],
  passionate: ["frutibatido", "batido", "frozen", "dulce", "shake"],
};

const NON_DRINK_ONLY_KEYWORDS = [
  "donut",
  "donuts",
  "docena",
  "balon",
  "balón",
  "llavero",
  "futbolera",
  "cancha",
  "chantilly",
  "arequipe",
  "mora",
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatPrice(price: number | null) {
  if (!price) return null;

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

function buildPriceLabel(price: number | null, originalPrice: number | null) {
  const current = formatPrice(price);
  const original = formatPrice(originalPrice);

  if (current && original) {
    return `${current} antes ${original}`;
  }

  return current;
}

function buildBenefitDescription(record: CampaignBenefitRecord) {
  const baseDescription =
    record.description?.trim() ||
    "Aprovecha este beneficio disponible en el canal oficial de Dunkin.";
  const priceLabel = buildPriceLabel(record.price, record.original_price);

  if (!priceLabel) {
    return baseDescription;
  }

  return `${baseDescription} Disponible desde ${priceLabel}.`;
}

export function getFallbackBenefit(
  result: QuizResult
): ResolvedCampaignBenefit {
  return {
    title: result.benefitTitle || "Beneficio vigente en Dunkin'",
    description:
      result.benefitDescription ||
      "Consulta los beneficios y combos vigentes en el canal oficial de Dunkin.",
    cta: result.benefitCta || "Ver beneficio",
    url: DUNKIN_ORDER_URL,
    imageUrl: result.benefitIcon,
    source: "fallback",
  };
}

function getResultKeywords(resultId: string, recommendedDrink: string) {
  const drinkKeywords = normalizeText(recommendedDrink)
    .split(/\s+/)
    .filter(Boolean);

  return [
    ...new Set([
      normalizeText(recommendedDrink),
      ...(RESULT_KEYWORDS[resultId] || []),
      ...drinkKeywords,
    ]),
  ];
}

function getAllResultKeywords() {
  return QUIZ_RESULTS.reduce<Record<string, string[]>>(
    (accumulator, result) => {
      accumulator[result.id] = getResultKeywords(
        result.id,
        result.recommendedDrink
      );
      return accumulator;
    },
    {}
  );
}

const resultKeywordMap = getAllResultKeywords();

function getResultById(resultId: string) {
  return (
    QUIZ_RESULTS.find((result) => result.id === resultId) || QUIZ_RESULTS[0]
  );
}

function buildSearchHaystack(
  title: string,
  description: string,
  categoryNames: string[]
) {
  return normalizeText(`${title} ${description} ${categoryNames.join(" ")}`);
}

function hasDrinkSignals(haystack: string) {
  return GENERIC_DRINK_KEYWORDS.some((keyword) =>
    haystack.includes(normalizeText(keyword))
  );
}

function looksLikeNonDrinkOnly(haystack: string) {
  const hasNonDrinkKeyword = NON_DRINK_ONLY_KEYWORDS.some((keyword) =>
    haystack.includes(normalizeText(keyword))
  );

  return hasNonDrinkKeyword && !hasDrinkSignals(haystack);
}

function isRelevantBenefit(
  product: RawCatalogProduct,
  categoryNames: string[]
) {
  const title = product.name || "";
  const description = product.description || "";
  const haystack = buildSearchHaystack(title, description, categoryNames);
  const normalizedCategories = categoryNames.map((category) =>
    normalizeText(category)
  );
  const isDrinkCategory = normalizedCategories.some(
    (normalized) =>
      normalized.includes("bebidas fri") ||
      normalized.includes("bebidas cal") ||
      normalized.includes("promociones") ||
      normalized.includes("combos")
  );

  if (looksLikeNonDrinkOnly(haystack)) {
    return false;
  }

  return hasDrinkSignals(haystack) || isDrinkCategory;
}

function resolveTargetResults(
  title: string,
  description: string,
  categoryNames: string[]
) {
  const haystack = normalizeText(
    `${title} ${description} ${categoryNames.join(" ")}`
  );
  const matchedResults = Object.entries(resultKeywordMap)
    .filter(([, keywords]) =>
      keywords.some((keyword) => haystack.includes(normalizeText(keyword)))
    )
    .map(([resultId]) => resultId);

  if (matchedResults.length > 0) {
    return matchedResults;
  }

  return QUIZ_RESULTS.map((result) => result.id);
}

function getCatalogNode(node: unknown): Record<string, unknown> | null {
  if (!node || typeof node !== "object") {
    return null;
  }

  const candidate = node as Record<string, unknown>;
  if (candidate.products && candidate.categories) {
    return candidate;
  }

  for (const value of Object.values(candidate)) {
    const nested = getCatalogNode(value);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function extractRemixContext(html: string) {
  const contextMatch = html.match(
    /window\.__remixContext\s*=\s*(\{[\s\S]*?\})\s*;<\/script>/
  );

  if (!contextMatch?.[1]) {
    throw new Error("No se pudo leer el catalogo de Dunkin desde el HTML");
  }

  return JSON.parse(contextMatch[1]) as Record<string, unknown>;
}

function normalizeCatalogProduct(
  product: RawCatalogProduct
): CampaignBenefitRecord | null {
  const title = product.name?.trim();
  const productPath = product.path?.trim();

  if (!title || !productPath) {
    return null;
  }

  const categoryNames = (product.categories || [])
    .map((category) => category.name?.trim())
    .filter((category): category is string => Boolean(category));

  if (!isRelevantBenefit(product, categoryNames)) {
    return null;
  }

  const finalPrice = product.availabilityAt?.finalPrice ?? null;
  const basePrice = product.availabilityAt?.basePrice ?? null;
  const originalPrice =
    basePrice && finalPrice && basePrice > finalPrice ? basePrice : null;
  const discountLabel =
    originalPrice && finalPrice
      ? `-${Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}%`
      : null;
  const image = product.images?.[0]?.resizedData;
  const imageUrl =
    image?.largeURL || image?.mediumURL || image?.smallURL || null;
  const benefitType = normalizeText(
    `${title} ${categoryNames.join(" ")}`
  ).includes("combo")
    ? "combo"
    : "drink";

  return {
    external_id: product._id || productPath,
    title,
    description: product.description?.replace(/^"|"$/g, "") || null,
    image_url: imageUrl,
    source_url: new URL(productPath, DUNKIN_ORDER_URL).toString(),
    category_names: categoryNames,
    target_results: resolveTargetResults(
      title,
      product.description || "",
      categoryNames
    ),
    benefit_type: benefitType,
    price: finalPrice,
    original_price: originalPrice,
    discount_label: discountLabel,
    is_active:
      product.availabilityAt?.available !== false &&
      product.availabilityAt?.visible !== false,
  };
}

export async function fetchLiveCampaignBenefits() {
  const response = await fetch(DUNKIN_ORDER_URL, {
    next: { revalidate: 900 },
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; DunkinCampaignBot/1.0; +https://www.dunkincolombia.com/pedir)",
    },
  });

  if (!response.ok) {
    throw new Error(`No se pudo consultar Dunkin: ${response.status}`);
  }

  const html = await response.text();
  const remixContext = extractRemixContext(html);
  const catalogNode = getCatalogNode(remixContext);

  if (!catalogNode?.products) {
    throw new Error(
      "No se encontraron productos dentro del catalogo de Dunkin"
    );
  }

  const products = Object.values(
    catalogNode.products as Record<string, RawCatalogProduct>
  );

  return products
    .map((product) => normalizeCatalogProduct(product))
    .filter((product): product is CampaignBenefitRecord => Boolean(product));
}

function pickRandomRecord(records: CampaignBenefitRecord[]) {
  const randomIndex = Math.floor(Math.random() * records.length);
  return records[randomIndex] || null;
}

function isDrinkRelatedRecord(record: CampaignBenefitRecord) {
  const haystack = buildSearchHaystack(
    record.title,
    record.description || "",
    record.category_names
  );

  if (looksLikeNonDrinkOnly(haystack)) {
    return false;
  }

  return hasDrinkSignals(haystack);
}

function getResultMatchScore(record: CampaignBenefitRecord, resultId: string) {
  const result = getResultById(resultId);
  const haystack = buildSearchHaystack(
    record.title,
    record.description || "",
    record.category_names
  );
  const resultKeywords = getResultKeywords(result.id, result.recommendedDrink);
  const exactDrinkPhrase = normalizeText(result.recommendedDrink);
  const exactPhraseMatch = haystack.includes(exactDrinkPhrase);
  const keywordMatches = resultKeywords.filter((keyword) =>
    haystack.includes(keyword)
  ).length;
  const mappedToResult = record.target_results.includes(resultId);

  let score = 0;

  if (exactPhraseMatch) {
    score += record.benefit_type === "combo" ? 120 : 140;
  }

  score += keywordMatches * 12;

  if (mappedToResult) {
    score += 18;
  }

  if (record.benefit_type === "combo" && keywordMatches > 0) {
    score += 8;
  }

  return score;
}

function pickPriorityRecord(
  records: CampaignBenefitRecord[],
  resultId: string
) {
  const scoredRecords = records
    .map((record) => ({
      record,
      score: getResultMatchScore(record, resultId),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (scoredRecords.length === 0) {
    return null;
  }

  const exactPriorityPool = scoredRecords
    .filter((item) => item.score >= 120)
    .slice(0, 4)
    .map((item) => item.record);
  const relatedPool = scoredRecords.slice(0, 6).map((item) => item.record);

  if (exactPriorityPool.length > 0 && Math.random() < 0.72) {
    return pickRandomRecord(exactPriorityPool);
  }

  return pickRandomRecord(relatedPool);
}

export function resolveBenefitForResult(
  records: CampaignBenefitRecord[],
  resultId: string
) {
  const activeRecords = records.filter(
    (record) => record.is_active && isDrinkRelatedRecord(record)
  );
  const prioritizedRecord = pickPriorityRecord(activeRecords, resultId);
  const record = prioritizedRecord || pickRandomRecord(activeRecords);

  if (!record) {
    return null;
  }

  return {
    title: record.discount_label
      ? `${record.title} ${record.discount_label}`
      : record.title,
    description: buildBenefitDescription(record),
    cta: "Ver en Dunkin",
    url: record.source_url,
    imageUrl: record.image_url,
    discountLabel: record.discount_label,
    priceLabel: buildPriceLabel(record.price, record.original_price),
    source: "supabase" as const,
  };
}
