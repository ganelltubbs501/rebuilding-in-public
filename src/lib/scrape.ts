import * as cheerio from "cheerio";

export type ScrapedProduct = {
  title: string | null;
  description: string | null;
  images: string[];
  priceCents: number | null;
  currency: string;
  marketplace: "TEMU" | "SHEIN" | "ALIEXPRESS" | "ALIBABA" | "MANUAL";
  warnings: string[];
};

const FETCH_TIMEOUT_MS = 15_000;

const MARKETPLACE_HOSTS: Array<{ match: RegExp; marketplace: ScrapedProduct["marketplace"] }> = [
  { match: /(^|\.)temu\.com$/i, marketplace: "TEMU" },
  { match: /(^|\.)shein\.com$/i, marketplace: "SHEIN" },
  { match: /(^|\.)aliexpress\.(com|us)$/i, marketplace: "ALIEXPRESS" },
  { match: /(^|\.)alibaba\.com$/i, marketplace: "ALIBABA" },
];

export function detectMarketplace(url: string): ScrapedProduct["marketplace"] {
  try {
    const host = new URL(url).hostname;
    const found = MARKETPLACE_HOSTS.find((m) => m.match.test(host));
    return found?.marketplace ?? "MANUAL";
  } catch {
    return "MANUAL";
  }
}

function absolutize(src: string | undefined, base: string): string | null {
  if (!src) return null;
  try {
    return new URL(src, base).toString();
  } catch {
    return null;
  }
}

function parsePriceToCents(raw: string | undefined): number | null {
  if (!raw) return null;
  const match = raw.replace(/,/g, "").match(/(\d+(\.\d{1,2})?)/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  if (Number.isNaN(value)) return null;
  return Math.round(value * 100);
}

/**
 * Best-effort product-page scraper. Temu, SHEIN, AliExpress, and Alibaba
 * don't offer a public product API and their terms of service prohibit
 * automated scraping, so this reads only the page's public Open Graph /
 * meta tags — the same data any link-preview bot would see. It frequently
 * comes back incomplete; the caller is expected to let a human fill gaps.
 */
export async function scrapeProductPage(url: string): Promise<ScrapedProduct> {
  const marketplace = detectMarketplace(url);
  const warnings: string[] = [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let html: string;
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) {
      throw new Error(`The page responded with ${res.status} ${res.statusText}.`);
    }
    html = await res.text();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Timed out fetching that page. Try again or enter details manually.");
    }
    throw new Error(
      `Couldn't fetch that page (${err instanceof Error ? err.message : "unknown error"}). Enter the product details manually below.`
    );
  } finally {
    clearTimeout(timeout);
  }

  const $ = cheerio.load(html);

  const meta = (name: string) =>
    $(`meta[property="${name}"]`).attr("content") ??
    $(`meta[name="${name}"]`).attr("content");

  const title = meta("og:title") ?? meta("twitter:title") ?? $("title").first().text().trim() ?? null;

  const description =
    meta("og:description") ?? meta("twitter:description") ?? meta("description") ?? null;

  const images = new Set<string>();
  const ogImage = absolutize(meta("og:image"), url);
  if (ogImage) images.add(ogImage);
  const twitterImage = absolutize(meta("twitter:image"), url);
  if (twitterImage) images.add(twitterImage);
  $('meta[property="og:image"]').each((_, el) => {
    const abs = absolutize($(el).attr("content"), url);
    if (abs) images.add(abs);
  });
  // Best-effort fallback: some product pages only expose images as plain <img> tags.
  if (images.size === 0) {
    $("img").each((_, el) => {
      if (images.size >= 6) return;
      const src = $(el).attr("src") || $(el).attr("data-src");
      const abs = absolutize(src, url);
      if (abs && /\.(jpe?g|png|webp)(\?|$)/i.test(abs)) images.add(abs);
    });
  }

  const priceRaw =
    meta("product:price:amount") ??
    meta("og:price:amount") ??
    $('[itemprop="price"]').attr("content") ??
    $('[itemprop="price"]').first().text();
  const priceCents = parsePriceToCents(priceRaw);
  const currency = (meta("product:price:currency") ?? meta("og:price:currency") ?? "usd").toLowerCase();

  if (!title) warnings.push("Couldn't find a product title — enter one manually.");
  if (!description) warnings.push("Couldn't find a product description — the AI rewrite will need one to work with.");
  if (images.size === 0) warnings.push("Couldn't find any product images — add image URLs manually.");
  if (priceCents === null) warnings.push("Couldn't find a price — enter it manually.");

  return {
    title: title?.trim() || null,
    description: description?.trim() || null,
    images: Array.from(images).slice(0, 6),
    priceCents,
    currency,
    marketplace,
    warnings,
  };
}
