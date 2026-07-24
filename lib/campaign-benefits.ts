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
  balanced: [
    "cold brew",
    "brew",
    "cafe",
    "café",
    "coffee",
    "cold",
    "americano",
  ],
  energetic: ["refresher", "mango", "piña", "pina", "dragonfruit", "limonada"],
  passionate: ["frutibatido", "batido", "frozen", "dulce", "shake"],
};

const RESULT_FAMILY_KEYWORDS: Record<string, string[]> = {
  creative: [
    "iced latte",
    "latte",
    "cappuccino",
    "capuccino",
    "espresso",
    "chai",
    "iced",
  ],
  balanced: [
    "cold brew",
    "brew",
    "americano",
    "espresso",
    "coffee",
    "cafe",
    "café",
    "tinto",
  ],
  energetic: [
    "refresher",
    "mango",
    "piña",
    "pina",
    "dragonfruit",
    "limonada",
    "iced tea",
    "tea",
    "té",
  ],
  passionate: [
    "frutibatido",
    "batido",
    "frozen",
    "shake",
    "smoothie",
    "frappe",
  ],
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
  "coca cola",
  "coca-cola",
  "cocacola",
  "sprite",
  "quatro",
  "agua manantial",
  "agua sin gas",
  "agua con gas",
];

const EXCLUDED_CATEGORY_KEYWORDS = [
  "otras bebidas",
  "bebidas adicionales",
  "gaseosas",
  "hidratacion",
];

const ALLOWED_PORTFOLIO_KEYWORDS = [
  "cafe",
  "café",
  "coffee",
  "espresso",
  "latte",
  "iced latte",
  "capuccino",
  "cappuccino",
  "americano",
  "tinto",
  "chai",
  "tea",
  "te",
  "té",
  "iced tea",
  "refresher",
  "dragonfruit",
  "mango",
  "piña",
  "pina",
  "limonada",
  "frutibatido",
  "batido",
  "frozen",
  "shake",
];

const ALLOWED_CATEGORY_KEYWORDS = [
  "bebidas frias",
  "bebidas frías",
  "bebidas calientes",
  "cafe",
  "café",
  "coffee",
  "refresher",
  "frutibatido",
  "te",
  "té",
  "combos",
  "promociones",
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
      "Consulta opciones oficiales vigentes para tu bebida.",
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

function hasActiveDiscount(record: CampaignBenefitRecord) {
  return Boolean(
    record.discount_label ||
    (record.original_price &&
      record.price &&
      record.original_price > record.price)
  );
}

function hasDrinkSignals(haystack: string) {
  return GENERIC_DRINK_KEYWORDS.some((keyword) =>
    haystack.includes(normalizeText(keyword))
  );
}

function hasAllowedPortfolioSignals(haystack: string) {
  return ALLOWED_PORTFOLIO_KEYWORDS.some((keyword) =>
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
  const isExcludedCategory = normalizedCategories.some((normalized) =>
    EXCLUDED_CATEGORY_KEYWORDS.some((keyword) =>
      normalized.includes(normalizeText(keyword))
    )
  );
  const isAllowedCategory = normalizedCategories.some((normalized) =>
    ALLOWED_CATEGORY_KEYWORDS.some((keyword) =>
      normalized.includes(normalizeText(keyword))
    )
  );

  if (isExcludedCategory) {
    return false;
  }

  if (looksLikeNonDrinkOnly(haystack)) {
    return false;
  }

  return hasAllowedPortfolioSignals(haystack) || isAllowedCategory;
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
    score += record.benefit_type === "combo" ? 70 : 82;
  }

  score += keywordMatches * 16;

  if (mappedToResult) {
    score += 34;
  }

  if (record.benefit_type === "combo" && keywordMatches > 0) {
    score += 12;
  }

  return score;
}

function isExactDrinkMatch(record: CampaignBenefitRecord, resultId: string) {
  if (record.benefit_type !== "drink") {
    return false;
  }

  const result = getResultById(resultId);
  const haystack = buildSearchHaystack(
    record.title,
    record.description || "",
    record.category_names
  );

  return haystack.includes(normalizeText(result.recommendedDrink));
}

function isExactComboMatch(record: CampaignBenefitRecord, resultId: string) {
  if (record.benefit_type !== "combo") {
    return false;
  }

  const result = getResultById(resultId);
  const haystack = buildSearchHaystack(
    record.title,
    record.description || "",
    record.category_names
  );

  return haystack.includes(normalizeText(result.recommendedDrink));
}

function isFamilyDrinkMatch(record: CampaignBenefitRecord, resultId: string) {
  if (record.benefit_type !== "drink") {
    return false;
  }

  const haystack = buildSearchHaystack(
    record.title,
    record.description || "",
    record.category_names
  );

  return (RESULT_FAMILY_KEYWORDS[resultId] || []).some((keyword) =>
    haystack.includes(normalizeText(keyword))
  );
}

function isRelatedDrinkMatch(record: CampaignBenefitRecord, resultId: string) {
  if (record.benefit_type !== "drink") {
    return false;
  }

  return record.target_results.includes(resultId);
}

function pickRecordWithinTier(
  records: CampaignBenefitRecord[],
  resultId: string,
  limit = 4
) {
  if (records.length === 0) {
    return null;
  }

  const ranked = [...records].sort((left, right) => {
    const discountDelta =
      Number(hasActiveDiscount(right)) - Number(hasActiveDiscount(left));

    if (discountDelta !== 0) {
      return discountDelta;
    }

    const scoreDelta =
      getResultMatchScore(right, resultId) -
      getResultMatchScore(left, resultId);

    if (scoreDelta !== 0) {
      return scoreDelta;
    }

    return left.title.localeCompare(right.title);
  });

  return pickRandomRecord(ranked.slice(0, limit));
}

function getPriorityPool(
  records: CampaignBenefitRecord[],
  resultId: string
): CampaignBenefitRecord[] {
  const exactDrinkPool = records.filter((record) =>
    isExactDrinkMatch(record, resultId)
  );

  if (exactDrinkPool.length > 0) {
    return exactDrinkPool;
  }

  const exactComboPool = records.filter((record) =>
    isExactComboMatch(record, resultId)
  );

  if (exactComboPool.length > 0) {
    return exactComboPool;
  }

  const familyDrinkPool = records.filter((record) =>
    isFamilyDrinkMatch(record, resultId)
  );

  if (familyDrinkPool.length > 0) {
    return familyDrinkPool;
  }

  const relatedDrinkPool = records.filter((record) =>
    isRelatedDrinkMatch(record, resultId)
  );

  if (relatedDrinkPool.length > 0) {
    return relatedDrinkPool;
  }

  return records.filter((record) => record.benefit_type === "drink");
}

function pickPriorityRecord(
  records: CampaignBenefitRecord[],
  resultId: string
) {
  const scoredRecords = records.filter(
    (record) => getResultMatchScore(record, resultId) > 0
  );
  const priorityPool = getPriorityPool(scoredRecords, resultId);

  return pickRecordWithinTier(priorityPool, resultId);
}

export function resolveBenefitForResult(
  records: CampaignBenefitRecord[],
  resultId: string
) {
  const activeRecords = records.filter(
    (record) => record.is_active && isDrinkRelatedRecord(record)
  );
  const prioritizedRecord = pickPriorityRecord(activeRecords, resultId);
  const record = prioritizedRecord;

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
