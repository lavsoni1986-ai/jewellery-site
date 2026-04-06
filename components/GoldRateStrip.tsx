"use client";

import { useApp } from "@/context/AppContext";

export default function GoldRateStrip() {
  const { goldRate, goldRateTimestamp } = useApp();

  const formatTimestamp = (ts: number | null) => {
    if (!ts) return "Updating...";

    const date = new Date(ts);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full bg-[#14100f] text-[#d4af37] py-2 text-center tracking-wide gold-strip">
      Gold: ₹{goldRate || "--"}/gm • Live Rate
      <span className="text-gray-400 ml-2">
        Updated today at {formatTimestamp(goldRateTimestamp)}
      </span>
    </div>
  );
}