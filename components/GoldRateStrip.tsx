"use client";

import { useApp } from "@/context/AppContext";

export default function GoldRateStrip() {
  const { goldRate, silverRate } = useApp();

  return (
    <div className="bg-black text-yellow-400 text-center text-sm py-1 flex justify-center gap-6">
      <span>Gold: ₹{goldRate}/gm</span>
      {silverRate && silverRate > 0 && (
        <>
          <span className="text-gray-300">|</span>
          <span>Silver: ₹{silverRate}/gm</span>
        </>
      )}
      <span className="ml-2 text-[10px] text-gray-400 uppercase tracking-tighter self-center">
        • Live Rates
      </span>
    </div>
  );
}