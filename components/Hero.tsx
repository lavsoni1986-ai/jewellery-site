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
  );
}