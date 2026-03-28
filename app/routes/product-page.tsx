import { useSearchParams } from "react-router";
import type { Route } from "./+types/product-page";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Store" }];
}

const findProduct = (id: number) =>
  PRODUCTS.find((product) => product.id === id);
const PRODUCTS = [
  {
    id: 1,
    name: "Tang Mango Powder 20g",
    price: 19.4,
    stock: 8,
    image: `${import.meta.env.VITE_BASE_URL}/images/products/1.jpg`,
  },
  {
    id: 2,
    name: "Angel All Purpose Creamer 370ml",
    price: 55,
    stock: 0,
    image: `${import.meta.env.VITE_BASE_URL}/images/products/2.jpeg`,
  },
];

export default function ProductPage() {
  const [searchParams, _setSearchParams] = useSearchParams();
  const product = findProduct(Number(searchParams.get("p")));

  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-w-sm w-full overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{product.name}</h1>
            <p
              className={`text-xs font-medium mt-1 ${product.stock < 10 ? "text-red-500" : "text-green-600"}`}
            >
              {product.stock < 10
                ? `⚠ Only ${product.stock} left`
                : `✓ In stock`}
            </p>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            ₱{product.price.toFixed(2)}
          </p>

          {/*<button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-xl text-sm font-bold transition ${
              added
                ? "bg-green-600 text-white"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            {added ? "✓ Added to Cart!" : "Add to Cart"}
          </button>*/}
        </div>
      </div>
    </div>
  );
}
