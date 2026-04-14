import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Categories from "@/components/Categories";
import LegacySection from "@/components/LegacySection";
import StoreExperience from "@/components/StoreExperience";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import ConnectionStatus from "@/components/ConnectionStatus";
import ClientOnlyChat from "@/components/ClientOnlyChat";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 1. Real-time Connection Status */}
      <ConnectionStatus />

      {/* 2. Hero Section: Burhar Pride with Call-to-Action */}
      <Hero />

      {/* 3. Trust Badges: BIS Hallmark, 1954 Legacy, and Certifications */}
      <TrustBadges />

      {/* 4. Categories: Easy Browsing with Filters */}
      <Categories />

      {/* 5. Featured Products: Live Pricing and Quick Add-to-Cart */}
      <Products />

      {/* 6. Legacy Section: Family Story from Kashideen to Amit */}
      <LegacySection />

      {/* 7. Store Experience: Immersive Burhar Showroom Photos/Videos */}
      <StoreExperience />

      {/* 8. Customer Testimonials: Video Reviews and Stories */}
      <Testimonials />

      {/* 9. Footer: Contact, Map, and Hyper-Local Links */}
      <Footer />

      {/* 10. Live Chat for Instant Queries */}
      <ClientOnlyChat />
    </div>
  );
}
