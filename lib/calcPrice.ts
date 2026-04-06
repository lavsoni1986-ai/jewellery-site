// lib/calcPrice.ts

export function calculatePrice(product: any, goldRate: number) {
  const purity = (product.carat || 22) / 24;
  const goldPrice = product.weight * goldRate * purity;
  const makingCharge = goldPrice * (product.making / 100);
  const subtotal = goldPrice + makingCharge;
  const gst = subtotal * 0.03;

  return Math.round(subtotal + gst);
}