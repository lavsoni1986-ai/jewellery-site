import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import ConnectionStatus from "@/components/ConnectionStatus";

export default function Home() {
  return (
    <div className="min-h-screen">
      <ConnectionStatus />
      <Hero />
      <Categories />
      <Products />
      <Footer />
    </div>
  );
}
