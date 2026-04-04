import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import Script from "next/script";
import InstallButton from "@/components/InstallButton";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600']
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anshu Jewellers | Best Jewellery Shop in Burhar",
  description: "70+ years trusted jewellery shop in Burhar, Shahdol. Gold rings, necklaces, bangles available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#D4AF37" />
      </head>
      <body className={`min-h-full flex flex-col ${poppins.className}`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
        </Script>
        {children}
        <a
          href="https://wa.me/919425182098"
          target="_blank"
          className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-50 bg-[#65000b] text-white px-4 py-3 md:px-5 md:py-3 rounded-full floating-shadow hover:scale-110 transition-all duration-300 pointer-events-auto flex items-center justify-center text-lg md:text-xl active:scale-95 shadow-lg"
          aria-label="Contact on WhatsApp"
        >
          <span className="md:hidden">💬</span>
          <span className="hidden md:inline">💬 WhatsApp</span>
        </a>
        <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-[#3b0a0a] to-[#65000b] p-4 md:hidden z-50 shadow-depth-lg border-t border-white/10">
          <a
            href="https://wa.me/919425182098"
            className="block text-center text-white py-2 rounded-xl font-bold tracking-wide bg-white/10 hover:bg-white/20 transition-all duration-300 active:scale-95 shadow-lg"
          >
            WhatsApp पर पूछें 💬
          </a>
        </div>
        <InstallButton />
      </body>
    </html>
  );
}
