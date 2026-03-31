import { redirect, useSearchParams } from "react-router";
import type { Route } from "./+types/product-page";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Store" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("p")) {
    return redirect("/");
  } else {
    const product = await context.cloudflare.env.DB.prepare(
      "select * from products where id = ?",
    )
      .bind(url.searchParams.get("p"))
      .first();
    return product;
  }
}

export default function ProductPage({ loaderData }: Route.ComponentProps) {
  const [searchParams, _setSearchParams] = useSearchParams();
  const product = loaderData;

  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-w-sm w-full overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square bg-slate-100 overflow-hidden">
          <img
            src={`${import.meta.env.VITE_BASE_URL}/images/products/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{product.name}</h1>
            <p
              className={`text-xs font-medium mt-1 ${
                product.stock === 0
                  ? "text-gray-400"
                  : product.stock < 10
                    ? "text-orange-500"
                    : "text-green-600"
              }`}
            >
              {product.stock === 0
                ? "✗ Out of stock"
                : product.stock < 10
                  ? `⚠ ${product.stock} left`
                  : "✓ In stock"}
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
