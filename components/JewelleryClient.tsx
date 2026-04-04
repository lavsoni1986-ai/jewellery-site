"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PHONE } from "@/lib/config";
import { Heart, Menu, X, MessageCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  weight: number;
  making: number;
  image: string;
  stock?: number;
  category?: string;
}

export default function JewelleryClient() {
  const [goldRate, setGoldRate] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchGoldRate = async () => {
    const goldRateDoc = await getDoc(doc(db, "goldRate", "current"));
    if (goldRateDoc.exists()) {
      setGoldRate(goldRateDoc.data().rate);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchGoldRate();
        const productSnap = await getDocs(collection(db, "products"));
        setProducts(productSnap.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as Product[]);
        setLoading(false);
      } catch {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      setSelectedProduct((e as CustomEvent<Product>).detail);
    };

    window.addEventListener("openProduct", handler);
    return () => window.removeEventListener("openProduct", handler);
  }, []);

  const filteredProducts = filter === "all" 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === filter);

  return (
    <div className="bg-gradient-to-b from-[#fff5f5] via-[#fce4e4] to-[#f8f1f1] text-[#1a1a1a] min-h-screen selection:bg-rosewood selection:text-white pb-28 md:pb-16 noise-bg">
      {/* NAVIGATION (Refined Glassmorphism) */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="hidden md:flex gap-8 text-sm font-medium text-[#65000b] tracking-wide">
            <Link href="/" className="hover:text-gold transition-all duration-300">Home</Link>
            <Link href="/jewellery" className="text-gold transition-all duration-300">Collection</Link>
          </div>
          
          <h1 className="text-xl md:text-2xl font-serif tracking-[0.15em] text-[#65000b]">
            ANSHU JEWELLERS <span className="text-[10px] block text-center opacity-70 font-sans tracking-wider">SINCE 1950</span>
          </h1>

          <div className="flex items-center gap-4">
            <Heart size={20} className="text-[#65000b] cursor-pointer hover:text-gold transition-all duration-300 hover:scale-110" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#65000b] hover:text-gold transition p-2 rounded-lg hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div
            className="fixed right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-depth-xl transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pt-20">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-[#65000b] hover:text-gold transition p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>

              <div className="space-y-6">
                <h2 className="text-2xl font-serif text-[#65000b] tracking-wide">Menu</h2>

                <div className="space-y-4">
                  <Link
                    href="/"
                    className="block py-3 px-4 text-[#65000b] font-medium tracking-wide hover:bg-[#65000b]/10 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/jewellery"
                    className="block py-3 px-4 text-[#65000b] font-medium tracking-wide bg-[#65000b]/10 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Collection
                  </Link>
                  <Link
                    href="/contact"
                    className="block py-3 px-4 text-[#65000b] font-medium tracking-wide hover:bg-[#65000b]/10 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <a
                    href={`https://wa.me/${PHONE}`}
                    className="w-full block btn-primary text-white py-4 px-6 rounded-xl font-bold text-center hover:scale-105 active:scale-95"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    WhatsApp पर पूछें 💬
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 pt-24 section-animate">
        {/* 1. SECTION HEADER + FILTER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#65000b] tracking-wide">Our Collection</h1>
            <p className="text-gray-600 mt-3 tracking-wide">Latest Designs • BIS Hallmarked • Best Making Charges</p>
          </div>

          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="glass-card text-[#65000b] px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 font-medium tracking-wide shadow-depth hover:shadow-depth-lg"
          >
            <option value="all">All Categories</option>
            <option value="ring">Rings</option>
            <option value="necklace">Necklace</option>
            <option value="bangles">Bangles</option>
            <option value="earrings">Earrings</option>
          </select>
        </div>

        {error && (
          <div className="text-center py-12 glass-card rounded-3xl border border-red-200/50 max-w-md mx-auto">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#65000b] mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-white px-8 py-3 rounded-xl font-bold hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="glass-card rounded-3xl overflow-hidden shadow-depth animate-pulse">
                <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4 w-3/4"></div>
                  <div className="h-3 bg-green-200 rounded-full mb-4 w-1/2"></div>
                  <div className="space-y-3">
                    <div className="h-10 bg-[#65000b]/20 rounded-xl"></div>
                    <div className="h-8 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. EMPTY STATE */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 py-20 glass-card rounded-3xl border border-white/30">
            <p className="text-xl tracking-wide">अभी नए डिजाइन जोड़े जा रहे हैं 💎</p>
            <p className="text-sm mt-3">कृपया WhatsApp पर संपर्क करें</p>
          </div>
        )}

        {/* 3. PRODUCT GRID (Premium with Depth) */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-8">
            {filteredProducts.map((product) => {
              const price = Math.round((product.weight * (goldRate || 0)) + product.making);
              return (
                <div key={product.id} className="group product-card glass-card rounded-3xl overflow-hidden shadow-depth hover:shadow-depth-xl h-full flex flex-col">
                  <div className="relative h-64 overflow-hidden image-zoom">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a0a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                  
                  <div className="p-6 flex flex-col gap-3 flex-grow justify-between">
                    <div>
                      <h3 className="text-[#1a1a1a] text-lg font-medium tracking-wide truncate">{product.name}</h3>
                      <p className="text-[#65000b] text-2xl font-bold tracking-wide">₹{price.toLocaleString("en-IN")}</p>
                      <p className="text-green-600 text-xs font-medium mt-2">
                        <span className="bg-green-100/80 px-3 py-1.5 rounded-full">✔ BIS Hallmarked</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-auto">
                      <a
                        href={`https://wa.me/${PHONE}?text=Namaste%20Anshu%20Jewellers,%20mujhe%20${product.name}%20(₹${price})%20ke%20bare%20me%20jankari%20chahiye.`}
                        target="_blank"
                        className="btn-primary text-white py-3 rounded-xl text-center text-sm font-bold hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        WhatsApp पर पूछें 💬
                      </a>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="btn-secondary py-2.5 rounded-xl text-sm font-bold hover:scale-105 active:scale-95 text-center w-full"
                      >
                        डिटेल देखें
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white/90 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-5 pb-24"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Close Button */}
            <div className="relative h-64">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition"
              >
                <X size={24} className="text-[#65000b]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-serif text-[#65000b] mb-4 tracking-wide">
                {selectedProduct.name}
              </h2>
              
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center border-b border-[#e5cfcf] pb-3">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-bold text-[#1a1a1a]">{selectedProduct.weight} grams</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-[#e5cfcf] pb-3">
                  <span className="text-gray-600">Making Charges</span>
                  <span className="font-bold text-[#1a1a1a]">₹{selectedProduct.making.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-[#e5cfcf] pb-3">
                  <span className="text-gray-600">Category</span>
                  <span className="font-bold text-[#1a1a1a] capitalize">{selectedProduct.category || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-[#e5cfcf] pb-3">
                  <span className="text-gray-600">Stock</span>
                  <span className="font-bold text-green-600">{selectedProduct.stock || 0} units</span>
                </div>
                
                <div className="flex justify-between items-center bg-[#65000b]/10 p-4 rounded-xl">
                  <span className="text-[#65000b] font-medium">Total Price</span>
                  <span className="text-2xl font-bold text-[#65000b]">
                    ₹{Math.round((selectedProduct.weight * goldRate) + selectedProduct.making).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* WhatsApp Button in Modal */}
              <a
                href={`https://wa.me/${PHONE}?text=Namaste%20Anshu%20Jewellers,%20mujhe%20${selectedProduct.name}%20(₹${Math.round((selectedProduct.weight * goldRate) + selectedProduct.making).toLocaleString("en-IN")})%20ke%20bare%20me%20jankari%20chahiye.`}
                target="_blank"
                className="btn-primary w-full text-white py-4 rounded-xl font-bold text-lg mt-6 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <MessageCircle size={22} />
                WhatsApp पर पूछें 💬
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
