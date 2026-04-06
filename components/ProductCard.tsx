import { PHONE } from "@/lib/config";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  weight: number;
  carat: number;
  making: number;
}

import { calculatePrice } from "@/lib/calcPrice";

export default function ProductCard({ product, goldRate }: { product: Product; goldRate: number }) {
  const calculatedPrice = calculatePrice(product, goldRate);

  return (
    <div className="p-4">

      <img
        src={product.image}
        className="w-full h-64 object-cover mb-4 rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
        alt={product.name}
      />

      <h3 className="product-title mb-2">
        {product.name}
      </h3>

      <div className="flex items-center gap-2 mb-1">
        <p className="price text-[#8A6A6A]">
          ₹{calculatedPrice.toLocaleString("en-IN")}
        </p>
        <span className="text-xs text-green-600 font-medium">
          Live Price
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-2">
        Updated with live gold rates
      </p>

      <p className="text-xs text-amber-600 mb-4">
        Price may change with gold market
      </p>

    </div>
  );
}