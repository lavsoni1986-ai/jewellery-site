"use client";

import Image from "next/image";
import { PHONE } from "@/lib/config";

export default function StoreExperience() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#FAF9F6]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-serif text-[#65000b] mb-6 tracking-wide">
                Experience Elegance in Person
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Visit our heritage showroom in the heart of Burhar, where tradition meets modernity.
                Our expert craftsmen and personalized service ensure you find the perfect piece for
                every occasion.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <span className="text-[#65000b]">📍</span>
                  </div>
                  <span className="text-gray-700">Prime location near Jain Mandir, Station Road, Burhar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <span className="text-[#65000b]">🕒</span>
                  </div>
                  <span className="text-gray-700">Open daily: 10 AM - 8 PM</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <span className="text-[#65000b]">👨‍🏭</span>
                  </div>
                  <span className="text-gray-700">Expert consultation and custom design services</span>
                </div>
              </div>
              <a
                href={`https://wa.me/${PHONE}?text=Hi, I want to book a store visit to see your jewelry collection.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#65000b] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#4a0000] transition-colors shadow-lg hover:shadow-xl"
              >
                📞 Book A Store Visit
              </a>
            </div>

            {/* Image */}
            <div className="order-1 md:order-2">
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDgwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjVGNUZGIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Q0E5QzkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFuc2h1IEpld2VsbGVycyBTaG93cm9vbTwvdGV4dD4KPHRleHQgeD0iNDAwIiB5PSIyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U3RhdGlvbiBSb2FkLCBuZWFyIEphaW4gTWFuZGlyLCBCdXJoYXI8L3RleHQ+Cjx0ZXh0IHg9IjQwMCIgeT0iMzEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbWluZyBTb29uPC90ZXh0Pgo8L3N2Zz4K" // Placeholder showroom image
                  alt="Anshu Jewellers Showroom"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-serif mb-2">Anshu Jewellers</h3>
                  <p className="text-sm opacity-90">Burhar's Premier Jeweller</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}