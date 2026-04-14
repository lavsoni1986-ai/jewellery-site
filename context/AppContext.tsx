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

interface AppContextType {
  goldRate: number;
  silverRate: number;
  goldRateTimestamp: number | null;
  products: Product[];
  loading: boolean;
  online: boolean;
}

const AppContext = createContext<AppContextType>({
  goldRate: 0,
  silverRate: 0,
  goldRateTimestamp: null,
  products: [],
  loading: true,
  online: true,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goldRate, setGoldRate] = useState<number>(0);
  const [silverRate, setSilverRate] = useState<number>(0);
  const [goldRateTimestamp, setGoldRateTimestamp] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      goldRateUnsub();
      productsUnsub();
    };
  }, []);

  return (
    <AppContext.Provider value={{ goldRate, silverRate, goldRateTimestamp, products, loading, online }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}