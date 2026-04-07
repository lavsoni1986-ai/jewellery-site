import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Cinzel } from "next/font/google";
import Script from "next/script";
import InstallButton from "@/components/InstallButton";
import GoldRateStrip from "@/components/GoldRateStrip";
import Header from "@/components/Header";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins'
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
});

export const metadata: Metadata = {
  title: "Anshu Jewellers | Gold Jewellery in Burhar",
  description: "70+ years trusted jewellery shop. Gold rings, necklaces, bridal sets in Burhar, Shahdol.",
  keywords: ["Jewellery Burhar", "Gold Shop Shahdol", "Anshu Jewellers"],
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
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
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
        <AppProvider>
          <GoldRateStrip />
          <Header />
          <main>
            {children}
          </main>
        </AppProvider>

        <InstallButton />
      </body>
    </html>
  );
}
