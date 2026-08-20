// lib/calcPrice.ts

export interface PriceableProduct {
  weight?: number;
  carat?: number;
  making?: number;
}

export function calculatePrice(product: PriceableProduct | null | undefined, goldRate: number): number {
  if (!product || !product.weight || !goldRate || product.weight <= 0 || goldRate <= 0) {
    return 0;
  }

  const purity = (product.carat || 22) / 24;
  const goldPrice = Number(product.weight) * Number(goldRate) * purity;
  const makingPercent = typeof product.making === "number" ? product.making : 0;
  const makingCharge = goldPrice * (makingPercent / 100);
  const subtotal = goldPrice + makingCharge;
  const gst = subtotal * 0.03;

  return Math.round(subtotal + gst);
}