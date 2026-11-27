"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Send, Instagram } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { notify } = useStore();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        notify(data.message || "Welcome to the StitchBerry Yarn Club!", "butter");
        setEmail("");
      } else {
        notify(data.error || "Please enter a valid email.", "pink");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-baby-pink/60 via-powder-pink/45 to-powder-blue/65 border-t-4 border-dashed border-white/80 pt-14 pb-10">
      {/* Animated wavy wool thread border */}
      <div className="absolute -top-6 inset-x-0 overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1200 40" className="w-full h-10" preserveAspectRatio="none">
          <path
            d="M0 24 Q 75 4, 150 24 T 300 24 T 450 24 T 600 24 T 750 24 T 900 24 T 1050 24 T 1200 24"
            fill="none"
            stroke="#59434A"
            strokeOpacity="0.22"
            strokeWidth="3"
            strokeDasharray="8 6"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b-2 border-dashed border-cocoa/15">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-cocoa">
              StitchBerry Studio
            </h3>
            <p className="text-sm text-cocoa-light leading-relaxed font-medium">
              A pastel fantasy studio crafting heirloom crochet keepsakes, custom yarn pre-orders, and hand-embroidered transformations on your cherished wardrobe.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-vanilla-cream text-xs font-bold text-cocoa border border-cocoa/15 hover:bg-powder-pink transition"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 bg-vanilla-cream text-xs font-bold text-cocoa border border-cocoa/15 hover:bg-powder-blue transition"
              >
                ✦ Pinterest
              </a>
            </div>
          </div>

          {/* Studio Links */}
          <div>
            <h4 className="font-display text-lg font-bold text-cocoa mb-4">
              Explore & Shop
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-cocoa/85">
              <li><Link href="/story" className="hover:underline">About Us (Handmade Story)</Link></li>
              <li><Link href="/shop" className="hover:underline">Shop Ready-Made Crochet</Link></li>
              <li><Link href="/custom-crochet" className="hover:underline">Custom Crochet Pre-Orders</Link></li>
              <li><Link href="/embroidery" className="hover:underline">Embroidery Services</Link></li>
              <li><Link href="/studio" className="hover:underline">Yarn Color Studio</Link></li>
              <li><Link href="/gifts" className="hover:underline">Gift Corner & Custom Gifts</Link></li>
              <li><Link href="/gallery" className="hover:underline">Customer Gallery</Link></li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div>
            <h4 className="font-display text-lg font-bold text-cocoa mb-4">
              Care & Policies
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-cocoa/85">
              <li><Link href="/track" className="hover:underline">Track Your Order</Link></li>
              <li><Link href="/behind-every-stitch" className="hover:underline">Behind Every Stitch</Link></li>
              <li><Link href="/care" className="hover:underline">Crochet Care Instructions</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQs</Link></li>
              <li><Link href="/policies/shipping" className="hover:underline">Shipping & Return Policy</Link></li>
              <li><Link href="/policies/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:underline">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="stitch-card rounded-4xl p-5 bg-vanilla-cream/90">
            <h4 className="font-display text-lg font-bold text-cocoa mb-2">
              Join the Pastel Yarn Club
            </h4>
            <p className="text-xs text-cocoa-light font-medium mb-4">
              Get seasonal drops, custom slot openings & sweet coupons like{" "}
              <span className="font-bold text-cocoa">PASTEL15</span>.
            </p>
            <form onSubmit={subscribe} className="space-y-2.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full px-4 py-2.5 text-sm bg-white border-2 border-powder-pink/60 text-cocoa focus:outline-none focus:border-powder-blue"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full py-2.5 px-4 bg-cocoa text-vanilla-cream text-sm font-bold flex items-center justify-center gap-2 hover:bg-cocoa-dark transition disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Stitching..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold text-cocoa-light">
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 fill-powder-pink text-cocoa" /> by StitchBerry Handmade Studio • Mumbai & Pan-India Delivery
          </p>
          <p>© {new Date().getFullYear()} StitchBerry. Every loop is handmade.</p>
        </div>
      </div>
    </footer>
  );
}
