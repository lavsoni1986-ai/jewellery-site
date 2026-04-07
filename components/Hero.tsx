"use client";

import Link from "next/link";
import Image from "next/image";
import { PHONE } from "@/lib/config";
import FadeUp from "./FadeUp";
import { useApp } from "@/context/AppContext";

export default function Hero() {
  const { goldRate, goldRateTimestamp, loading } = useApp();

  const formatTimestamp = (ts: number | null) => {
    if (!ts) return "Updating...";

    const date = new Date(ts);
    return `today at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <>
      <section className="hero-section pt-10 pb-12 md:pt-14 md:pb-16">
        <div className="container-luxury grid md:grid-cols-2 gap-16 hero">

          {/* LEFT */}
          <div className="max-w-md hero-text">
            <FadeUp>
              <div className="brand-wrapper mb-6">
                <h1 className="brand-name">
                  ANSHU JEWELLERS
                </h1>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="mb-6 since">
                SINCE 1950
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <p className="mb-8">
                70 साल का भरोसा। अब ऑनलाइन भी।
              </p>
            </FadeUp>

            <FadeUp delay={0.6}>
              <div className="flex gap-4">
                <Link href="/jewellery" className="btn-outline">
                  कलेक्शन देखें
                </Link>

                <a
                  href={`https://wa.me/${PHONE}?text=Hi, I'm interested in your jewelry collection. कृपया आज के gold rate पर prices और availability बताएं।`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  onClick={() => {
                    // Analytics tracking
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'hero_whatsapp_click', {
                        event_category: 'conversion',
                        event_label: 'hero_cta'
                      });
                    }
                  }}
                >
                  WhatsApp पर पूछें
                </a>
              </div>
            </FadeUp>

            <FadeUp delay={0.7}>
              <p className="hero-tagline">
                TRUSTED BY GENERATIONS
              </p>
            </FadeUp>

            <FadeUp delay={0.8}>
              <p className="text-sm tracking-widest mt-4 text-[#A08A8A]">
                REAL-TIME PRICING • PRECISION DRIVEN
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatTimestamp(goldRateTimestamp)}
              </p>
            </FadeUp>

            <FadeUp delay={0.8}>
              <p className="mt-6 text-sm italic text-[#8A6A6A]">
                हर गहना सिर्फ सोना नहीं… एक याद है
              </p>
            </FadeUp>
          </div>

          {/* RIGHT */}
          <FadeUp delay={0.3}>
            <div className="image-hover relative w-full h-[500px] md:h-[650px]">
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"
                fill
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="hero-image animate-hero-zoom object-cover object-[center_30%]"
                alt="Luxury Jewellery"
              />
            </div>
          </FadeUp>

        </div>
      </section>

      {/* Mobile Instagram Icon */}
      <div className="flex flex-col items-center mt-4 md:hidden">
        <a href="https://instagram.com/anshujewl.forever" target="_blank" className="hover:opacity-70 transition-opacity">
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <p className="text-sm text-gray-600 mt-1">Follow Us</p>
      </div>
    </>
  );
}