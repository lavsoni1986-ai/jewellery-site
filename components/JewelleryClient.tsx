"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PHONE } from "@/lib/config";
import { X, MessageCircle } from "lucide-react";
import { optimizeCloudinaryUrl, enhanceJewelleryImage } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

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

const CATEGORY_MAP: { [key: string]: string } = {
  // Rings
  "ring": "ring", "rings": "ring", "anguthi": "ring", "अंगूठी": "ring", "chhalla": "ring", "finger ring": "ring", "engagement ring": "ring",
  // Bangles
  "bangle": "bangle", "bangles": "bangle", "kangan": "bangle", "kangal": "bangle", "bala": "bangle", "chuda": "bangle", "चूड़ी": "bangle", "कंगन": "bangle", "bracelet": "bangle", "payal": "bangle", "anklet": "bangle",
  // Earrings
  "earring": "earring", "earrings": "earring", "jhumka": "earring", "tops": "earring", "झुमका": "earring", "studs": "earring", "hoops": "earring",
  // Necklaces
  "necklace": "necklace", "necklaces": "necklace", "haar": "necklace", "set": "necklace", "हार": "necklace", "mala": "necklace", "chain": "necklace", "pendant": "necklace", "locket": "necklace", "choker": "necklace",
  // Additional Categories for Future-Proofing
  "nose ring": "nose ring", "mangalsutra": "mangalsutra"
};

// Normalization function: किसी भी शब्द को 'Sovereign Key' में बदलेगा, अब कैपिटलाइजेशन और स्पेसल कैरेक्टर्स को भी हैंडल करें
const getSovereignKey = (term: string) => {
  const cleanTerm = (term || "").toLowerCase().trim().replace(/s$/, "").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, " ");
  return CATEGORY_MAP[cleanTerm] || cleanTerm;
};

export default function JewelleryClient() {
  const { goldRate, goldRateTimestamp } = useApp();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userInterest, setUserInterest] = useState<string | null>(null);
  const [productClicks, setProductClicks] = useState<{[key: string]: number}>({});
  const [liveStatus, setLiveStatus] = useState<string>("Loading...");
  const [timeAgo, setTimeAgo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [purityFilter, setPurityFilter] = useState("all");
  const [weightFilter, setWeightFilter] = useState("all");
  const [designFilter, setDesignFilter] = useState("all");



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

    // Load user interest
    const savedInterest = localStorage.getItem("userInterest");
    if (savedInterest) setUserInterest(savedInterest);

    // Load product clicks
    const savedClicks = localStorage.getItem("productClicks");
    if (savedClicks) setProductClicks(JSON.parse(savedClicks));
  }, []);

  // Sync lastUpdate from context
  useEffect(() => {
    if (goldRateTimestamp) {
      setLastUpdate(new Date(goldRateTimestamp));
    }
  }, [goldRateTimestamp]);

  useEffect(() => {
    const handler = (e: Event) => {
      setSelectedProduct((e as CustomEvent<Product>).detail);
    };

    window.addEventListener("openProduct", handler);
    return () => window.removeEventListener("openProduct", handler);
  }, []);



  // Update live status
  useEffect(() => {
    const updateStatus = () => {
      const minutesAgo = Math.floor((Date.now() - lastUpdate.getTime()) / 60000);
      if (minutesAgo <= 5) {
        setLiveStatus("🟢 LIVE");
        setTimeAgo("Just now");
      } else if (minutesAgo <= 30) {
        setLiveStatus("🟡 Updating");
        setTimeAgo(`${minutesAgo} min ago`);
      } else {
        setLiveStatus("🔴 Stale");
        setTimeAgo(`${minutesAgo} min ago`);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // update every minute
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // A. कैटेगरी फ़िल्टर (मौजूदा लॉजिक)
      const dbCat = getSovereignKey(p.category || "");
      const categoryMatch = filter === "all" || dbCat === getSovereignKey(filter);

      // B. शुद्धता (Purity) फ़िल्टर
      const productCarat = p.carat || 22;
      const purityMatch = purityFilter === "all" || productCarat.toString() === purityFilter;

      // C. बजट (Budget) फ़िल्टर
      const goldValue = p.weight * (goldRate || 0);
      const price = Math.round((goldValue * (1 + p.making / 100)) * 1.03);

      let budgetMatch = true;
      if (budgetFilter === "under50k") budgetMatch = price < 50000;
      else if (budgetFilter === "50k-1.5l") budgetMatch = price >= 50000 && price <= 150000;
      else if (budgetFilter === "above1.5l") budgetMatch = price > 150000;

      // D. वजन (Weight) फ़िल्टर (नया)
      let weightMatch = true;
      if (weightFilter === "light") weightMatch = p.weight < 5;
      else if (weightFilter === "medium") weightMatch = p.weight >= 5 && p.weight <= 15;
      else if (weightFilter === "heavy") weightMatch = p.weight > 15;

      // E. डिजाइन (Design) फ़िल्टर (नया)
      const designMatch = designFilter === "all" || (p.category && p.category.toLowerCase() === designFilter.toLowerCase());

      return categoryMatch && purityMatch && budgetMatch && weightMatch && designMatch;
    }).sort((a, b) => (a.name || "").localeCompare(b.name || "")).filter(p => {
      if (searchTerm) {
        const searchKey = searchTerm.toLowerCase().trim();
        return (p.name || "").toLowerCase().includes(searchKey);
      }
      return true;
    });
  }, [products, filter, budgetFilter, purityFilter, weightFilter, designFilter, goldRate, searchTerm]);

  const getGoldStatus = () => {
    return { label: "Live Rate", color: "text-green-600" };
  };

  const getSimilarProducts = (current: Product) => {
    if (!goldRate) return [];
    const currentPrice = Math.round((current.weight * goldRate) * (1 + current.making / 100));
    return products.filter(p =>
      p.id !== current.id &&
      p.category === current.category &&
      Math.abs(Math.round((p.weight * goldRate) * (1 + p.making / 100)) - currentPrice) < 10000
    ).slice(0, 3); // limit to 3
  };

  const handleProductClick = (productId: string) => {
    const newClicks = { ...productClicks, [productId]: (productClicks[productId] || 0) + 1 };
    setProductClicks(newClicks);
    localStorage.setItem("productClicks", JSON.stringify(newClicks));
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
    <div className="bg-gradient-to-b from-[#fff5f5] via-[#fce4e4] to-[#f8f1f1] text-[#1a1a1a] min-h-screen selection:bg-rosewood selection:text-white pb-28 md:pb-16 noise-bg">
      {/* GOLD RATE BAR */}
      {goldRate > 0 && (
        <div className="bg-black text-[#D4AF37]/90 text-center py-1 border-b border-[#D4AF37]/10 fixed top-0 w-full z-50 gold-strip flex justify-center items-center gap-4">
          <span>{liveStatus} • Gold: ₹{goldRate.toLocaleString("en-IN")}/gm • {timeAgo}</span>
          <a
            href={`https://wa.me/${PHONE}?text=Hi, I saw the current gold rate ₹${goldRate.toLocaleString("en-IN")}/gm. Can we discuss booking at this price?`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-[#D4AF37] text-black px-3 py-1 rounded-full hover:bg-[#B8860B] transition"
          >
            Book Now 💬
          </a>
        </div>
      )}





      {/* What are you looking for? */}
      <div className="hero-section text-center">
        <h3 className="text-xl font-serif text-[#65000b] mb-6 tracking-wide">What are you looking for?</h3>
        <div className="flex flex-wrap justify-center items-center gap-3 px-4 w-full max-w-md">
          <button
            onClick={() => {
              setFilter("necklace");
              setUserInterest("necklace");
              localStorage.setItem("userInterest", "necklace");
            }}
            className="category-btn"
          >
            Bridal Jewellery
          </button>
          <button
            onClick={() => {
              setFilter("ring");
              setUserInterest("ring");
              localStorage.setItem("userInterest", "ring");
            }}
            className="category-btn"
          >
            Daily Wear
          </button>
          <button
            onClick={() => {
              setFilter("all");
              // TODO: Add budget filter logic
            }}
            className="category-btn"
          >
            Budget under ₹50K
          </button>
          <button
            onClick={() => {
              setFilter("bangle");
              setUserInterest("bangle");
              localStorage.setItem("userInterest", "bangle");
            }}
            className="category-btn"
          >
            Heavy Designs
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        {/* 1. SECTION HEADER + FILTER */}
        <div className="w-full flex flex-col items-center mt-10">
          <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight text-center px-4 text-[#65000b]">
  OUR COLLECTION
</h1>

          <div className="filter-container flex flex-col lg:flex-row gap-4 mt-4 lg:mt-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="category-btn"
            >
              <option value="all">All Collection</option>
              <option value="ring">Rings (अंगूठी)</option>
              <option value="necklace">Necklace (हार)</option>
              <option value="bangle">Bangles (कंगन/चूड़ी)</option>
              <option value="earring">Earrings (झुमका)</option>
              <option value="bracelet">Bracelets</option>
              <option value="anklet">Anklets</option>
            </select>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input p-3 bg-black border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#D4AF37] placeholder-gray-400"
            />
          </div>
        </div>

        {/* Enhanced Filter Section */}
        {!loading && !error && (
          <div className="flex flex-wrap gap-4 mb-8 bg-white/50 p-4 rounded-2xl backdrop-blur-md border border-[#D4AF37]/20 shadow-lg">
            {/* बजट फ़िल्टर */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Budget</label>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="category-btn !py-2 !text-xs hover:bg-[#D4AF37]/10 transition-colors"
              >
                <option value="all">Any Budget</option>
                <option value="under50k">Daily Luxury (Under ₹50K)</option>
                <option value="50k-1.5l">Investment Grade (₹50K - ₹1.5L)</option>
                <option value="above1.5l">Heritage (Above ₹1.5L)</option>
              </select>
            </div>

            {/* शुद्धता फ़िल्टर */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Purity</label>
              <select
                value={purityFilter}
                onChange={(e) => setPurityFilter(e.target.value)}
                className="category-btn !py-2 !text-xs hover:bg-[#D4AF37]/10 transition-colors"
              >
                <option value="all">All Purity</option>
                <option value="18">18KT (Rose/White Gold)</option>
                <option value="22">22KT (Yellow Gold)</option>
              </select>
            </div>

            {/* वजन फ़िल्टर (नया) */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Weight</label>
              <select
                value={weightFilter}
                onChange={(e) => setWeightFilter(e.target.value)}
                className="category-btn !py-2 !text-xs hover:bg-[#D4AF37]/10 transition-colors"
              >
                <option value="all">Any Weight</option>
                <option value="light">Light (&lt;5g)</option>
                <option value="medium">Medium (5-15g)</option>
                <option value="heavy">Heavy (&gt;15g)</option>
              </select>
            </div>

            {/* डिजाइन फ़िल्टर (नया) */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Design</label>
              <select
                value={designFilter}
                onChange={(e) => setDesignFilter(e.target.value)}
                className="category-btn !py-2 !text-xs hover:bg-[#D4AF37]/10 transition-colors"
              >
                <option value="all">All Designs</option>
                <option value="ring">Ring</option>
                <option value="necklace">Necklace</option>
                <option value="earring">Earring</option>
                <option value="bracelet">Bracelet</option>
              </select>
            </div>

            {/* रीसेट बटन (नया) */}
            <div className="flex items-end">
    <button
      onClick={() => {
        setBudgetFilter("all");
        setPurityFilter("all");
        setWeightFilter("all");
        setDesignFilter("all");
        setFilter("all");
        setSearchTerm("");
      }}
      className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#B8860B] transition-colors"
    >
      Reset Filters
    </button>
            </div>
          </div>
        )}

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
              const goldValue = product.weight * (goldRate || 0);
              const makingCharges = goldValue * (product.making / 100);
              const subtotal = goldValue + makingCharges;
              const gst = subtotal * 0.03;
              const price = Math.round(subtotal + gst);
              return (
                <div key={product.id} className="group product-card glass-card rounded-3xl overflow-hidden shadow-depth hover:shadow-depth-xl h-full flex flex-col">
                  <div className="overflow-hidden image-zoom" onClick={() => handleProductClick(product.id)}>
                     <Image
                       src={enhanceJewelleryImage(product.image)}
                       alt={product.name}
                       width={400}
                       height={400}
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                       priority={filteredProducts.indexOf(product) === 0}
                       className="w-full h-64 object-cover"
                     />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a0a]/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                  </div>
                  
                  <div className="p-6 flex flex-col gap-3 flex-grow justify-between">
                    <div>
                      <h3 className="text-[#1a1a1a] text-lg font-medium tracking-wide truncate">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-[#65000b] text-2xl font-bold tracking-wide">₹{price.toLocaleString("en-IN")}</p>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-[#D4AF37] hover:text-[#B8860B] transition-colors"
                          title="View price breakdown"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-green-600 text-xs font-medium mt-2">
                        <span className="bg-green-100/80 px-3 py-1.5 rounded-full">✔ BIS Hallmarked</span>
                        {product.carat === 18 && <span className="bg-rose-100/80 px-3 py-1.5 rounded-full ml-2">🌹 Rose Gold</span>}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 mt-auto">
                      <a
                        href={`https://wa.me/${PHONE}?text=${encodeURIComponent(generateWhatsAppMessage(product, goldRate))}`}
                        target="_blank"
                        rel="noopener noreferrer"
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

        {/* Personalized Recommendations */}
        {userInterest && (
          <div className="mt-16">
            <h2 className="text-3xl font-serif text-[#65000b] text-center mb-8 tracking-wide">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter(p => p.category === userInterest)
                .slice(0, 3)
                .map((product) => {
                  const price = Math.round((product.weight * (goldRate || 0)) * (1 + product.making / 100));
                  return (
                    <div key={product.id} className="group product-card glass-card rounded-2xl overflow-hidden shadow-depth hover:shadow-depth-lg" onClick={() => handleProductClick(product.id)}>
                      <div className="overflow-hidden">
                        <Image
                          src={enhanceJewelleryImage(product.image)}
                          alt={product.name}
                          width={300}
                          height={300}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#1a1a1a] text-sm font-medium truncate">{product.name}</h3>
                        <p className="text-[#65000b] text-lg font-bold">₹{price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Trending Now */}
        {Object.keys(productClicks).length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-serif text-[#65000b] text-center mb-12 tracking-wide">🔥 Trending in Your Area</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(productClicks)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([productId]) => {
                  const product = products.find(p => p.id === productId);
                  if (!product) return null;
                  const price = Math.round((product.weight * (goldRate || 0)) * (1 + product.making / 100));
                  return (
                    <div key={product.id} className="group product-card glass-card rounded-2xl overflow-hidden shadow-depth hover:shadow-depth-lg">
                      <div className="overflow-hidden">
                        <Image
                          src={enhanceJewelleryImage(product.image)}
                          alt={product.name}
                          width={300}
                          height={300}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#1a1a1a] text-sm font-medium truncate">{product.name}</h3>
                        <p className="text-[#65000b] text-lg font-bold">₹{price.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Trust + AI */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-xl">
              <div className="text-2xl mb-2">🤖</div>
              <p className="text-xs font-medium text-[#65000b]">AI Verified Pricing</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="text-2xl mb-2">✔</div>
              <p className="text-xs font-medium text-[#65000b]">BIS Hallmarked</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-xs font-medium text-[#65000b]">70+ Years Trust</p>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-xs font-medium text-[#65000b]">Transparent Billing</p>
            </div>
          </div>
        </div>
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
                src={enhanceJewelleryImage(selectedProduct.image)}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 448px"
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

              {/* Smart Question Flow */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Need help choosing?</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      // Filter similar for wedding/bridal
                      setFilter("necklace");
                    }}
                    className="text-xs bg-[#65000b]/10 text-[#65000b] px-3 py-1 rounded-full hover:bg-[#65000b]/20 transition"
                  >
                    For wedding
                  </button>
                  <button
                    onClick={() => {
                      // Filter daily wear
                      setFilter("ring");
                    }}
                    className="text-xs bg-[#65000b]/10 text-[#65000b] px-3 py-1 rounded-full hover:bg-[#65000b]/20 transition"
                  >
                    For daily use
                  </button>
                  <button
                    onClick={() => {
                      // Filter gifting options
                      setFilter("earring");
                    }}
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
                     const goldValue = selectedProduct.weight * goldRate;
                     const makingCharges = goldValue * (selectedProduct.making / 100);
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
                           <span className="text-gray-600">Making ({selectedProduct.making}%)</span>
                           <span className="font-bold text-[#1a1a1a]">₹{makingCharges.toLocaleString("en-IN")}</span>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-gray-600">GST (3%)</span>
                           <span className="font-bold text-[#1a1a1a]">₹{gst.toLocaleString("en-IN")}</span>
                         </div>
                         <div className="flex justify-between items-center bg-[#65000b]/10 p-4 rounded-xl mt-4">
                           <span className="text-[#65000b] font-medium">Total Price</span>
                           <span className="text-2xl font-bold text-[#65000b]">₹{total.toLocaleString("en-IN")}</span>
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

                         {getGoldStatus().label.includes('High volatility') && (
                           <div className="text-sm text-red-600 mt-2 flex items-center gap-1">
                             ⚠ Gold prices are fluctuating today
                           </div>
                         )}
                       </>
                     );
                   })()}
                 </div>
               </div>

               {/* AI Recommendations */}
               {selectedProduct && getSimilarProducts(selectedProduct).length > 0 && (
                 <div className="mt-6">
                   <h3 className="text-lg font-semibold text-[#65000b] mb-3 flex items-center gap-2">
                     🤖 AI Curated Designs For You
                   </h3>
                   <div className="grid grid-cols-1 gap-3">
                     {getSimilarProducts(selectedProduct).map((sim) => {
                       const simPrice = Math.round((sim.weight * goldRate) * (1 + sim.making / 100));
                       return (
                          <div key={sim.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition" onClick={() => setSelectedProduct(sim)}>
                             <Image
                               src={enhanceJewelleryImage(sim.image)}
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
                  href={`https://wa.me/${PHONE}?text=${encodeURIComponent(generateWhatsAppMessage(selectedProduct, goldRate))}`}
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
      )}
    </div>
  );
}
