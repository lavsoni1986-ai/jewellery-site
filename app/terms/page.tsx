"use client";

import Link from "next/link";
import { GSTIN, PHONE } from "@/lib/config";

export default function Terms() {
  return (
    <div className="bg-black text-white min-h-screen pt-[60px]">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-8">Terms & Conditions</h1>

        <div className="bg-[#111111] border border-[#D4AF37] rounded-xl p-8 shadow-lg">
          <p className="mb-6">Welcome to Anshu Jewellers.</p>

          <ol className="list-decimal list-inside space-y-4 text-gray-300">
            <li>All product prices are based on current gold rates and may change daily.</li>
            <li>Making charges are included unless stated otherwise.</li>
            <li>Product images are for reference; actual design may vary slightly.</li>
            <li>Orders are confirmed only after WhatsApp or in-store confirmation.</li>
            <li>We reserve the right to update prices without prior notice.</li>
          </ol>

          <div className="mt-8">
            <p><strong>Contact:</strong> +91 {PHONE}</p>
            <p><strong>GSTIN:</strong> {GSTIN}</p>
          </div>
        </div>

         <div className="text-center mt-8">
           <Link href="/">
             <button className="border px-6 py-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition">
               Back to Home
             </button>
           </Link>
         </div>
       </div>
       <footer className="text-center p-6 border-t border-gray-800 mt-10">
         <p className="text-xs text-gray-500">
           Powered by <a href="https://lav-digital-site.vercel.app/" target="_blank" className="text-yellow-500 hover:underline">Bharat OS</a>
         </p>
       </footer>
     </div>
  );
}