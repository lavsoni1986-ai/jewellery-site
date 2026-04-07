"use client";

import { useApp } from "@/context/AppContext";

export default function GoldRateStrip() {
  const { goldRate, goldRateTimestamp } = useApp();

  return (
    <div className="bg-black text-yellow-400 text-center text-sm py-1">
      Gold: ₹{goldRate}/gm • Live Rate
      {goldRateTimestamp && (
        <span className="ml-2 text-xs text-gray-300">
          Updated at {new Date(goldRateTimestamp).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}