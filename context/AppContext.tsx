"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { onSnapshot, collection, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  weight: number;
  carat: number;
  making: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface AppContextType {
  goldRate: number;
  silverRate: number;
  goldRateTimestamp: number | null;
  products: Product[];
  categories: Category[];
  loading: boolean;
  online: boolean;
}

const AppContext = createContext<AppContextType>({
  goldRate: 0,
  silverRate: 0,
  goldRateTimestamp: null,
  products: [],
  categories: [],
  loading: true,
  online: true,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goldRate, setGoldRate] = useState<number>(0);
  const [silverRate, setSilverRate] = useState<number>(0);
  const [goldRateTimestamp, setGoldRateTimestamp] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    // Connection status
    const updateStatus = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Single gold rate listener for entire app
    const goldRateUnsub = onSnapshot(doc(db, "goldRate", "current"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGoldRate(data.rate || 0);
        setSilverRate(data.silverRate || 0);
        setGoldRateTimestamp(data.lastUpdate || data.timestamp || null);
      }
    });

    // Single products listener for entire app
    const productsUnsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    });

    // Real-time categories listener for entire app
    const categoriesUnsub = onSnapshot(collection(db, "categories"), (snapshot) => {
      const cats = snapshot.docs.map(doc => {
        const data = doc.data();
        const rawName = (data.name || "").trim();
        const rawSlug = (data.slug || "").trim().replace(/^-+|-+$/g, "");
        return {
          id: doc.id,
          name: rawName || doc.id,
          slug: rawSlug || rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          image: data.image || undefined,
        };
      }).filter(c => c.name.length > 0);

      // Deduplicate by slug
      const seen = new Set<string>();
      const uniqueCats: Category[] = [];
      for (const c of cats) {
        const key = c.slug.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          uniqueCats.push(c);
        }
      }

      // Sort alphabetically by name
      uniqueCats.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(uniqueCats);
    });

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      goldRateUnsub();
      productsUnsub();
      categoriesUnsub();
    };
  }, []);

  return (
    <AppContext.Provider value={{ goldRate, silverRate, goldRateTimestamp, products, categories, loading, online }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}