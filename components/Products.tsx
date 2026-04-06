"use client";

import { useState } from "react";
import Image from "next/image";
import ProductDetailModal from "./ProductDetailModal";
import FadeUp from "./FadeUp";
import { calculatePrice } from "@/lib/calcPrice";
import { useApp } from "@/context/AppContext";
import { optimizeCloudinaryUrl } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  image: string;
  weight: number;
  carat: number;
  making: number;
}

export default function Products() {
  const { products: allProducts, goldRate, loading } = useApp();
  const products = allProducts.slice(0, 6); // Show first 6 products
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (loading) {
    return (
      <section className="products-section">
        <div className="container-luxury">
          <FadeUp>
            <h2 className="text-center text-4xl mb-16">
              लेटेस्ट डिजाइन
            </h2>
          </FadeUp>
          <div className="text-center py-20 text-[#A08A8A]">Loading products...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="products-section">
        <div className="container-luxury">
          <FadeUp>
            <h2 className="text-center text-4xl mb-16">
              लेटेस्ट डिजाइन
            </h2>
          </FadeUp>
          <div className="text-center py-20 text-[#A08A8A]">No products available at the moment.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section pb-12">
      <div className="container mx-auto px-6">

        <FadeUp>
          <h2 className="luxury-heading text-center text-4xl">
            लेटेस्ट डिजाइन
          </h2>
        </FadeUp>

        <div className="luxury-grid grid md:grid-cols-3">
          {products.map((product, index) => (
            <FadeUp key={product.id} delay={index * 0.1}>
              <div className="product-card">
                <div
                  onClick={() => setSelectedProduct(product)}
                  className="cursor-pointer"
                >
                  <Image
                    src={optimizeCloudinaryUrl(product.image)}
                    width={400}
                    height={400}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                    className="w-full h-[280px] object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
                    alt={product.name}
                  />
                  <h3 className="product-title mb-2 mt-4">{product.name}</h3>
                  <p className="price mb-1 text-[#8A6A6A]">₹{calculatePrice(product, goldRate).toLocaleString("en-IN")}</p>
                  <p className="text-xs text-gray-500 mb-4">Updated with live gold rates</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            goldRate={goldRate}
            products={allProducts}
            onClose={() => setSelectedProduct(null)}
          />
        )}

      </div>
    </section>
  );
}