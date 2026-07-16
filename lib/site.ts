const DEFAULT_SITE_URL = "https://dunkin-colombia-campaign.com";

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const normalizedUrl = rawUrl.replace(/\/+$/, "");

  if (
    normalizedUrl.startsWith("http://") ||
    normalizedUrl.startsWith("https://")
  ) {
    return normalizedUrl;
  }

  return `https://${normalizedUrl}`;
}
