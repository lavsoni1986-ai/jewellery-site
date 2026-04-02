"use client";

import Link from "next/link";
import { PHONE } from "@/lib/config";

export default function Privacy() {
  return (
    <div className="bg-black text-white min-h-screen pt-[60px]">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-8">Privacy Policy</h1>

        <div className="bg-[#111111] border border-[#D4AF37] rounded-xl p-8 shadow-lg">
          <p className="mb-6">We respect your privacy.</p>

          <ol className="list-decimal list-inside space-y-4 text-gray-300">
            <li>We collect basic details when you contact us (name, phone).</li>
            <li>Data is used only for communication and order processing.</li>
            <li>We do not share your data with third parties.</li>
          </ol>

          <div className="mt-8">
            <p><strong>Contact:</strong> Anshu Jewellers</p>
            <p><strong>Phone:</strong> +91 {PHONE}</p>
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