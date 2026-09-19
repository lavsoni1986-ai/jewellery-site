// lib/calcPrice.ts

export interface PriceableProduct {
  name?: string;
  weight?: number | string;
  carat?: number | string;
  making?: number | string;
}

export interface PriceBreakdown {
  hasWeight: boolean;
  weight: number;
  carat: number;
  purity: number;
  baseGoldRate: number;
  effectiveGoldRate: number;
  goldValue: number;
  makingPercent: number;
  makingCharge: number;
  subtotal: number;
  gst: number;
  finalPrice: number;
}

/**
 * Returns numeric carat with business default of 22K if missing or invalid.
 */
export function getProductCarat(product?: PriceableProduct | null): number {
  if (!product || product.carat === undefined || product.carat === null) {
    return 22;
  }
  const parsed = Number(product.carat);
  return !isNaN(parsed) && parsed > 0 ? parsed : 22;
}

/**
 * Returns the effective gold rate per gram for a specific carat based on 24K base rate.
 * Example: baseGoldRate24K = 7200, carat = 22 => 7200 * (22/24) = 6600
 */
export function getEffectiveGoldRate(baseGoldRate24K: number, carat: number = 22): number {
  const rate = Number(baseGoldRate24K) || 0;
  if (rate <= 0) return 0;
  const purity = (carat > 0 ? carat : 22) / 24;
  return Math.round(rate * purity);
}

/**
 * Calculates complete pricing breakdown for a product.
 * SINGLE SOURCE OF TRUTH across Homepage, Catalogue, Modals, Admin & Invoices.
 */
export function calculatePriceBreakdown(
  product: PriceableProduct | null | undefined,
  baseGoldRate24K: number
): PriceBreakdown {
  const rate = Number(baseGoldRate24K) || 0;
  const rawWeight = product?.weight !== undefined && product?.weight !== null ? Number(product.weight) : 0;
  const hasWeight = !isNaN(rawWeight) && rawWeight > 0;
  const weight = hasWeight ? rawWeight : 0;

  const carat = getProductCarat(product);
  const purity = carat / 24;
  const effectiveGoldRate = getEffectiveGoldRate(rate, carat);

  if (!hasWeight || rate <= 0) {
    return {
      hasWeight: false,
      weight: 0,
      carat,
      purity,
      baseGoldRate: rate,
      effectiveGoldRate,
      goldValue: 0,
      makingPercent: 0,
      makingCharge: 0,
      subtotal: 0,
      gst: 0,
      finalPrice: 0,
    };
  }

  const rawMaking = product?.making !== undefined && product?.making !== null ? Number(product.making) : 0;
  const makingPercent = !isNaN(rawMaking) && rawMaking >= 0 ? rawMaking : 0;

  // Formula: weight * baseGoldRate * (carat / 24)
  const goldValue = weight * rate * purity;
  const makingCharge = goldValue * (makingPercent / 100);
  const subtotal = goldValue + makingCharge;
  const gst = subtotal * 0.03;
  const finalPrice = Math.round(subtotal + gst);

  return {
    hasWeight: true,
    weight,
    carat,
    purity,
    baseGoldRate: rate,
    effectiveGoldRate,
    goldValue: Math.round(goldValue),
    makingPercent,
    makingCharge: Math.round(makingCharge),
    subtotal: Math.round(subtotal),
    gst: Math.round(gst),
    finalPrice,
  };
}

/**
 * Returns the final rounded estimated price for a product.
 */
export function calculatePrice(
  product: PriceableProduct | null | undefined,
  baseGoldRate24K: number
): number {
  return calculatePriceBreakdown(product, baseGoldRate24K).finalPrice;
}