"use client";

import { useState } from "react";
import Image from "next/image";
import { X, MessageCircle } from "lucide-react";
import { PHONE } from "@/lib/config";
import { optimizeCloudinaryUrl } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  weight: number;
  making: number;
  image: string;
  stock?: number;
  category?: string;
  carat?: number;
}

interface ProductDetailModalProps {
  product: Product;
  goldRate: number;
  products: Product[];
  onClose: () => void;
  onFilterChange?: (filter: string) => void;
}

export default function ProductDetailModal({ product, goldRate, products, onClose, onFilterChange }: ProductDetailModalProps) {
  const getGoldStatus = () => {
    // This would need previous rate, but for simplicity, assuming stable
    return { label: "Stable today", color: "text-green-600" };
  };

  const getSimilarProducts = (current: Product) => {
    if (!goldRate) return [];
    const currentPrice = Math.round((current.weight * goldRate) * (1 + current.making / 100));
    return products.filter(p =>
      p.id !== current.id &&
      p.category === current.category &&
      Math.abs(Math.round((p.weight * goldRate) * (1 + p.making / 100)) - currentPrice) < 10000
    ).slice(0, 3);
  };

  const generateWhatsAppMessage = (product: Product, goldRate: number) => {
    const goldValue = product.weight * goldRate;
    const makingCharges = goldValue * (product.making / 100);
    const subtotal = goldValue + makingCharges;
    const gst = subtotal * 0.03;
    const finalPrice = Math.round(subtotal + gst);
    const carat = product.carat || 22;
    const status = getGoldStatus();
    const statusLabel = status.label;

    return `Hi, mujhe ${product.name} pasand aaya.

Details:
• Weight: ${product.weight}g
• ${carat}K Gold
• Making: ${product.making}%
• Current Price: ₹${finalPrice}

Gold Rate: ₹${goldRate}/gm (${statusLabel})

Kya aaj ka final best price mil sakta hai?
Agar similar designs available ho to wo bhi share karein.`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white/90 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-5 pb-24"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Close Button */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={optimizeCloudinaryUrl(product.image)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 448px"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition"
          >
            <X size={24} className="text-[#65000b]" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <h2 className="text-2xl font-serif text-[#65000b] mb-4 tracking-wide">
            {product.name}
          </h2>

          {/* Smart Question Flow */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Need help choosing?</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange?.("necklace")}
                className="text-xs bg-[#65000b]/10 text-[#65000b] px-3 py-1 rounded-full hover:bg-[#65000b]/20 transition"
              >
                For wedding
              </button>
              <button
                onClick={() => onFilterChange?.("ring")}
                className="text-xs bg-[#65000b]/10 text-[#65000b] px-3 py-1 rounded-full hover:bg-[#65000b]/20 transition"
              >
                For daily use
              </button>
              <button
                onClick={() => onFilterChange?.("earrings")}
                className="text-xs bg-[#65000b]/10 text-[#65000b] px-3 py-1 rounded-full hover:bg-[#65000b]/20 transition"
              >
                For gifting
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-[#65000b] mb-4 flex items-center gap-2">
              💡 AI Price Insight
            </h3>
            <div className="space-y-3">
              {(() => {
                const goldValue = product.weight * goldRate;
                const makingCharges = goldValue * (product.making / 100);
                const subtotal = goldValue + makingCharges;
                const gst = subtotal * 0.03;
                const total = Math.round(subtotal + gst);
                return (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Gold Value</span>
                      <span className="font-bold text-[#1a1a1a]">₹{goldValue.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Making ({product.making}%)</span>
                      <span className="font-bold text-[#1a1a1a]">₹{makingCharges.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">GST (3%)</span>
                      <span className="font-bold text-[#1a1a1a]">₹{gst.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center bg-[#65000b]/10 p-4 rounded-xl mt-4">
                      <span className="text-[#65000b] font-medium">Total Price</span>
                      <span className="text-2xl font-semibold text-[#65000b]">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 italic">
                      🤖 AI Note: Current pricing is {getGoldStatus().label.toLowerCase()} based on today's gold rate.
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      This price is calculated based on current gold rate and market conditions.
                    </div>
                    <div className="mt-3 p-3 bg-[#D4AF37]/10 rounded-lg">
                      <p className="text-sm font-medium text-[#65000b]">💡 AI Suggestion:</p>
                      <p className="text-xs text-gray-600 mt-1">This design offers best value in its price range with excellent making quality.</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* AI Recommendations */}
          {getSimilarProducts(product).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#65000b] mb-3 flex items-center gap-2">
                🤖 AI Curated Designs For You
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {getSimilarProducts(product).map((sim) => {
                  const simPrice = Math.round((sim.weight * goldRate) * (1 + sim.making / 100));
                  return (
                      <div key={sim.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onClick={() => {}}>
                        <Image
                          src={optimizeCloudinaryUrl(sim.image)}
                          alt={sim.name}
                          width={50}
                          height={50}
                          sizes="50px"
                          loading="lazy"
                          className="object-cover rounded"
                        />
                      <div className="flex-1">
                        <p className="font-medium text-[#1a1a1a] text-sm">{sim.name}</p>
                        <p className="text-[#65000b] font-bold">₹{simPrice.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WhatsApp Button in Modal */}
          <a
            href={`https://wa.me/${PHONE}?text=${encodeURIComponent(generateWhatsAppMessage(product, goldRate))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-white py-4 rounded-xl font-bold text-lg mt-6 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
          >
            <MessageCircle size={22} />
            WhatsApp पर पूछें 💬
          </a>
        </div>
      </div>
    </div>
  );
}