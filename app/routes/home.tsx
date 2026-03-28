import { NavLink } from "react-router";
import type { Route } from "./+types/home";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Store" }];
}

const PRODUCTS = [
  {
    id: 1,
    name: "Tang Mango Powder 20g",
    price: 19.4,
    stock: 8,
    imageName: "1.jpg",
  },
  {
    id: 2,
    name: "Angel All Purpose Creamer 370ml",
    price: 55,
    stock: 0,
    imageName: "2.jpeg",
  },
];

export default function ProductList() {
  const [query, setQuery] = useState("");

  const filtered = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Product Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">
            {PRODUCTS.length} items available
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by product name…"
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

        {/* Results count */}
        {query && (
          <p className="text-xs text-slate-500 mb-4">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
            {query}"
          </p>
        )}

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition"
              >
                <NavLink to={`/products?p=${product.id}`}>
                  <span
                    className={`text-xs font-semibold ${
                      product.stock === 0
                        ? "text-gray-400"
                        : product.stock < 10
                          ? "text-red-500"
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
                    Php{product.price.toFixed(2)}
                  </p>
                  {/*<button className="mt-2 w-full py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition cursor-pointer">
                  Add to Cart
                </button>*/}
                </NavLink>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🔎</p>
            <p className="text-base mb-4">No products match "{query}"</p>
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
