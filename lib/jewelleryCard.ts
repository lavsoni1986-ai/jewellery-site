/**
 * JewelleryCard Public Catalogue Parser & Client
 * 
 * Fetches and parses products from the verified public catalogue endpoint:
 * https://jewellerycard.in/universal-products/245/ANSHU-JEWELLERS
 */

export interface JewelleryCardProduct {
  id: string; // Stable data-global-product-id (e.g. "1497")
  name: string; // Product name (e.g. "Ladies Bracelet PJ-35")
  image: string; // Normalized full image URL
  category: string; // Standardized category slug
  rawCategory?: string; // Original category string from source
  sourceUrl?: string; // Link to catalogue/item
}

export interface FetchPageResult {
  products: JewelleryCardProduct[];
  currentPage: number;
  lastPage: number;
  total: number;
}

export interface FetchAllOptions {
  maxPages?: number; // Safety limit on page count (default: all pages up to 100)
  startPage?: number; // Start page index (default: 1)
  timeoutMs?: number; // Request timeout per page (default: 15000ms)
  delayBetweenPagesMs?: number; // Delay between sequential page fetches (default: 150ms)
}

const BASE_URL = "https://jewellerycard.in";
const ENDPOINT = `${BASE_URL}/universal-products/245/ANSHU-JEWELLERS`;

/**
 * Normalizes category name into a slug matching existing site categories
 */
export function normalizeCategorySlug(rawCat: string): string {
  if (!rawCat) return "other";
  const clean = rawCat.toLowerCase().trim();

  if (clean.includes("nose")) return "nose-ring";
  if (clean.includes("earring") || clean.includes("jhumka") || clean.includes("tops") || clean.includes("stud") || clean.includes("bali")) return "earring";
  if (clean.includes("necklace") || clean.includes("haar") || clean.includes("mala") || clean.includes("chain") || clean.includes("choker") || clean.includes("pendant") || clean.includes("set")) return "necklace";
  if (clean.includes("bracelet")) return "bracelet";
  if (clean.includes("bangle") || clean.includes("kangan") || clean.includes("chuda") || clean.includes("bala") || clean.includes("kada")) return "bangle";
  if (clean.includes("mangalsutra")) return "mangalsutra";
  if (clean.includes("anklet") || clean.includes("payal")) return "anklet";
  if (clean.includes("coin") || clean.includes("bar")) return "coins";
  if (clean.includes("ring") || clean.includes("anguthi") || clean.includes("chhalla")) return "ring";

  return clean.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Normalizes raw image URLs from JewelleryCard into clean HTTPS URLs
 */
export function normalizeJewelleryCardImageUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  let url = rawUrl.trim();

  // Decode potential HTML entities in URLs
  url = url.replace(/&amp;/g, "&");

  if (url.startsWith("http://") || url.startsWith("https://")) {
    url = url.replace(/^https?:\/\/jewellerycard\.in\/+/i, `${BASE_URL}/`);
  } else if (url.startsWith("//uploads/") || url.startsWith("/uploads/")) {
    url = `${BASE_URL}/${url.replace(/^\/+/, "")}`;
  } else if (url.startsWith("//")) {
    url = `https:${url}`;
  } else if (url.startsWith("/")) {
    url = `${BASE_URL}${url}`;
  }

  return url;
}

/**
 * Decodes HTML entities commonly found in web responses
 */
function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}

/**
 * Parses products_html string from the JewelleryCard JSON response
 */
export function parseProductsHtml(html: string): JewelleryCardProduct[] {
  if (!html || typeof html !== "string") return [];

  const products: JewelleryCardProduct[] = [];
  const articleRegex = /<article[\s\S]*?<\/article>/gi;
  const articles = html.match(articleRegex) || [];

  for (const art of articles) {
    try {
      // 1. Stable Product ID (e.g. data-global-product-id="1497")
      const idMatch = art.match(/data-global-product-id=["']([^"']+)["']/i);
      const rawId = idMatch ? idMatch[1].trim() : null;
      if (!rawId) continue;

      // 2. Product Name
      const nameInH3 = art.match(/class=["'][^"']*global-product-grid-name[^"']*["'][^>]*>([\s\S]*?)<\/h3>/i);
      const nameInData = art.match(/data-product-name=["']([^"']+)["']/i);
      const nameInTitle = art.match(/data-title=["']([^"']+)["']/i);
      const nameInAlt = art.match(/<img[^>]+alt=["']([^"']+)["']/i);

      let rawName = "";
      if (nameInH3 && nameInH3[1].trim()) {
        rawName = nameInH3[1];
      } else if (nameInData && nameInData[1].trim()) {
        rawName = nameInData[1];
      } else if (nameInTitle && nameInTitle[1].trim()) {
        rawName = nameInTitle[1];
      } else if (nameInAlt && nameInAlt[1].trim()) {
        rawName = nameInAlt[1];
      }

      const name = decodeHtmlEntities(rawName.replace(/<[^>]+>/g, "").trim());
      if (!name) continue;

      // 3. Product Image URL
      const dataImgMatch = art.match(/data-product-image=["']([^"']+)["']/i);
      const imgMatch = art.match(/<img[^>]+src=["']([^"']+)["']/i);
      const anchorImgMatch = art.match(/<a[^>]+href=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/i);

      let rawImg = "";
      if (dataImgMatch && dataImgMatch[1].trim()) {
        rawImg = dataImgMatch[1].trim();
      } else if (imgMatch && imgMatch[1].trim()) {
        rawImg = imgMatch[1].trim();
      } else if (anchorImgMatch && anchorImgMatch[1].trim()) {
        rawImg = anchorImgMatch[1].trim();
      }

      const image = normalizeJewelleryCardImageUrl(rawImg);
      if (!image) continue;

      // 4. Category Extraction
      let rawCategory = "";
      const waMsgMatch = art.match(/data-whatsapp-message=["']([^"']+)["']/i);
      if (waMsgMatch) {
        const decodedWa = decodeHtmlEntities(waMsgMatch[1]);
        const catMatch = decodedWa.match(/•\s*\*Category:\*\s*([^\n\r]+)/i);
        if (catMatch) {
          rawCategory = catMatch[1].trim();
        }
      }

      if (!rawCategory) {
        rawCategory = name;
      }

      const categorySlug = normalizeCategorySlug(rawCategory);

      products.push({
        id: rawId,
        name,
        image,
        category: categorySlug,
        rawCategory: rawCategory !== name ? rawCategory : undefined,
        sourceUrl: `${BASE_URL}/ANSHU-JEWELLERS`,
      });
    } catch {
      continue;
    }
  }

  return products;
}

/**
 * Fetches a single page of products from the JewelleryCard API endpoint
 */
export async function fetchJewelleryCardPage(
  page = 1,
  timeoutMs = 15000
): Promise<FetchPageResult> {
  const url = `${ENDPOINT}?page=${page}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "AnshuJewellersSiteSync/1.0",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`JewelleryCard API responded with HTTP status ${res.status} (${res.statusText})`);
    }

    const json = await res.json();
    if (!json || typeof json !== "object") {
      throw new Error("Invalid response format from JewelleryCard API (not a JSON object)");
    }

    const products = parseProductsHtml(json.products_html || "");
    const currentPage = Number(json.current_page) || page;
    const lastPage = Number(json.last_page) || currentPage;
    const total = Number(json.total) || products.length;

    return {
      products,
      currentPage,
      lastPage,
      total,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches all products across all pages with safety bounds
 */
export async function fetchAllJewelleryCardProducts(
  options: FetchAllOptions = {}
): Promise<{
  products: JewelleryCardProduct[];
  pagesFetched: number;
  totalReported: number;
  errors: string[];
}> {
  const maxPages = options.maxPages ?? 100;
  const startPage = options.startPage ?? 1;
  const timeoutMs = options.timeoutMs ?? 15000;
  const delayMs = options.delayBetweenPagesMs ?? 150;

  const productMap = new Map<string, JewelleryCardProduct>();
  const errors: string[] = [];
  let currentPage = startPage;
  let lastPage = startPage;
  let totalReported = 0;
  let pagesFetched = 0;

  while (currentPage <= lastPage && currentPage <= maxPages) {
    try {
      const result = await fetchJewelleryCardPage(currentPage, timeoutMs);
      pagesFetched++;
      lastPage = result.lastPage;
      totalReported = result.total;

      for (const prod of result.products) {
        if (!productMap.has(prod.id)) {
          productMap.set(prod.id, prod);
        }
      }

      if (currentPage >= lastPage) break;
      currentPage++;

      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Page ${currentPage} fetch error: ${msg}`);
      break;
    }
  }

  return {
    products: Array.from(productMap.values()),
    pagesFetched,
    totalReported,
    errors,
  };
}
