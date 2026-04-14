"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NewsData {
  news?: string;
}

export default function SimpleTicker() {
  const [news, setNews] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "updates"),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as NewsData;
          setNews(data.news || "");
          setError(null);
        } else {
          setNews("");
          setError("No updates available");
        }
      },
      (err) => {
        console.error("Error fetching news:", err);
        setError("Failed to load news");
      }
    );

    return unsubscribe;
  }, []);

  if (error) {
    return (
      <div className="bg-red-600 text-white py-1.5 border-b border-red-300 shadow-sm text-center text-sm">
        {error}
      </div>
    );
  }

  if (!news) return null;

  return (
    <div className="bg-[#65000b] text-white py-1.5 border-b border-[#D4AF37]/40 shadow-sm overflow-hidden">
      <div className="animate-marquee whitespace-nowrap text-sm font-medium tracking-wide">
        {news} • {news} • {news} • {news} • {news}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}