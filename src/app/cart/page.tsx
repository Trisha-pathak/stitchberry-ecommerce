"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, Trash2, ArrowRight, Tag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { COUPONS, formatINR } from "@/lib/constants";
import { AnimatedHeading } from "@/components/PastelAnimations";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, cartSubtotal, notify } = useStore();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const couponObj = COUPONS[appliedCoupon];
  const discount =
    couponObj?.type === "percent"
      ? Math.round((cartSubtotal * couponObj.value) / 100)
      : 0;
  const shipping =
    cartSubtotal === 0
      ? 0
      : couponObj?.type === "shipping" || cartSubtotal >= 1999
      ? 0
      : 79;
  const tax = Math.round(Math.max(0, cartSubtotal - discount) * 0.05);
  const total = Math.max(0, cartSubtotal - discount) + shipping + tax;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      notify(`Coupon ${code} applied: ${COUPONS[code].label}`, "butter");
    } else {
      notify("Invalid coupon. Try STITCH10, PASTEL15, or FREESHIP.", "pink");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading
        eyebrow="Ready-Made Crochet Basket"
        title="Your Shopping Cart"
      />

      {cart.length === 0 ? (
        <div className="stitch-card rounded-5xl p-12 text-center space-y-4 bg-white/85">
          <p className="font-display text-2xl font-bold text-cocoa">
            Your yarn basket is empty!
          </p>
          <p className="text-sm text-cocoa-light">
            Add ready-made crochet bouquets, bags, or plushies from our store.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-powder-pink font-bold text-cocoa shadow-candy"
          >
            Shop Handmade Crochet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="stitch-card rounded-4xl p-4 bg-white/90 flex gap-4 items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-3xl object-cover bg-baby-pink/40 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/shop/${item.slug}`}
                    className="font-display text-lg font-bold text-cocoa hover:underline block truncate"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs font-semibold text-cocoa-light">
                    Color: {item.color} • Size: {item.size}
                  </p>
                  <p className="font-display text-lg font-bold text-cocoa mt-1">
                    {formatINR(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-baby-pink flex items-center justify-center text-cocoa"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-powder-blue flex items-center justify-center text-cocoa"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 p-2 rounded-full text-cocoa-light hover:text-cocoa hover:bg-baby-pink/40"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 stitch-card rounded-5xl p-6 bg-gradient-to-br from-powder-blue/40 via-vanilla-cream to-baby-pink/50 space-y-5">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Order Summary
            </h2>

            <form onSubmit={applyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-light" />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="STITCH10, PASTEL15, FREESHIP"
                  className="w-full rounded-full pl-9 pr-3 py-2.5 text-xs bg-white border border-cocoa/15 font-bold uppercase"
                />
              </div>
              <button
                type="submit"
                className="rounded-full px-4 py-2.5 bg-butter-yellow border border-cocoa/15 text-xs font-bold text-cocoa"
              >
                Apply
              </button>
            </form>

            <div className="space-y-2 text-sm font-semibold text-cocoa">
              <div className="flex justify-between">
                <span className="text-cocoa-light">Subtotal</span>
                <span>{formatINR(cartSubtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon ({appliedCoupon})</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-cocoa-light">Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-light">GST (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="pt-3 border-t border-dashed border-cocoa/15 flex justify-between items-baseline">
                <span className="font-display text-lg font-bold">Total</span>
                <span className="font-display text-3xl font-bold">
                  {formatINR(total)}
                </span>
              </div>
            </div>

            <Link
              href={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon}` : ""}`}
              className="w-full rounded-full py-3.5 px-6 bg-cocoa text-vanilla-cream font-display font-bold text-base flex items-center justify-center gap-2 hover:bg-cocoa-dark transition shadow-candy"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
