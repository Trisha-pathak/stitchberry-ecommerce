"use client";

import React, { useState, useEffect } from "react";
import { Gift, Upload, Sparkles } from "lucide-react";
import { AnimatedHeading } from "@/components/PastelAnimations";
import { ProductCard, ProductRecord } from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function GiftCornerPage() {
  const { notify } = useStore();
  const [giftProducts, setGiftProducts] = useState<ProductRecord[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const [giftIdea, setGiftIdea] = useState("");
  const [budgetRange, setBudgetRange] = useState("₹1,000 – ₹2,500");
  const [deliveryDate, setDeliveryDate] = useState("2026-12-15");
  const [giftNote, setGiftNote] = useState("");
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setGiftProducts((d.products || []).slice(0, 4)));
  }, []);

  const uploadRef = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) {
      setReferenceImageUrl(data.url);
      notify("Gift inspiration photo uploaded!", "blue");
    }
  };

  const submitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/gift-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          occasion,
          giftIdea,
          referenceImageUrl,
          budgetRange,
          deliveryDate,
          giftNote,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        notify("Custom gift idea received by our studio!", "butter");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
      <AnimatedHeading
        eyebrow="Creative Features D & E • Gift Corner"
        title="Crochet Gifts & Custom Keepsakes"
        subtitle="Pick a gift-ready treasure with satin ribbon wrapping and handwritten notes, or pitch a completely new custom crochet gift idea!"
      />

      {/* Ready-made gift picks */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-cocoa" />
          <h2 className="font-display text-2xl font-bold text-cocoa">
            Most-Gifted Pastel Treasures (Complimentary Gift Wrap at Checkout)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {giftProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Custom Gift Order Form */}
      <section className="stitch-card rounded-5xl p-7 sm:p-10 bg-gradient-to-br from-baby-pink/60 via-vanilla-cream to-powder-blue/50">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <Sparkles className="w-10 h-10 mx-auto text-cocoa" />
            <h3 className="font-display text-3xl font-bold text-cocoa">
              We Love Your Custom Gift Idea!
            </h3>
            <p className="text-sm font-semibold text-cocoa-light max-w-md mx-auto">
              Our designers will sketch your idea and reply on WhatsApp / email within 24 hours with yarn suggestions & pricing.
            </p>
          </div>
        ) : (
          <form onSubmit={submitIdea} className="space-y-5">
            <div>
              <h2 className="font-display text-3xl font-bold text-cocoa">
                Request a Completely New Custom Gift Idea
              </h2>
              <p className="text-sm font-semibold text-cocoa-light mt-1">
                Want a crochet portrait of a pet, a mini wedding bouquet, or an anniversary memory box? Upload a photo and describe it!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
              />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="WhatsApp / Mobile"
                className="rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15 font-semibold"
              >
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Baby Shower</option>
                <option>Bridesmaid Hamper</option>
                <option>Just Because</option>
              </select>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15 font-semibold"
              >
                <option>₹700 – ₹1,200</option>
                <option>₹1,000 – ₹2,500</option>
                <option>₹2,500 – ₹5,000</option>
                <option>₹5,000+</option>
              </select>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
              />
            </div>

            <textarea
              required
              rows={3}
              value={giftIdea}
              onChange={(e) => setGiftIdea(e.target.value)}
              placeholder="Describe your custom gift idea, colors, characters, or box contents..."
              className="w-full rounded-3xl p-4 text-sm bg-white border border-cocoa/15"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <input
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Optional personalized message for the gift card"
                className="rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
              />
              <label className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 bg-powder-blue/80 text-xs font-bold text-cocoa cursor-pointer">
                <Upload className="w-4 h-4" />
                {referenceImageUrl ? "Reference Image Uploaded ✓" : "Upload Reference Image"}
                <input type="file" accept="image/*" onChange={uploadRef} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full px-8 py-3.5 bg-cocoa text-vanilla-cream font-display font-bold hover:bg-cocoa-dark transition"
            >
              {submitting ? "Sending Idea..." : "Submit Custom Gift Request"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
