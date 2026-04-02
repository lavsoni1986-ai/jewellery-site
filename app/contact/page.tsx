"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PHONE } from "@/lib/config";
import { db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import {
Heart,
Menu,
X,
} from "lucide-react";

export default function Contact() {

const [goldRate, setGoldRate] = useState<number>(0);

useEffect(() => {
  const fetchGoldRate = async () => {
    const goldRateDoc = await getDoc(doc(db, "goldRate", "current"));
    if (goldRateDoc.exists()) {
      setGoldRate(goldRateDoc.data().rate);
    }
  };
  fetchGoldRate();
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
  <div className="bg-black/90 backdrop-blur-md text-[#D4AF37] text-[11px] py-[3px] px-4 flex justify-between">
    <span>Gold Rate: ₹{goldRate} / Gram</span>
    <span>📞 {PHONE}</span>
  </div>

  {/* OFFER BAR */}
  <div className="bg-[#D4AF37] text-black text-center text-xs py-[4px] font-medium tracking-wide">
    ✨ Today Offer: Making Charges Discount Available | Call Now
  </div>
</div>
<nav
className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md py-2 shadow-lg border-b border-[#D4AF37]/20"
          : "bg-transparent py-2"
      }`}
>
  <div className="container mx-auto px-4 flex justify-between items-center">
    <div className="hidden md:flex gap-6 text-sm text-gray-300">
      <Link href="/">Home</Link>
      <Link href="/jewellery">Jewellery</Link>
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

return (
<div className="bg-black text-white min-h-screen pt-[60px]">
  <Navbar />

  <div className="p-10">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-8">Contact Us</h1>

      <div className="bg-[#111111] border border-[#D4AF37] rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl text-[#D4AF37] font-semibold mb-6">Anshu Jewellers</h2>

        <div className="space-y-4 text-lg">
          <p><strong>Phone:</strong> +91 {PHONE}</p>
          <p><strong>Address:</strong> Jain Mandir Rd, Burhar, 484110</p>
          <p className="text-gray-400"><strong>GSTIN:</strong> 23DKHPS2997L1ZD</p>
        </div>

        <a
          href={`https://wa.me/91${PHONE}?text=Hi, I want to visit your shop`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 bg-[#25D366] text-white py-3 px-6 rounded-lg hover:bg-[#128C7E] transition duration-300 font-semibold"
        >
          Contact on WhatsApp
        </a>
      </div>
    </div>
  </div>

  <div className="mt-10">
    <iframe
      src="https://www.google.com/maps?q=Jain+Mandir+Rd+Burhar&output=embed"
      className="w-full h-[300px] rounded-lg border border-[#D4AF37]/30"
      loading="lazy"
    ></iframe>

    <a
      href="https://maps.google.com/?q=Jain Mandir Rd Burhar"
      target="_blank"
      className="block mt-4 text-center bg-[#D4AF37] text-black py-2 rounded"
    >
      📍 Visit Shop on Google Maps
    </a>
  </div>

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