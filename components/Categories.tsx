"use client";

import Link from "next/link";
import FadeUp from "./FadeUp";
import { useApp } from "@/context/AppContext";

const DEFAULT_CATEGORIES = [
  {
    id: "default-rings",
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
  },
  {
    id: "default-necklace",
    name: "Necklace",
    slug: "necklace",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800",
  },
  {
    id: "default-earrings",
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800",
  },
];

function getCategoryFallbackImage(nameOrSlug?: string): string {
  const term = (nameOrSlug || "").toLowerCase();
  if (term.includes("ring") || term.includes("anguthi") || term.includes("chhalla")) {
    return "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800";
  }
  if (term.includes("neck") || term.includes("haar") || term.includes("chok") || term.includes("mangal") || term.includes("pendant") || term.includes("locket") || term.includes("chain") || term.includes("set") || term.includes("pendal")) {
    return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800";
  }
  if (term.includes("ear") || term.includes("jhum") || term.includes("top") || term.includes("bali") || term.includes("stud")) {
    return "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800";
  }
  if (term.includes("bang") || term.includes("kang") || term.includes("bala") || term.includes("brace") || term.includes("chuda") || term.includes("payal") || term.includes("anklet")) {
    return "https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?q=80&w=800";
  }
  if (term.includes("silver")) {
    return "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800";
  }
  return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800";
}

export default function Categories() {
  const { categories: firestoreCategories, loading } = useApp();
  const displayCategories = firestoreCategories.length > 0 ? firestoreCategories : (loading ? [] : DEFAULT_CATEGORIES);

  if (loading && firestoreCategories.length === 0) {
    return (
      <section className="luxury-section">
        <div className="container mx-auto px-6">
          <FadeUp>
            <h2 className="mb-12 text-center font-cinzel text-3xl md:text-4xl text-[#65000b] tracking-wider">
              Shop By Category
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[260px] md:h-[300px] rounded-2xl bg-black/5 animate-pulse border border-[#D4AF37]/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="luxury-section">
      <div className="container mx-auto px-6">
        <FadeUp>
          <h2 className="mb-12 text-center font-cinzel text-3xl md:text-4xl text-[#65000b] tracking-wider">
            Shop By Category
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {displayCategories.map((category, index) => {
            const imageSrc = category.image || getCategoryFallbackImage(category.name || category.slug);
            const categoryLink = `/jewellery?category=${encodeURIComponent(category.slug || category.name.toLowerCase())}`;

            return (
              <FadeUp key={category.id || category.slug} delay={0.1 * (index % 6)}>
                <Link href={categoryLink} className="block group">
                  <div className="category-card relative image-hover rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/20 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
                    <div className="category-overlay absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
                    <img
                      src={imageSrc}
                      className="h-[260px] md:h-[300px] w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={category.name}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const fallback = getCategoryFallbackImage(category.name || category.slug);
                        if (target.src !== fallback) {
                          target.src = fallback;
                        }
                      }}
                    />
                    <div className="category-text absolute bottom-4 left-4 z-20 font-serif text-xl md:text-2xl text-white font-medium drop-shadow-md">
                      {category.name}
                    </div>
                  </div>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}