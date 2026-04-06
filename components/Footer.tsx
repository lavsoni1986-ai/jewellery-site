import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-spacing border-t border-[#EADFD8]">
      <div className="container-luxury text-center">

        <h2 className="mb-4">ANSHU JEWELLERS</h2>

        <p className="text-sm text-[#8A6A6A] mb-6">
          Burhar का trusted jewellery destination since 1950
        </p>

        {/* Links */}
        <div className="flex justify-center gap-6 text-sm mb-6">
          <Link href="/privacy" className="hover:text-[#4a2c2c] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#4a2c2c] transition-colors">Terms</Link>
        </div>

        {/* Instagram */}
        <a
          href="https://instagram.com/anshujewl.forever"
          target="_blank"
          className="text-sm underline hover:no-underline transition-all"
        >
          Follow us on Instagram
        </a>

        <p className="text-xs tracking-widest mt-4 text-[#8A6A6A]">
          BIS HALLMARKED • TRUSTED SINCE 1950
        </p>

        <p className="mt-4 italic text-sm text-[#6A5A5A]">
          Crafted with legacy. Designed for generations.
        </p>

        <p className="text-xs mt-3 text-[#A08A8A]">
          Pricing powered by intelligent rate systems
        </p>

        <a
          href="https://lav-digital-site.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs mt-4 text-[#A08A8A] hover:underline block"
        >
          Built on BharatOS — A Sovereign Digital Foundation
        </a>

        <p className="mt-6 text-xs text-[#A08A8A]">
          © 2026 Anshu Jewellers. All rights reserved.
        </p>

      </div>
    </footer>
  );
}