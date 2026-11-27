"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/constants";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQty,
    removeFromCart,
    cartSubtotal,
  } = useStore();

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-cocoa/35 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative w-full max-w-md bg-vanilla-cream h-full shadow-candy-lg flex flex-col border-l-4 border-powder-pink z-10"
          >
            <div className="p-5 border-b-2 border-dashed border-cocoa/15 flex items-center justify-between bg-gradient-to-r from-baby-pink/70 to-powder-blue/50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-2xl bg-vanilla-cream border border-cocoa/10">
                  <ShoppingBag className="w-5 h-5 text-cocoa" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-cocoa">
                    Your Yarn Basket
                  </h2>
                  <p className="text-xs font-semibold text-cocoa-light">
                    Ready-made crochet treasures
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full bg-vanilla-cream/90 hover:bg-powder-pink text-cocoa transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-powder-blue/40 flex items-center justify-center">
                    <ShoppingBag className="w-9 h-9 text-cocoa/60" />
                  </div>
                  <p className="font-display text-xl text-cocoa">
                    Your yarn basket is empty!
                  </p>
                  <p className="text-sm text-cocoa-light max-w-xs mx-auto">
                    Explore our handmade bouquets, plushies, or design your own pastel creation.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-powder-pink font-bold text-sm text-cocoa shadow-candy hover:scale-105 transition"
                  >
                    Browse Ready-Made Shop
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white/80 p-3.5 border-2 border-powder-blue/40 flex gap-3.5 items-center shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-baby-pink/40 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="font-display font-bold text-cocoa hover:underline truncate block"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs font-semibold text-cocoa-light">
                        {item.color} • {item.size}
                      </p>
                      <p className="font-bold text-cocoa mt-1">
                        {formatINR(item.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-baby-pink flex items-center justify-center text-cocoa hover:bg-powder-pink"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-powder-blue flex items-center justify-center text-cocoa hover:bg-powder-blue/80"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="ml-auto p-1.5 rounded-full text-cocoa-light hover:text-cocoa hover:bg-baby-pink/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t-2 border-dashed border-cocoa/15 bg-baby-pink/35 space-y-3">
                <div className="flex justify-between text-sm font-bold text-cocoa">
                  <span>Subtotal</span>
                  <span>{formatINR(cartSubtotal)}</span>
                </div>
                <p className="text-xs text-cocoa-light">
                  Try coupon <span className="font-bold text-cocoa">STITCH10</span> or{" "}
                  <span className="font-bold text-cocoa">PASTEL15</span> at checkout!
                </p>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="rounded-full py-3 text-center text-sm font-bold bg-vanilla-cream border-2 border-cocoa/15 text-cocoa hover:bg-butter-yellow/60 transition"
                  >
                    View Basket
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="rounded-full py-3 text-center text-sm font-bold bg-cocoa text-vanilla-cream hover:bg-cocoa-dark transition flex items-center justify-center gap-1.5"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
