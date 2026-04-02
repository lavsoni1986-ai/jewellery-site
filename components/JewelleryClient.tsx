"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
Heart,
Menu,
X,
} from "lucide-react";
import { PHONE } from "@/lib/config";

interface Product {
  id: string;
  name: string;
  weight: number;
  making: number;
  image: string;
  stock?: number;
  category?: string;
}

const Navbar = ({ goldRate, isMenuOpen, setIsMenuOpen, scrolled }: { goldRate: number; isMenuOpen: boolean; setIsMenuOpen: (open: boolean) => void; scrolled: boolean }) => (
  <>
    <div className={`transition-all duration-500 ${
      scrolled ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
    }`}>
      <div className="bg-black/90 backdrop-blur-md text-[#D4AF37] text-xs py-1 px-6 flex justify-between">
        <span>Gold Rate: ₹{goldRate} / Gram</span>
        <span>📞 {PHONE}</span>
      </div>
      <div className="bg-[#D4AF37] text-black text-center text-xs py-[4px] font-medium tracking-wide">
        ✨ Today Offer: Making Charges Discount Available | Call Now
      </div>
    </div>
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? "bg-black/95 backdrop-blur-md py-1 shadow-lg border-b border-[#D4AF37]/20" : "bg-transparent py-1"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <Link href="/" className="hover:text-[#f5d06f] transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#D4AF37] after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full">Home</Link>
          <Link href="/jewellery" className="hover:text-[#f5d06f] transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#D4AF37] after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full">Jewellery</Link>
        </div>
        <h1 className="text-xl md:text-2xl text-[#D4AF37] font-serif tracking-wide">
          Anshu Jewellers | Since 1950s
        </h1>
        <div className="flex gap-4 text-[#D4AF37]">
          <Heart size={18} />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 text-white">
          <Link href="/">Home</Link>
          <Link href="/jewellery">Jewellery</Link>
          <Link href="/contact">Contact</Link>
        </div>
      )}
    </nav>
  </>
);

export default function JewelleryClient() {
  const [goldRate, setGoldRate] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState("all");

  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  useEffect(() => {
    if (urlCategory && urlCategory !== filter) {
      setFilter(urlCategory);
    }
  }, [urlCategory]);

  const fetchGoldRate = async () => {
    const goldRateDoc = await getDoc(doc(db, "goldRate", "current"));
    if (goldRateDoc.exists()) {
      setGoldRate(goldRateDoc.data().rate);
    }
  };

  const saveLead = async (product: Product | null) => {
    if (!product) return;
    try {
      await addDoc(collection(db, "leads"), {
        productName: product.name,
        price: Math.round((product.weight * goldRate) + product.making),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log("Lead save error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchGoldRate();
        const productSnap = await getDocs(collection(db, "products"));
        setProducts(productSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = urlCategory ? products.filter(p => p.category?.toLowerCase().includes("ring") || p.name?.toLowerCase().includes("ring")).slice(0, 4) : (filter === "all" ? products : products.filter((p) => p.category === filter));

  return (
    <div className="bg-black text-white pt-[60px]">
      <Navbar goldRate={goldRate} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} scrolled={scrolled} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl text-[#D4AF37] font-serif">Our Collection</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#111111] border border-[#D4AF37]/30 text-white px-4 py-2 rounded"
          >
            <option value="all">All</option>
            <option value="ring">Rings</option>
            <option value="necklace">Necklace</option>
            <option value="bangles">Bangles</option>
            <option value="earrings">Earrings</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading && <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div></div>}

        {!loading && !error && (
          <div className="grid md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const price = Math.round((product.weight * (goldRate || 0)) + product.making);
              return (
                <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-black border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      loading="lazy"
                      className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-[#D4AF37] text-xl font-bold mt-2">₹{price}</p>
                    <p className="text-green-400 text-xs mt-1">✔ BIS Hallmarked</p>
                    <p className="text-xs text-gray-400">✔ Making charges included</p>
                    <p className="text-xs text-gray-500 mb-3">* Price may vary daily</p>
                    {product.stock !== undefined && product.stock <= 2 && (
                      <p className="text-red-500 text-xs mb-2">⚠ Only {product.stock} left in stock</p>
                    )}
                    <div className="flex flex-col gap-2">
                      {product.stock === 0 ? (
                        <p className="text-red-500 text-sm py-2">Out of Stock</p>
                      ) : (
                        <a
                          href={`https://wa.me/${PHONE}?text=मैं ${product.name} में इंटरेस्टेड हूँ (₹${price}) GSTIN: 23DKHPS2997L1ZD`}
                          target="_blank"
                          onClick={() => saveLead(product)}
                          className="bg-[#25D366] hover:opacity-90 text-white py-2 rounded-lg text-sm"
                        >
                          WhatsApp पर पूछें 💬
                        </a>
                      )}
                      <button className="border border-[#D4AF37] text-[#D4AF37] py-2 rounded-lg text-sm hover:bg-[#D4AF37] hover:text-black transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#111111] p-6 rounded-xl max-w-md w-full mx-4 border border-[#D4AF37]/30">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={300}
                height={300}
                loading="lazy"
                className="mx-auto"
              />
              <h2 className="text-xl text-center mt-4">{selectedProduct.name}</h2>
              <p className="text-center text-[#D4AF37] text-lg">
                ₹{Math.round((selectedProduct.weight * goldRate) + selectedProduct.making)}
              </p>
              {selectedProduct.stock === 0 ? (
                <p className="text-center text-red-500 mt-4 py-2">Out of Stock</p>
              ) : (
                <a
                  href={`https://wa.me/${PHONE}?text=Interested in ${selectedProduct.name}. Price: ₹${Math.round((selectedProduct.weight * goldRate) + selectedProduct.making)}\n\nGSTIN: 23DKHPS2997L1ZD`}
                  onClick={() => saveLead(selectedProduct)}
                  className="block text-center bg-[#25D366] mt-4 py-2 rounded"
                >
                  WhatsApp पर पूछें 💬
                </a>
              )}
              <button
                onClick={() => setSelectedProduct(null)}
                className="mt-3 w-full border py-2 border-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center p-6 border-t border-gray-800 mt-10">
        <p className="text-xs text-gray-500">
          Powered by <a href="https://lav-digital-site.vercel.app/" target="_blank" className="text-yellow-500 hover:underline">Bharat OS</a>
        </p>
      </footer>
    </div>
  );
}