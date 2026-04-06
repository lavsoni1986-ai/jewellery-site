import Link from "next/link";
import FadeUp from "./FadeUp";

const categories = [
  {
    name: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    link: "/jewellery?category=rings"
  },
  {
    name: "Necklace",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
    link: "/jewellery?category=necklace"
  },
  {
    name: "Earrings",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800",
    link: "/jewellery?category=earrings"
  },
];

export default function Categories() {
  return (
    <section className="luxury-section">
      <div className="container mx-auto px-6">

        <FadeUp>
          <h2 className="mb-12 text-center">
            Shop By Category
          </h2>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Featured Big Card */}
          <FadeUp delay={0.2}>
            <div className="category-card relative md:row-span-2 image-hover">
              <div className="category-overlay absolute inset-0"></div>
              <img
                src={categories[0].image}
                className="h-[260px] md:h-[300px] w-full object-cover"
                alt={categories[0].name}
              />
              <div className="category-text absolute bottom-4 left-4">
                {categories[0].name}
              </div>
            </div>
          </FadeUp>

          {/* Two Smaller Cards */}
          <div className="grid grid-cols-1 gap-10">
            {categories.slice(1).map((category, index) => (
              <FadeUp key={category.name} delay={0.4 + index * 0.2}>
                <div className="category-card relative image-hover">
                  <div className="category-overlay absolute inset-0"></div>
                  <img
                    src={category.image}
                    className="h-[260px] md:h-[300px] w-full object-cover"
                    alt={category.name}
                  />
                  <div className="category-text absolute bottom-4 left-4">
                    {category.name}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}