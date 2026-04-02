import { Suspense } from "react";
import JewelleryClient from "@/components/JewelleryClient";

export const dynamic = "force-dynamic";

export default function Jewellery() {
  return (
    <Suspense fallback={<div className="bg-black text-white min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div></div>}>
      <JewelleryClient />
    </Suspense>
  );
}