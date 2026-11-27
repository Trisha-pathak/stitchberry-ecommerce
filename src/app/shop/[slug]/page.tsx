"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Zap,
  Star,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatINR, safeJsonParse } from "@/lib/constants";
import { ProductCard, ProductRecord } from "@/components/ProductCard";

interface ReviewRecord {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { addToCart, wishlistIds, toggleWishlist, user, notify } = useStore();

  const [product, setProduct] = useState<(ProductRecord & { reviews: ReviewRecord[] }) | null>(null);
  const [related, setRelated] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/products/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.related || []);
        const cols = safeJsonParse<{ name: string; hex: string }[]>(
          data.product.colorsJson,
          []
        );
        const szs = safeJsonParse<string[]>(data.product.sizesJson, ["Standard"]);
        setSelectedColor(cols[0]?.name || "Pastel Mix");
        setSelectedSize(szs[0] || "Standard");
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center font-display text-2xl text-cocoa">
        Unrolling soft pastel details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-cocoa">
          Treasure not found
        </h1>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-powder-pink font-bold text-cocoa"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = safeJsonParse<string[]>(product.imagesJson, []);
  const colors = safeJsonParse<{ name: string; hex: string }[]>(
    product.colorsJson,
    []
  );
  const sizes = safeJsonParse<string[]>(product.sizesJson, ["Standard"]);
  const soldOut = product.isOutOfStock || product.stock <= 0;
  const isWishlisted = wishlistIds.includes(product.id);

  const handleAdd = (goCheckout = false) => {
    if (soldOut) return;
    addToCart({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: images[0] || "/images/products/cotton-candy-tulip-bouquet-1.svg",
      color: selectedColor,
      size: selectedSize,
      quantity: qty,
      stock: product.stock,
    });
    if (goCheckout) router.push("/checkout");
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          authorName: reviewName || user?.name || "Happy Customer",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                reviews: [data.review, ...prev.reviews],
                ratingCount: prev.ratingCount + 1,
              }
            : prev
        );
        setReviewComment("");
        notify("Thank you for your sweet review!", "butter");
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm font-bold text-cocoa-light hover:text-cocoa"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Crochet Store
      </Link>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="stitch-card rounded-5xl overflow-hidden bg-baby-pink/40 aspect-square"
          >
            <img
              src={images[activeImg] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImg(idx)}
                className={`rounded-3xl overflow-hidden border-4 transition ${
                  activeImg === idx
                    ? "border-powder-pink shadow-candy scale-[1.02]"
                    : "border-white/70 opacity-75 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full aspect-square object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Purchase Controls */}
        <div className="lg:col-span-6 stitch-card rounded-5xl p-7 sm:p-9 bg-vanilla-cream/95 space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-powder-blue/65 px-3.5 py-1 text-xs font-bold text-cocoa">
              {product.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-cocoa mt-3">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-sm font-bold text-cocoa">
                <Star className="w-4 h-4 fill-butter-yellow text-cocoa" />
                {product.ratingAvg.toFixed(1)}
                <span className="text-cocoa-light font-normal">
                  ({product.reviews.length} reviews)
                </span>
              </div>
              <span className="text-cocoa/30">•</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  soldOut
                    ? "bg-cocoa text-vanilla-cream"
                    : "bg-butter-yellow text-cocoa"
                }`}
              >
                {soldOut
                  ? "Out of Stock"
                  : `${product.stock} handmade pieces in stock`}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold text-cocoa">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg line-through text-cocoa-light font-semibold">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="text-cocoa-light font-medium leading-relaxed">
            {product.description}
          </p>

          <div className="rounded-3xl bg-powder-blue/30 p-4 border border-powder-blue text-xs font-semibold text-cocoa">
            <strong className="block mb-1 font-display text-sm">
              Craft Specifications
            </strong>
            {product.specifications}
          </div>

          {/* Colors */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cocoa-light mb-2">
              Yarn Colorway: <span className="text-cocoa">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold border-2 transition ${
                    selectedColor === c.name
                      ? "border-cocoa bg-white shadow-sm scale-105"
                      : "border-white bg-white/70"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-cocoa/20 flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor === c.name && <Check className="w-2.5 h-2.5 text-cocoa" />}
                  </span>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cocoa-light mb-2">
              Size / Variant
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`rounded-full px-4 py-2 text-xs font-bold border-2 transition ${
                    selectedSize === s
                      ? "bg-powder-pink border-cocoa text-cocoa"
                      : "bg-white/80 border-cocoa/15 text-cocoa-light"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty & Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border-2 border-cocoa/15 px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-full bg-baby-pink flex items-center justify-center text-cocoa"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-cocoa">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(Math.min(product.stock || 10, qty + 1))}
                className="w-7 h-7 rounded-full bg-powder-blue flex items-center justify-center text-cocoa"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              disabled={soldOut}
              onClick={() => handleAdd(false)}
              className="flex-1 min-w-[160px] rounded-full py-3.5 px-6 bg-powder-pink hover:bg-baby-pink font-display font-bold text-cocoa border-2 border-cocoa/15 shadow-candy flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              {soldOut ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              type="button"
              disabled={soldOut}
              onClick={() => handleAdd(true)}
              className="flex-1 min-w-[140px] rounded-full py-3.5 px-6 bg-cocoa hover:bg-cocoa-dark font-display font-bold text-vanilla-cream shadow-candy flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              Buy Now
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label="Save to Wishlist"
              className="p-3.5 rounded-full bg-white border-2 border-powder-pink hover:scale-105 transition"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? "fill-powder-pink text-cocoa" : "text-cocoa"
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-dashed border-cocoa/15 flex items-center justify-between text-xs font-bold text-cocoa-light">
            <span>Want this item in custom yarn shades?</span>
            <Link
              href={`/custom-crochet?base=${encodeURIComponent(product.name)}`}
              className="text-cocoa underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Customize as Pre-Order
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display text-3xl font-bold text-cocoa">
            Customer Love & Reviews
          </h2>
          {product.reviews.map((rev) => (
            <div
              key={rev.id}
              className="stitch-card rounded-3xl p-5 bg-white/85 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-cocoa">
                  {rev.authorName}
                </span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-butter-yellow text-cocoa"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-cocoa-light font-medium">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>

        <form
          onSubmit={submitReview}
          className="lg:col-span-5 stitch-card rounded-4xl p-6 bg-powder-blue/30 space-y-4"
        >
          <h3 className="font-display text-2xl font-bold text-cocoa">
            Leave a Sweet Review
          </h3>
          {!user && (
            <input
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-full px-4 py-2.5 text-sm bg-white border border-cocoa/15"
            />
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cocoa">Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setReviewRating(n)}
                className="p-1"
              >
                <Star
                  className={`w-5 h-5 ${
                    n <= reviewRating
                      ? "fill-butter-yellow text-cocoa"
                      : "text-cocoa/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            required
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share how soft the yarn feels or how you styled it..."
            className="w-full rounded-3xl p-4 text-sm bg-white border border-cocoa/15"
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="rounded-full px-6 py-2.5 bg-cocoa text-vanilla-cream font-bold text-sm hover:bg-cocoa-dark transition"
          >
            {submittingReview ? "Posting..." : "Post Review"}
          </button>
        </form>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-3xl font-bold text-cocoa">
            You Might Also Adore
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
