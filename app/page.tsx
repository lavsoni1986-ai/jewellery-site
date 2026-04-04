"use client";



import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { PHONE } from "@/lib/config";
import { Heart, Menu, X, CheckCircle } from "lucide-react";

// --- Types ---
interface Product {
  id: string;
  name: string;
  weight: number;
  making: number;
  image: string;
  category?: string;
  stock?: number;
}

const categories = [
  {
    name: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
  },
  {
    name: "Necklace",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
  },
  {
    name: "Bangles",
    image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd",
  },
  {
    name: "Earrings",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800",
  },
];

export default function Home() {
  const [goldRate, setGoldRate] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rateDoc = await getDoc(doc(db, "goldRate", "current"));
        if (rateDoc.exists()) setGoldRate(rateDoc.data().rate);

        const snapshot = await getDocs(collection(db, "products"));
        setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Product[]);
      } catch (error) {
        console.error("Architect Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#fff5f5] via-[#fce4e4] to-[#f8f1f1] text-[#1a1a1a] selection:bg-rosewood selection:text-white min-h-screen noise-bg pb-28 md:pb-16">
      {/* 1. TOP BARS */}
      <div className="fixed top-0 w-full z-[60]">
        <div className="bg-gradient-to-r from-[#d4af37] via-[#f5d06f] to-[#d4af37] text-black py-2 text-center text-xs font-bold tracking-[0.2em] uppercase shadow-depth">
          Gold Rate: ₹{goldRate ? goldRate.toLocaleString("en-IN") : "..."} / gram • Limited Offers Inside
        </div>
      </div>

      {/* 2. NAVIGATION (Refined Glassmorphism) */}
      <nav className="fixed top-10 w-full z-50 glass-nav">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <nav className="hidden md:flex gap-8 text-sm font-medium text-[#65000b] tracking-wide" role="navigation">
            <Link href="/" className="hover:text-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1">Home</Link>
            <Link href="/jewellery" className="hover:text-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded px-2 py-1">Collection</Link>
          </nav>
          
          <h1 className="text-xl md:text-2xl font-serif tracking-[0.15em] text-[#65000b]">
            ANSHU JEWELLERS <span className="text-[10px] block text-center opacity-70 font-sans tracking-wider">SINCE 1950</span>
          </h1>

          <div className="flex items-center gap-4">
            <button
              className="text-[#65000b] cursor-pointer hover:text-gold transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-white/10"
              aria-label="Favorites"
            >
              <Heart size={20} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#65000b] hover:text-gold transition p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
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
                    className="block py-3 px-4 text-[#65000b] font-medium tracking-wide hover:bg-[#65000b]/10 rounded-lg transition-all duration-200"
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

      {/* 3. HERO SECTION (EPIC CINEMATIC) */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 pt-32 md:pt-40 overflow-hidden spotlight">
        {/* Background Image with Zoom Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f"
            alt="Luxury Jewellery"
            fill
            priority
            loading="eager"
            sizes="100vw"
            className="object-cover opacity-60 animate-hero-zoom"
          />
        </div>
        
        {/* Multi-Layer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a0a] via-[#3b0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#65000b]/50 via-transparent to-[#3b0a0a]/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3b0a0a]/30 via-transparent to-transparent" />
        
        {/* Content with Staggered Animations */}
        <div className="relative z-10 max-w-4xl">
          <p className="text-gold tracking-[0.4em] text-xs md:text-sm mb-6 font-bold uppercase animate-fade-in-up">
            Established 1950
          </p>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-4 leading-tight text-white text-glow-hero animate-fade-in-up animate-delay-100">
            70 साल का भरोसा
          </h2>
          <p className="text-2xl md:text-4xl font-serif italic text-[#f8f1f1] mb-6 animate-fade-in-up animate-delay-200">
            अब ऑनलाइन भी
          </p>
          <p className="text-white/90 text-lg md:text-xl font-medium mb-12 tracking-wide animate-fade-in-up animate-delay-300">
            Burhar का Trusted Jewellery Store Since 1950s
          </p>
          
          {/* Buttons with Spacing */}
          <div className="flex flex-wrap justify-center gap-8 mt-8 animate-fade-in-up animate-delay-300">
            <Link href="/jewellery" className="bg-white text-[#65000b] px-12 py-5 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-depth-lg hover:shadow-depth-xl border-2 border-white hover:border-gold active:scale-95">
              कलेक्शन देखें
            </Link>
            <a href={`https://wa.me/${PHONE}`} className="btn-primary text-white px-12 py-5 rounded-full font-bold text-lg hover:scale-105 active:scale-95">
              WhatsApp पर पूछें 💬
            </a>
          </div>
        </div>
        
        {/* Gold Divider */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-40 gold-divider" />
      </section>

      {/* 4. TRUST LINE (Enhanced) */}
      <div className="glass-card py-12 border-y border-white/40 section-animate">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-10 md:gap-20 text-sm md:text-base text-[#65000b] font-medium tracking-wide">
          <span className="flex items-center gap-3 shadow-depth px-4 py-2 rounded-full hover:shadow-depth-lg transition-all duration-400"><CheckCircle size={18} className="text-gold"/> 70+ साल का भरोसा</span>
          <span className="flex items-center gap-3 shadow-depth px-4 py-2 rounded-full hover:shadow-depth-lg transition-all duration-400"><CheckCircle size={18} className="text-gold"/> BIS Hallmarked</span>
          <span className="flex items-center gap-3 shadow-depth px-4 py-2 rounded-full hover:shadow-depth-lg transition-all duration-400"><CheckCircle size={18} className="text-gold"/> 4.8 Google Rating</span>
        </div>
      </div>

      {/* 5. CATEGORIES (Visual Cards - Enhanced) */}
      <section className="py-24 container mx-auto px-6 section-animate">
        <h3 className="text-4xl md:text-5xl font-serif text-center mb-4 text-[#65000b]">Shop by Category</h3>
        <div className="gold-divider w-24 mx-auto mb-16" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={`/jewellery?category=${cat.name.toLowerCase()}`} 
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-depth hover:shadow-depth-lg transition-all duration-500 hover:scale-105 image-zoom"
            >
              {/* Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 category-overlay group-hover:opacity-90 transition-all duration-500" />

              {/* Text */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-serif text-xl md:text-2xl font-semibold tracking-wide drop-shadow-lg">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. LATEST DESIGNS (Premium Cards with Depth) */}
      <section className="pb-24 container mx-auto px-6 section-animate">
        <h3 className="text-4xl md:text-5xl font-serif text-center mb-4 text-[#65000b]">लेटेस्ट डिजाइन</h3>
        <div className="gold-divider w-24 mx-auto mb-16" />
        {products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="product-card glass-card rounded-3xl overflow-hidden shadow-depth animate-pulse">
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-6 text-center">
                  <div className="h-5 bg-gray-200 rounded mb-3 mx-auto w-3/4"></div>
                  <div className="h-7 bg-gray-300 rounded mb-4 mx-auto w-1/2"></div>
                  <div className="h-4 bg-green-200 rounded-full mb-4 mx-auto w-2/3"></div>
                  <div className="space-y-3">
                    <div className="h-11 bg-[#65000b]/20 rounded-xl"></div>
                    <div className="h-9 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.slice(0, 4).map(p => {
              const price = Math.round((p.weight * goldRate) + p.making);
              return (
                <div key={p.id} className="group product-card glass-card rounded-3xl overflow-hidden shadow-depth hover:shadow-depth-xl h-full flex flex-col">
                  <div className="aspect-square relative image-zoom">
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a0a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>
                  <div className="p-6 text-center flex flex-col flex-grow justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-[#1a1a1a] tracking-wide">{p.name}</h4>
                      <p className="text-2xl font-bold text-[#65000b] my-3 tracking-wide">₹{price.toLocaleString("en-IN")}</p>
                      <p className="text-green-600 text-xs font-medium mb-4">
                        <span className="bg-green-100/80 px-3 py-1.5 rounded-full">✔ BIS Hallmarked</span>
                      </p>
                    </div>
                    <div className="mt-auto flex flex-col gap-3">
                      <a 
                        href={`https://wa.me/${PHONE}?text=नमस्ते, मुझे ${p.name} में इंटरेस्ट है (₹${price}).`}
                        className="w-full inline-block btn-primary text-white py-3 rounded-xl font-bold text-sm hover:scale-105 active:scale-95"
                      >
                        WhatsApp पर पूछें 💬
                      </a>
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="w-full btn-secondary py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95"
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
      </section>

      {/* 7. FOOTER (Luxury) */}
      <footer className="bg-gradient-to-b from-[#3b0a0a] to-[#1a0505] text-white pt-24 pb-12 border-t-2 border-gold/30 shadow-lg">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-gold font-serif text-3xl md:text-4xl mb-3 tracking-[0.1em]">ANSHU JEWELLERS</h2>
          <p className="text-white/80 text-base mb-12 tracking-wide">Burhar का Trusted Jewellery Store</p>
          <div className="gold-divider w-32 mx-auto mb-10" />
          <div className="flex justify-center gap-10 text-sm text-gray-300 mb-12 tracking-wide">
            <Link href="/terms" className="hover:text-gold transition-all duration-300">Terms</Link>
            <Link href="/privacy" className="hover:text-gold transition-all duration-300">Privacy</Link>
          </div>
          <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase mb-4">
            Since 1950s | BIS Hallmarked Jewellery
          </p>
          <p className="text-[10px] text-gray-500 tracking-wide">
            Powered by <a href="https://lav-digital-site.vercel.app/" target="_blank" className="text-gold font-bold hover:underline transition">BharatOS</a>
          </p>
        </div>
      </footer>

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
                className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/40 transition-all duration-300"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-4 space-y-4">
              <h3 className="text-xl font-bold text-[#1a1a1a] tracking-wide">
                {selectedProduct.name}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50/80 p-3 rounded-xl">
                  <p className="text-gray-600 font-medium">Weight</p>
                  <span className="font-bold text-[#1a1a1a]">{selectedProduct.weight} grams</span>
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl">
                  <p className="text-gray-600 font-medium">Making Charges</p>
                  <span className="font-bold text-[#1a1a1a]">₹{selectedProduct.making.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl">
                  <p className="text-gray-600 font-medium">Category</p>
                  <span className="font-bold text-[#1a1a1a] capitalize">{selectedProduct.category || 'N/A'}</span>
                </div>
                <div className="bg-green-50/80 p-3 rounded-xl">
                  <p className="text-green-600 font-medium">Stock</p>
                  <span className="font-bold text-green-600">{selectedProduct.stock || 0} units</span>
                </div>
              </div>

              <div className="bg-[#65000b]/5 p-4 rounded-xl border border-[#65000b]/10">
                <p className="text-sm text-gray-600 font-medium mb-1">Total Price</p>
                <p className="text-2xl font-bold text-[#65000b] tracking-wide">
                  ₹{Math.round((selectedProduct.weight * goldRate) + selectedProduct.making).toLocaleString("en-IN")}
                </p>
              </div>

              {/* WhatsApp Button in Modal */}
              <a
                href={`https://wa.me/${PHONE}?text=Namaste%20Anshu%20Jewellers,%20mujhe%20${selectedProduct.name}%20(₹${Math.round((selectedProduct.weight * goldRate) + selectedProduct.making).toLocaleString("en-IN")})%20ke%20bare%20me%20jankari%20chahiye.`}
                target="_blank"
                className="btn-primary w-full text-white py-4 rounded-xl font-bold text-lg mt-6 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <span>WhatsApp पर पूछें 💬</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
