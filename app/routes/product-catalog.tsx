import { NavLink } from "react-router";
import type { Route } from "./+types/product-catalog";
import { useState } from "react";

export const meta = ({}: Route.MetaArgs) => [
  { title: "Store" },
  { property: "og:title", content: "Store" },
  {
    property: "og:description",
    content: "Browse our full catalog of products.",
  },
  {
    property: "og:image",
    content: "https://store.marvinalegre.workers.dev/images/products/1.jpg",
  },
  { property: "og:url", content: "https://store.marvinalegre.workers.dev" },
  { property: "og:type", content: "website" },
];

export async function loader({ context }: Route.LoaderArgs) {
  return {
    products: (
      await context.cloudflare.env.DB.prepare("select * from products").all()
    ).results,
  };
}

export default function ProductCatalog({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  const featuredProducts = products.filter((p) => p.is_featured === 1);
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Product Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">
            {products.length} items listed
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <div className="relative mb-8 w-full max-w-lg">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Query result */}
        {query && (
          <>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
              {query}"
            </h2>
            <ProductsGrid products={filtered} />
          </>
        )}

        {/* Featured Products */}
        {!query && (
          <>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Stock Up On These
            </h2>
            <ProductsGrid products={featuredProducts} />
          </>
        )}

        {query && filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-6">🤷</p>
            <button
              onClick={() => setQuery("")}
              className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-row gap-4 shadow-sm hover:shadow-md transition"
        >
          <NavLink
            to={`/products?p=${product.id}`}
            className="flex flex-row gap-4 w-full"
          >
            <img
              src={`${import.meta.env.VITE_BASE_URL}/images/products/${product.image}`}
              alt={product.name}
              className="w-24 h-24 object-contain rounded-xl bg-slate-100 shrink-0"
            />
            <div className="flex flex-col justify-center gap-1">
              <span
                className={`text-xs font-semibold ${
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
              </span>
              <h3 className="text-sm font-semibold text-slate-800 leading-snug">
                {product.name}
              </h3>
              <p className="text-xl font-bold text-slate-900">
                ₱{product.price.toFixed(2)}
              </p>
            </div>
          </NavLink>
        </div>
      ))}
    </div>
  );
}
