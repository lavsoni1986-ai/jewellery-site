"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
Heart,
ShoppingCart,
Menu,
X,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  weight: number;
  making: number;
  image: string;
  category: string;
  stock?: number;
}

export default function Jewellery() {

const [goldRate, setGoldRate] = useState<number>(0);
const [products, setProducts] = useState<Product[]>([]);
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(true);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [filter, setFilter] = useState("all");

const searchParams = useSearchParams();

const urlCategory = searchParams.get("category");

useEffect(() => {

  if (urlCategory) {

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
        ...(doc.data() as Omit<Product, 'id'>)
      })));

    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

const Navbar = () => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
const handleScroll = () => setScrolled(window.scrollY > 80);
window.addEventListener("scroll", handleScroll);
return () => window.removeEventListener("scroll", handleScroll);
}, []);

return (
<>
<div className={`transition-all duration-500 ${
  scrolled ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
}`}>
  {/* GOLD RATE BAR */}
  <div className="bg-black/90 backdrop-blur-md text-[#D4AF37] text-xs py-1 px-6 flex justify-between">
    <span>Gold Rate: ₹{goldRate} / Gram</span>
    <span>📞 9425182098</span>
  </div>

  {/* OFFER BAR */}
  <div className="bg-[#D4AF37] text-black text-center text-sm py-1 font-medium tracking-wide">
    ✨ Today Offer: Making Charges Discount Available | Call Now
  </div>
</div>
<nav
className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md py-2 shadow-lg border-b border-[#D4AF37]/20"
          : "bg-transparent py-4"
      }`}
>
  <div className="container mx-auto px-6 flex justify-between items-center">
    <div className="hidden md:flex gap-6 text-sm text-gray-300">
      <Link href="/">Home</Link>
      <Link href="/jewellery">Jewellery</Link>
    </div>

    <h1 className="text-xl md:text-3xl text-[#D4AF37] font-serif tracking-wide">
      Anshu Jewellers | Since 1950s
    </h1>

    <div className="flex gap-4 text-[#D4AF37]">
      <Heart size={18} />
      <ShoppingCart size={18} />
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
};

return (
<div className="bg-black text-white pt-[60px]">
  <Navbar />

  {/* FEATURED */}
  <section className="p-10">
    <h2 className="text-center text-3xl text-[#D4AF37] mb-6">
      Featured Jewellery
    </h2>

    {/* CATEGORY FILTER */}
    <div className="flex gap-3 justify-center mb-6">
      {["all", "ring", "necklace", "bangles"].map((cat) => (
        <button
          key={cat}
          onClick={() => setFilter(cat)}
          className={`px-4 py-2 border ${
            filter === cat ? "bg-[#D4AF37] text-black" : "text-white"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

     {error && <p className="text-red-500 text-center">{error}</p>}

     {loading && <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div></div>}

      {!loading && !error && (
      <div className="grid md:grid-cols-4 gap-6">
        {(() => {
          const filteredProducts =
            filter === "all"
              ? products
              : products.filter((p) => p.category === filter);
          return filteredProducts.map((product) => {
          const price = Math.round((product.weight * (goldRate || 0)) + product.making);
          return (
            <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-black border border-[#D4AF37]/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 group cursor-pointer">

              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />

                {/* GOLD BADGE */}
                <span className="absolute top-2 left-2 bg-[#D4AF37] text-black text-xs px-2 py-1 rounded">
                  Premium
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-4 text-center">

                {/* NAME */}
                <h3 className="text-lg font-semibold">{product.name}</h3>

                {/* PRICE */}
                <p className="text-[#D4AF37] text-xl font-bold mt-2">
                  ₹{price}
                </p>
                <p className="text-green-400 text-xs mt-1">
                  ✔ BIS Hallmarked
                </p>

                {/* TRANSPARENCY */}
                <p className="text-xs text-gray-400">
                  ✔ Making charges included
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  * Price may vary daily
                </p>

                {/* STOCK WARNING */}
                {product.stock !== undefined && product.stock <= 2 && (
                  <p className="text-red-500 text-xs mb-2">
                    ⚠ Only {product.stock} left in stock
                  </p>
                )}

                {/* BUTTONS */}
                <div className="flex flex-col gap-2">

                  {product.stock === 0 ? (
                    <p className="text-red-500 text-sm py-2">Out of Stock</p>
                  ) : (
                    <a
                      href={`https://wa.me/919425182098?text=${encodeURIComponent(
                        `Hi, I am interested in ${product.name}. Price: ₹${price}\n\nGSTIN: 23DKHPS2997L1ZD`
                      )}`}
                      target="_blank"
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window as any).gtag?.('event', 'whatsapp_click', {
                          product: product.name,
                        });
                        saveLead(product);
                      }}
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
          });
        })()}
      </div>
      )}
    </section>

    {/* REVIEW SECTION */}
    <section className="py-10 text-center">
      <h2 className="text-2xl text-[#D4AF37] mb-6">
        What Our Customers Say
      </h2>

      <div className="grid md:grid-cols-3 gap-6 px-6">
        {[
          "Best jewellery shop in Burhar. Trusted since years!",
          "Designs are amazing and prices are fair.",
          "Very polite owner and great service."
        ].map((review, i) => (
          <div key={i} className="border border-[#D4AF37]/20 p-4 rounded">
            ⭐⭐⭐⭐⭐
            <p className="text-gray-300 mt-2">{review}</p>
          </div>
        ))}
      </div>
    </section>

    {/* PRODUCT QUICK VIEW POPUP */}
   {selectedProduct && (
     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
       <div className="bg-black p-6 rounded-lg max-w-md w-full border border-[#D4AF37]/30">

          <Image
            src={selectedProduct.image}
            alt={selectedProduct.name}
            width={300}
            height={300}
            loading="lazy"
            className="mx-auto"
          />

         <h2 className="text-xl text-center mt-4">
           {selectedProduct.name}
         </h2>

         <p className="text-center text-[#D4AF37] text-lg">
           ₹{Math.round((selectedProduct.weight * goldRate) + selectedProduct.making)}
         </p>

           {selectedProduct.stock === 0 ? (
             <p className="text-center text-red-500 mt-4 py-2">Out of Stock</p>
           ) : (
             <a
               href={`https://wa.me/919425182098?text=${encodeURIComponent(
                 `Interested in ${selectedProduct.name}. Price: ₹${Math.round((selectedProduct.weight * goldRate) + selectedProduct.making)}\n\nGSTIN: 23DKHPS2997L1ZD`
               )}`}
               onClick={() => {
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 (window as any).gtag?.('event', 'whatsapp_click', {
                   product: selectedProduct.name,
                 });
                 saveLead(selectedProduct);
               }}
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

     {/* FOOTER */}
   <footer className="text-center p-6 border-t border-gray-800">
     <p className="text-gray-500">© 2026 Anshu Jewellers</p>
     <p className="text-gray-500 text-sm">
       Best Jewellery Shop in Burhar, Shahdol (M.P.)
     </p>
     <div className="flex justify-center gap-4 text-sm text-gray-500 mt-2">
       <Link href="/terms">Terms & Conditions</Link>
       <Link href="/privacy">Privacy Policy</Link>
     </div>
    <p className="text-gray-500 text-sm mt-2">
      GSTIN: 23DKHPS2997L1ZD
    </p>
   </footer>
</div>
);
}