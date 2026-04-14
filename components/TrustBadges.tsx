"use client";

import { useEffect, useState } from "react";

export default function TrustBadges() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500); // Delay for effect
    return () => clearTimeout(timer);
  }, []);

  const badges = [
    { icon: "✔", text: "BIS Hallmarked", desc: "Government Certified Purity" },
    { icon: "💰", text: "Transparent Pricing", desc: "No Hidden Costs" },
    { icon: "🏛️", text: "70+ Years Trust", desc: "Since 1954 in Shahdol" },
    { icon: "⭐", text: "Local Authority", desc: "Shahdol's Trusted Jeweller" }
  ];

  return (
    <section className={`py-4 bg-white/90 backdrop-blur-sm border-y border-[#D4AF37]/20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 group cursor-default"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                <span className="text-lg">{badge.icon}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#65000b]">{badge.text}</p>
                <p className="text-xs text-gray-600">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}