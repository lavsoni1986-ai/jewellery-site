"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { PHONE } from "@/lib/config";
import {
Heart,
Menu,
X,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  weight: number;
  making: number;
  image: string;
  stock?: number;
  category?: string;
}



export default function Home() {

const [goldRate, setGoldRate] = useState<number>(0);

const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchGoldRate = async () => {
      const goldRateDoc = await getDoc(doc(db, "goldRate", "current"));
      if (goldRateDoc.exists()) {
        setGoldRate(goldRateDoc.data().rate);
      }
    };

    fetchGoldRate();

    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(data);
        console.log('Fetched products:', data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

const Navbar = ({ goldRate }: { goldRate: number }) => {
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
  <div className="bg-black/90 backdrop-blur-md text-[#D4AF37] text-[11px] py-[3px] px-4 flex justify-between">
      <span>Gold Rate Today: ₹{goldRate ? goldRate : "..."} / gram</span>
     <span>📞 {PHONE}</span>
  </div>

  {/* OFFER BAR */}
    <div className="bg-[#D4AF37] text-black text-center text-xs py-[4px] font-medium tracking-wide">
      ✨ आज का ऑफर: मेकेन चार्जेस में डिस्काउंट | अभी कॉल करें
    </div>
</div>
<nav
 className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md py-1 shadow-lg border-b border-[#D4AF37]/20"
          : "bg-transparent py-1"
      }`}
>
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
};

const CategoryCard = ({ title, img }: { title: string; img: string }) => (
  <div className="relative h-[180px] md:h-[220px] w-full overflow-hidden rounded-xl cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
    <Image
      src={img}
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute bottom-0 w-full bg-black/60 py-3 text-center group-hover:bg-black/80 transition-colors duration-300">
      <p className="text-[#f5d06f] font-semibold text-lg">{title}</p>
    </div>
  </div>
);

return ( <div className="bg-black text-white pt-[60px]"> <Navbar goldRate={goldRate} />

  {/* HERO */}
  <section className="h-screen flex items-center justify-center relative overflow-hidden">
    <Image
      src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f"
      alt="hero"
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70"></div>
    <div className="relative text-center z-10 animate-fade-in">
      <h2 className="text-5xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
        70 साल का भरोसा – अब ऑनलाइन भी 💎
      </h2>
      <p className="text-gray-300 mt-3">
        Trusted Jewellery Shop in Burhar Since 1950s
      </p>
      <div className="flex gap-4 mt-4 text-xs text-gray-300 justify-center">
        <span>✔ BIS Hallmarked</span>
        <span>✔ 100% Certified Gold</span>
      </div>
      <div className="flex gap-6 justify-center mt-8">
        <Link href="/jewellery">
          <button className="btn-gold px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]">
            अभी देखें
          </button>
        </Link>
        <a
          href="https://wa.me/919425182098"
          className="btn-whatsapp px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]"
        >
          WhatsApp पर पूछें 💬
        </a>
      </div>
    </div>
  </section>

  {/* CATEGORY */}
  <section className="py-16 px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Link href="/jewellery?category=ring">
      <CategoryCard
        title="Rings"
        img="https://images.unsplash.com/photo-1605100804763-247f67b3557e"
      />
    </Link>
    <Link href="/jewellery?category=necklace">
      <CategoryCard
        title="Necklace"
        img="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f"
      />
    </Link>
    <Link href="/jewellery?category=bangles">
      <CategoryCard
        title="Bangles"
        img="https://images.unsplash.com/photo-1611591437281-460bfbe1220a"
      />
    </Link>
    <Link href="/jewellery?category=earrings">
      <CategoryCard
        title="Earrings"
        img="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908"
      />
    </Link>
    </div>
  </section>



  {/* FEATURED PRODUCTS */}
  {(() => { console.log('Products:', products); return true; })() && (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl text-[#D4AF37] text-center mb-8">हमारे लेटेस्ट डिजाइन</h2>
        <div className={`grid gap-6 ${products.slice(0, 4).length === 1 ? 'grid-cols-1 justify-center' : 'grid-cols-2 md:grid-cols-4'}`}>
        {products.slice(0, 4).map(product => {
          const price = Math.round((product.weight * goldRate) + product.making);
          return (
            <div key={product.id} className="bg-black border border-[#D4AF37] rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 hover:scale-105">
              <div className="relative w-full h-[200px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-white font-semibold">{product.name}</h3>
                <p className="text-[#D4AF37] text-lg font-bold">₹{price}</p>
                <p className="text-green-400 text-sm">✔ BIS Hallmarked</p>
                <a
                  href={`https://wa.me/${PHONE}?text=मैं ${product.name} में इंटरेस्टेड हूँ (₹${price}) GSTIN: 23DKHPS2997L1ZD`}
                  target="_blank"
                  className="block mt-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-2 rounded transition"
                >
                  WhatsApp पर पूछें 💬
                </a>
                <Link href="/jewellery?category=ring" className="block mt-2 border border-[#D4AF37] text-[#D4AF37] py-2 rounded hover:bg-[#D4AF37] hover:text-black transition">
                  डिटेल्स देखें
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  )}

  {/* TRUST SECTION */}
  <section className="text-center py-10 bg-black border-t border-gray-800">
    <h3 className="text-2xl text-[#D4AF37] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
      Why Choose Us ✨
    </h3>

    <div className="flex flex-col md:flex-row justify-center gap-8 text-gray-300">
      <div className="flex items-center gap-2 animate-fade-in" style={{animationDelay: '0.2s'}}>⭐ 70+ Saal ka Bharosa</div>
      <div className="flex items-center gap-2 animate-fade-in" style={{animationDelay: '0.4s'}}>💎 BIS Hallmarked Jewellery</div>
      <div className="flex items-center gap-2 animate-fade-in" style={{animationDelay: '0.6s'}}>⚖️ Best Making Charges</div>
      <div className="flex items-center gap-2 animate-fade-in" style={{animationDelay: '0.8s'}}>🏪 Trusted Local Store</div>
    </div>
  </section>

  {/* INSTAGRAM FOLLOW */}
  <section className="instagram-section py-16 px-6">
    <div className="container mx-auto text-center">
      <h3 className="text-3xl text-[#D4AF37] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        Follow Us on Instagram ✨
      </h3>
      <p className="text-gray-300 mb-6">
        Daily Designs • Latest Offers • Real Jewellery 💎
      </p>
      <a
        href="https://instagram.com/anshujewl.forever"
        target="_blank"
        className="btn-gold px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
      >
        @anshujewl.forever → Follow Now
      </a>
    </div>
  </section>

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
    <p className="text-xs text-gray-500 mt-1">
      Powered by <a href="https://lav-digital-site.vercel.app/" target="_blank" className="text-yellow-500 hover:underline">Bharat OS</a>
    </p>
  </footer>
</div>

);
}
