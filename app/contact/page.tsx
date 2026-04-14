"use client";

import { useState } from "react";
import Link from "next/link";
import { PHONE } from "@/lib/config";
import { useApp } from "@/context/AppContext";
import { Heart, Menu, X, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  const { goldRate } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff5f5] via-[#fce4e4] to-[#f8f1f1] text-[#1a1a1a] selection:bg-rosewood selection:text-white noise-bg pb-28 md:pb-16">
      {/* NAVIGATION (Refined Glassmorphism) */}
      <nav className="fixed top-0 w-full z-50 glass-nav">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="hidden md:flex gap-8 text-sm font-medium text-[#65000b] tracking-wide">
            <Link href="/" className="hover:text-gold transition-all duration-300">Home</Link>
            <Link href="/jewellery" className="hover:text-gold transition-all duration-300">Collection</Link>
          </div>
          
          <h1 className="text-xl md:text-2xl font-serif tracking-[0.15em] text-[#65000b]">
            ANSHU JEWELLERS <span className="text-[10px] block text-center opacity-70 font-sans tracking-wider">SINCE 1954</span>
          </h1>

          <div className="flex items-center gap-4">
            <Heart size={20} className="text-[#65000b] cursor-pointer hover:text-gold transition-all duration-300 hover:scale-110" />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#65000b] hover:text-gold transition">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO MINI SECTION */}
      <section className="text-center pt-32 pb-12 px-4 section-animate">
        <h1 className="text-4xl md:text-5xl font-serif text-[#65000b] animate-fade-in-up tracking-wide">
          Contact Anshu Jewellers
        </h1>
        <div className="gold-divider w-24 mx-auto mt-4 mb-6" />
        <p className="text-gray-600 mt-3 text-lg tracking-wide">
          70 साल का भरोसा • अब ऑनलाइन भी
        </p>
      </section>

      {/* 2. CONTACT CARD (Luxury with Depth) */}
      <div className="container mx-auto px-4 pb-24 section-animate">
        <div className="max-w-md mx-auto glass-card rounded-3xl p-8 shadow-depth-lg border border-white/40">
          <h2 className="text-2xl font-serif text-[#65000b] text-center mb-8 tracking-wide">
            Get in Touch
          </h2>

          <div className="space-y-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="bg-[#65000b]/10 p-4 rounded-full">
                <Phone className="text-[#65000b]" size={28} />
              </div>
              <p className="text-[#1a1a1a] text-xl font-medium tracking-wide">
                +91 9425182098
              </p>
              <p className="text-gray-500 text-sm">Mon - Sat, 10am - 8pm</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="bg-[#65000b]/10 p-4 rounded-full">
                <MapPin className="text-[#65000b]" size={28} />
              </div>
              <p className="text-gray-600 text-sm tracking-wide">
                Jain Mandir Rd, Burhar
              </p>
            </div>
          </div>

          <button
            className="mt-10 w-full btn-primary text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 text-lg hover:scale-105 active:scale-95"
            onClick={() =>
              window.open(
                `https://wa.me/${PHONE}?text=Namaste%20Anshu%20Jewellers,%20mujhe%20jewellery%20ke%20bare%20me%20puchna%20hai`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <MessageCircle size={22} />
            WhatsApp पर संपर्क करें 💬
          </button>
        </div>

        {/* 3. TRUST STRIP */}
        <div className="text-center mt-12 text-gray-600 text-sm tracking-wide section-animate">
          <p className="flex items-center justify-center gap-2 mb-3">
            <span className="text-gold text-lg">✔</span> BIS Hallmarked Jewellery
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-gold text-lg">✔</span> Trusted Since 1954
          </p>
        </div>

        {/* 4. MAP */}
        <div className="mt-12 max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-depth-lg border border-white/30 glass-card section-animate">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3676.123456789!2d81.123456!3d23.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA3JzM0LjQiTiA4McKwMDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
            className="w-full h-64 grayscale-[0.3] hover:grayscale-0 transition-all duration-500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
