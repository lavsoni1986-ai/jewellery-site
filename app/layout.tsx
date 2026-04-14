import type { Metadata } from "next";
import { Poppins, Cinzel } from "next/font/google";
import Script from "next/script";
import InstallButton from "@/components/InstallButton";
import GoldRateStrip from "@/components/GoldRateStrip";
import Header from "@/components/Header";
import SimpleTicker from "@/components/SimpleTicker";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins'
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // Change to 'https://anshujewellers.com' for production
  // Enhanced title with hyper-local and legacy focus
  title: "Anshu Jewellers | Burhar's Premier Gold Jewellery Legacy Since 1954 | Trusted Family Jewellers in Shahdol",
  description: "Experience 70+ years of trust with M/S Kashideen Natthulal Saraf's legacy. Burhar's only BIS Hallmarked gold shop offering pure gold, exquisite craftsmanship, and personalized service in Shahdol district.",
  keywords: ["Jewellery Burhar", "Gold Jewellery Burhar", "Anshu Jewellers Burhar Shahdol", "Kashideen Natthulal Saraf Legacy", "Best Jeweller Shahdol Madhya Pradesh", "BIS Hallmarked Gold Burhar", "Family Jewellers Burhar Since 1954", "Station Road Burhar", "Jain Mandir Burhar", "Jewellers near Jain Mandir Burhar"],
  authors: [{ name: "Anshu Jewellers" }],
  creator: "Anshu Jewellers",
  publisher: "Anshu Jewellers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Anshu Jewellers | Burhar's Gold Legacy Since 1954",
    description: "Discover pure gold and timeless craftsmanship at Burhar's trusted jewellers, rooted in 70 years of family tradition.",
    url: "https://anshujewellers.com",
    siteName: "Anshu Jewellers",
    images: [
      {
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHZpZXdCb3g9IjAgMCAxMjAwIDYzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjMwIiBmaWxsPSIjRjVGNUZGIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iMzE1IiBmb250LWZhbWlseT0iQ2luemVsLCBzZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzY1MDAwYiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QW5zaHUgSmV3ZWxsZXJzPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgZm9udC1mYW1pbHk9IkNpbnplbCwgc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNENEFGMzciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJ1cmhhcicgUHJlbWllciBHb2xkIEpld2VsbGVycyBTaW5jZSAxOTU0PC90ZXh0Pgo8L3N2Zz4K",
        width: 1200,
        height: 630,
        alt: "Anshu Jewellers Burhar Showroom",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anshu Jewellers | Burhar's Gold Legacy Since 1954",
    description: "70+ years of pure gold and trust in Burhar, Shahdol.",
    images: ["data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MzAiIHZpZXdCb3g9IjAgMCAxMjAwIDYzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjMwIiBmaWxsPSIjRjVGNUZGIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iMzE1IiBmb250LWZhbWlseT0iQ2luemVsLCBzZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzY1MDAwYiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QW5zaHUgSmV3ZWxsZXJzPC90ZXh0Pgo8dGV4dCB4PSI2MDAiIHk9IjM3MCIgZm9udC1mYW1pbHk9IkNpbnplbCwgc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNENEFGMzciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJ1cmhhcicgUHJlbWllciBHb2xkIEpld2VsbGVycyBTaW5jZSAxOTU0PC90ZXh0Pgo8L3N2Zz4K"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${cinzel.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#65000b" />
        <link rel="manifest" href="/manifest.json" />

        {/* Structured Data for Local Business */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              "name": "Anshu Jewellers",
              "description": "Burhar's trusted gold jewellers since 1954, offering BIS Hallmarked gold and exquisite craftsmanship.",
              "url": "https://anshujewellers.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Station Road, near Jain Mandir, Burhar",
                "addressLocality": "Burhar",
                "addressRegion": "Madhya Pradesh",
                "postalCode": "484110",
                "addressCountry": "IN",
              },
              "telephone": "+91-XXXXXXX",
              "foundingDate": "1954",
              "founder": {
                "@type": "Person",
                "name": "Kashideen Natthulal Saraf",
              },
              "sameAs": [
                "https://www.facebook.com/anshujewellersburhar",
                "https://www.instagram.com/anshujewellersburhar",
              ],
            }),
          }}
        />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-gradient-to-b from-[#FAF9F6] to-[#F5F5DC]">
        <AppProvider>
          <GoldRateStrip />
          <Header />
          <SimpleTicker />
          <main className="flex-grow">
            {children}
          </main>
        </AppProvider>
        <InstallButton />
      </body>
    </html>
  );
}
