"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatINR, safeJsonParse } from "@/lib/constants";

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  specifications: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isOutOfStock: boolean;
  colorsJson: string;
  sizesJson: string;
  imagesJson: string;
  ratingAvg: number;
  ratingCount: number;
  popularity: number;
  isFeatured: boolean;
  isSeasonal: boolean;
}

export function ProductCard({ product }: { product: ProductRecord }) {
  const prefersReduced = useReducedMotion();
  const { addToCart, wishlistIds, toggleWishlist } = useStore();
  const colors = safeJsonParse<{ name: string; hex: string }[]>(
    product.colorsJson,
    []
  );
  const sizes = safeJsonParse<string[]>(product.sizesJson, ["Standard"]);
  const images = safeJsonParse<string[]>(product.imagesJson, []);
  const isWishlisted = wishlistIds.includes(product.id);
  const soldOut = product.isOutOfStock || product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soldOut) return;
    const color = colors[0]?.name || "Pastel Mix";
    const size = sizes[0] || "Standard";
    addToCart({
      id: `${product.id}-${color}-${size}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: images[0] || "/images/products/cotton-candy-tulip-bouquet-1.svg",
      color,
      size,
      quantity: 1,
      stock: product.stock,
    });
  };

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={prefersReduced ? undefined : { y: -8, rotate: -1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative stitch-card rounded-4xl p-4 flex flex-col bg-vanilla-cream/95 transition-shadow hover:shadow-candy-lg"
    >
      {/* Subtle bouncing mini yarn ball near card */}
      <motion.div
        aria-hidden="true"
        animate={prefersReduced ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-2.5 -right-2 w-7 h-7 rounded-full bg-butter-yellow border-2 border-cocoa/20 shadow-sm flex items-center justify-center z-10 pointer-events-none"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <circle cx="12" cy="12" r="8" fill="#F7C6D9" stroke="#59434A" strokeWidth="1.8" />
          <path d="M6 10 Q12 6 18 11 M6 15 Q12 11 18 16" stroke="#59434A" strokeWidth="1.4" fill="none" />
        </svg>
      </motion.div>

      {/* Image Frame */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block rounded-3xl overflow-hidden bg-baby-pink/40 aspect-square mb-3.5"
      >
        <img
          src={images[0] || "/images/products/cotton-candy-tulip-bouquet-1.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {soldOut ? (
          <span className="absolute top-3 left-3 rounded-full bg-cocoa/90 text-vanilla-cream text-[11px] font-bold px-3 py-1">
            Out of Stock
          </span>
        ) : product.stock <= 4 ? (
          <span className="absolute top-3 left-3 rounded-full bg-butter-yellow/95 text-cocoa text-[11px] font-bold px-3 py-1 border border-cocoa/15">
            Only {product.stock} left!
          </span>
        ) : null}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-vanilla-cream/95 border border-cocoa/15 flex items-center justify-center shadow-sm hover:scale-110 transition"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? "fill-powder-pink text-cocoa" : "text-cocoa"
            }`}
          />
        </button>
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cocoa-light">
          {product.category}
        </span>
        <Link
          href={`/shop/${product.slug}`}
          className="font-display text-lg font-bold text-cocoa mt-0.5 hover:underline line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Rating & Swatches */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs font-bold text-cocoa">
            <Star className="w-3.5 h-3.5 fill-butter-yellow text-cocoa" />
            <span>{product.ratingAvg.toFixed(1)}</span>
            <span className="text-cocoa-light font-normal">
              ({product.ratingCount})
            </span>
          </div>
          <div className="flex items-center -space-x-1">
            {colors.slice(0, 4).map((c, idx) => (
              <span
                key={idx}
                title={c.name}
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Price + Action */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div>
            <span className="font-display text-xl font-bold text-cocoa">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="ml-1.5 text-xs line-through text-cocoa-light">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            type="button"
            disabled={soldOut}
            onClick={handleQuickAdd}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold bg-powder-blue hover:bg-powder-pink text-cocoa border border-cocoa/15 shadow-sm transition disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {soldOut ? "Sold Out" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
