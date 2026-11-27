"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { PRODUCT_CATEGORIES, YARN_PALETTE } from "@/lib/constants";
import { AnimatedHeading } from "@/components/PastelAnimations";
import { ProductCard, ProductRecord } from "@/components/ProductCard";

export default function ShopPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [color, setColor] = useState("");
  const [availability, setAvailability] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState("popular");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    if (color) params.set("color", color);
    if (availability !== "all") params.set("availability", availability);
    params.set("maxPrice", String(maxPrice));
    params.set("sort", sort);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }, [category, search, color, availability, maxPrice, sort]);

  useEffect(() => {
    const t = setTimeout(loadProducts, 150);
    return () => clearTimeout(t);
  }, [loadProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading
        eyebrow="Module 01 • Ready-Made Boutique"
        title="Handmade Crochet Store"
        subtitle="Browse 9 whimsical collections crafted with cotton-soft yarn, ready to wrap and ship to your doorstep."
      />

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {["All", ...PRODUCT_CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition border ${
              category === cat
                ? "bg-powder-pink border-cocoa/20 text-cocoa shadow-sm scale-105"
                : "bg-white/80 border-cocoa/10 text-cocoa-light hover:bg-powder-blue/45 hover:text-cocoa"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="stitch-card rounded-4xl p-5 bg-white/85 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="lg:col-span-2">
          <label className="text-xs font-bold text-cocoa-light uppercase tracking-wider block mb-1.5">
            Search Treasures
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-light" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tulip, bunny, tote bag, cardigan..."
              className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15 focus:outline-none focus:border-powder-pink"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-cocoa-light uppercase tracking-wider block mb-1.5">
            Max Price: ₹{maxPrice}
          </label>
          <input
            type="range"
            min={400}
            max={5000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#F7C6D9]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-cocoa-light uppercase tracking-wider block mb-1.5">
            Availability
          </label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15 font-semibold text-cocoa"
          >
            <option value="all">All Items</option>
            <option value="in-stock">In Stock Only</option>
            <option value="low-stock">Low Stock (Few Left)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-cocoa-light uppercase tracking-wider block mb-1.5">
            Sort By
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15 font-semibold text-cocoa"
          >
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {/* Color Filter Strip */}
        <div className="lg:col-span-5 pt-2 border-t border-dashed border-cocoa/15 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoa mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter by Yarn Color:
          </span>
          <button
            type="button"
            onClick={() => setColor("")}
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              color === "" ? "bg-cocoa text-vanilla-cream" : "bg-vanilla-cream text-cocoa"
            }`}
          >
            Any Shade
          </button>
          {YARN_PALETTE.slice(0, 9).map((swatch) => (
            <button
              key={swatch.name}
              type="button"
              onClick={() => setColor(color === swatch.name ? "" : swatch.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                color === swatch.name
                  ? "border-cocoa ring-2 ring-powder-pink bg-white"
                  : "border-cocoa/15 bg-white/80"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-cocoa/20"
                style={{ backgroundColor: swatch.hex }}
              />
              {swatch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-80 rounded-4xl bg-baby-pink/40 animate-pulse border-2 border-white"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="stitch-card rounded-4xl p-12 text-center space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-cocoa/60" />
          <h3 className="font-display text-2xl font-bold text-cocoa">
            No matching crochet pieces found
          </h3>
          <p className="text-sm text-cocoa-light">
            Try clearing your color or price filter, or design your exact dream item in Custom Crochet!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
