"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Palette,
  Upload,
  Sparkles,
  Check,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  YARN_PALETTE,
  PREORDER_STATUSES,
  formatINR,
} from "@/lib/constants";
import { AnimatedHeading } from "@/components/PastelAnimations";
import { useStore } from "@/context/StoreContext";

const PRODUCT_TYPES = [
  { name: "Crochet Tulip Bouquet", basePrice: 1299, days: 7 },
  { name: "Crochet Granny Tote Bag", basePrice: 1899, days: 10 },
  { name: "Custom Amigurumi Plushie", basePrice: 1499, days: 10 },
  { name: "Pastel Granny Cardigan", basePrice: 3499, days: 16 },
  { name: "Crochet Baby Blanket", basePrice: 2799, days: 14 },
  { name: "Crochet Cushion Cover", basePrice: 1399, days: 8 },
  { name: "Custom Gift Hamper", basePrice: 1999, days: 9 },
];

const SIZES = ["Mini / Petite", "Standard", "Large / Oversized"];
const VARIATIONS = [
  "Classic Daisy Stitch",
  "Scalloped Candy Edge",
  "Granny Square Patchwork",
  "Puff Heart Texture",
  "Pearl & Ribbon Trim",
];

export default function CustomCrochetPage() {
  const { user, notify } = useStore();

  const [productType, setProductType] = useState(PRODUCT_TYPES[1].name);
  const [selectedColors, setSelectedColors] = useState<
    { name: string; hex: string }[]
  >([
    { name: "Powder Blue", hex: "#BFE3F5" },
    { name: "Powder Pink", hex: "#F7C6D9" },
    { name: "Vanilla Cream", hex: "#FFF8ED" },
  ]);
  const [size, setSize] = useState("Standard");
  const [designVariation, setDesignVariation] = useState(VARIATIONS[0]);
  const [personalizedText, setPersonalizedText] = useState("");
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState("2026-12-20");
  const [timelinePreference, setTimelinePreference] = useState(
    "Standard (10-14 days)"
  );
  const [requestQuote, setRequestQuote] = useState(false);
  const [payAdvanceNow, setPayAdvanceNow] = useState(true);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [createdPreOrder, setCreatedPreOrder] = useState<{
    preOrderNumber: string;
    status: string;
    estimatedPrice: number;
    advanceAmount: number;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setContactName((prev) => prev || user.name);
      setContactEmail((prev) => prev || user.email);
      setContactPhone((prev) => prev || user.phone);
    }
    // Load palette passed from Yarn Studio if present
    try {
      const studioPalette = localStorage.getItem("stitchberry_studio_palette");
      if (studioPalette) {
        const parsed = JSON.parse(studioPalette);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedColors(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [user]);

  const toggleColor = (swatch: { name: string; hex: string }) => {
    setSelectedColors((prev) => {
      const exists = prev.some((c) => c.name === swatch.name);
      if (exists) {
        return prev.length > 1 ? prev.filter((c) => c.name !== swatch.name) : prev;
      }
      if (prev.length >= 5) {
        notify("You can blend up to 5 yarn colors per custom piece!", "butter");
        return prev;
      }
      return [...prev, swatch];
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setReferenceImageUrl(data.url);
        notify("Inspiration photo uploaded!", "blue");
      } else {
        notify(data.error || "Upload failed.", "pink");
      }
    } finally {
      setUploading(false);
    }
  };

  const baseObj =
    PRODUCT_TYPES.find((p) => p.name === productType) || PRODUCT_TYPES[0];
  const sizeMultiplier =
    size === "Mini / Petite" ? 0.85 : size === "Large / Oversized" ? 1.25 : 1;
  const expressFee = timelinePreference.includes("Express") ? 250 : 0;
  const personalizationFee = personalizedText.trim() ? 150 : 0;
  const estimatedPrice = Math.round(
    (baseObj.basePrice * sizeMultiplier + personalizationFee + expressFee) *
      quantity
  );
  const advanceAmount = Math.round(estimatedPrice * 0.4);
  const prodDays = timelinePreference.includes("Express")
    ? Math.max(5, Math.round(baseObj.days * 0.6))
    : baseObj.days;

  const submitPreOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (payAdvanceNow && !requestQuote) {
        await fetch("/api/payments/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: advanceAmount,
            receipt: `pre_${Date.now()}`,
          }),
        });
      }

      const res = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType,
          selectedColors,
          size,
          designVariation,
          personalizedText,
          referenceImageUrl,
          specialInstructions,
          quantity,
          requiredDeliveryDate,
          timelinePreference,
          estimatedPrice,
          requestQuote,
          payAdvanceNow: payAdvanceNow && !requestQuote,
          deliveryAddress: { line1, city, pincode },
          contactName,
          contactPhone,
          contactEmail,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedPreOrder(data.preOrder);
        notify("Your custom crochet pre-order is booked!", "butter");
      } else {
        notify(data.error || "Please complete all required fields.", "pink");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (createdPreOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="stitch-card rounded-5xl p-8 sm:p-10 bg-vanilla-cream text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-butter-yellow flex items-center justify-center border-2 border-cocoa/15">
            <Sparkles className="w-10 h-10 text-cocoa" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cocoa">
            Custom Crochet Pre-Order Placed!
          </h1>
          <p className="text-cocoa-light font-semibold">
            Pre-Order Reference:{" "}
            <span className="font-display text-xl text-cocoa bg-powder-pink/60 px-3 py-1 rounded-full">
              {createdPreOrder.preOrderNumber}
            </span>
          </p>
          <p className="text-sm text-cocoa-light max-w-md mx-auto">
            Current Status:{" "}
            <strong className="text-cocoa">{createdPreOrder.status}</strong> •
            Estimated Total:{" "}
            <strong className="text-cocoa">
              {formatINR(createdPreOrder.estimatedPrice)}
            </strong>{" "}
            {createdPreOrder.advanceAmount > 0 &&
              `(Advance Paid: ${formatINR(createdPreOrder.advanceAmount)})`}
          </p>

          <div className="text-left bg-white/80 rounded-3xl p-5 border border-powder-blue">
            <p className="font-display font-bold text-cocoa mb-3 text-sm">
              Your 9-Stage Pre-Order Journey:
            </p>
            <div className="flex flex-wrap gap-2">
              {PREORDER_STATUSES.map((st) => (
                <span
                  key={st}
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    st === createdPreOrder.status
                      ? "bg-powder-pink border-cocoa text-cocoa"
                      : "bg-vanilla-cream border-cocoa/10 text-cocoa-light"
                  }`}
                >
                  {st}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href={`/track?code=${createdPreOrder.preOrderNumber}`}
              className="rounded-full px-6 py-3 bg-cocoa text-vanilla-cream font-bold text-sm"
            >
              Track Pre-Order
            </Link>
            <Link
              href="/account"
              className="rounded-full px-6 py-3 bg-powder-blue text-cocoa font-bold text-sm"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const c0 = selectedColors[0]?.hex || "#BFE3F5";
  const c1 = selectedColors[1]?.hex || c0;
  const c2 = selectedColors[2]?.hex || c1;
  const c3 = selectedColors[3]?.hex || c0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <AnimatedHeading
        eyebrow="Module 02 • Custom Crochet Pre-Orders"
        title="Design Your Own Crochet"
        subtitle="Build your own pastel yarn color combination, preview it live, add personalized lettering, and place a made-to-order pre-order crafted just for you."
      />

      <form
        onSubmit={submitPreOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Configuration Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Product Type & Size */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-5">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              1. Choose Crochet Creation & Size
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRODUCT_TYPES.map((pt) => (
                <button
                  key={pt.name}
                  type="button"
                  onClick={() => setProductType(pt.name)}
                  className={`text-left p-3.5 rounded-3xl border-2 transition ${
                    productType === pt.name
                      ? "bg-powder-pink/55 border-cocoa shadow-sm"
                      : "bg-vanilla-cream/80 border-cocoa/10 hover:bg-powder-blue/30"
                  }`}
                >
                  <p className="font-display font-bold text-cocoa">{pt.name}</p>
                  <p className="text-xs font-semibold text-cocoa-light">
                    From {formatINR(pt.basePrice)} • ~{pt.days} days
                  </p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm font-semibold bg-vanilla-cream border border-cocoa/15"
                >
                  {SIZES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Stitch / Design Variation
                </label>
                <select
                  value={designVariation}
                  onChange={(e) => setDesignVariation(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm font-semibold bg-vanilla-cream border border-cocoa/15"
                >
                  {VARIATIONS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Build Your Own Color Combination */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-display text-2xl font-bold text-cocoa flex items-center gap-2">
                <Palette className="w-6 h-6 text-cocoa" />
                2. Build Your Own Color Combination
              </h2>
              <span className="text-xs font-bold bg-butter-yellow px-3 py-1 rounded-full text-cocoa">
                {selectedColors.length} / 5 yarn shades selected
              </span>
            </div>
            <p className="text-xs font-semibold text-cocoa-light">
              Tap multiple pastel yarn balls to experiment with your custom palette. Watch the live crochet swatch update on the right!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {YARN_PALETTE.map((swatch) => {
                const active = selectedColors.some((c) => c.name === swatch.name);
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => toggleColor(swatch)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border-2 text-left transition ${
                      active
                        ? "border-cocoa bg-baby-pink/45 scale-[1.02] shadow-sm"
                        : "border-cocoa/10 bg-vanilla-cream/70 hover:border-powder-pink"
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-full border border-cocoa/25 shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {active && <Check className="w-3.5 h-3.5 text-cocoa" />}
                    </span>
                    <span className="text-xs font-bold text-cocoa leading-tight">
                      {swatch.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Personalization & Reference Image */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              3. Personalization, Inspiration & Timeline
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Name / Personalized Message (+₹150)
                </label>
                <input
                  value={personalizedText}
                  onChange={(e) => setPersonalizedText(e.target.value)}
                  maxLength={24}
                  placeholder="e.g. Ananya, Sweet Pea, 2026"
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Required Delivery Date
                </label>
                <input
                  type="date"
                  required
                  value={requiredDeliveryDate}
                  onChange={(e) => setRequiredDeliveryDate(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Preferred Timeline
                </label>
                <select
                  value={timelinePreference}
                  onChange={(e) => setTimelinePreference(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15 font-semibold"
                >
                  <option>Standard (10-14 days)</option>
                  <option>Express Crafting (+₹250, 5-7 days)</option>
                  <option>Flexible / No Rush</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                Upload Reference Image / Inspiration Photo
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 bg-powder-blue/70 hover:bg-powder-blue text-xs font-bold text-cocoa cursor-pointer border border-cocoa/15">
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Choose Inspiration Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
                {referenceImageUrl && (
                  <img
                    src={referenceImageUrl}
                    alt="Uploaded inspiration"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-powder-pink"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                Special Instructions
              </label>
              <textarea
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Tell us strap length, button preference, gift box note, or exact color placement..."
                className="w-full rounded-3xl p-4 text-sm bg-vanilla-cream border border-cocoa/15"
              />
            </div>
          </div>

          {/* 4. Delivery & Contact Details */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              4. Delivery Address & Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Full Name"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Mobile Number"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                required
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email Address"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="Complete Delivery Address"
                className="sm:col-span-2 rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="rounded-full px-3.5 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
                <input
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  className="rounded-full px-3.5 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Live Preview & Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="stitch-card rounded-5xl p-6 bg-gradient-to-br from-powder-blue/45 via-vanilla-cream to-baby-pink/55 space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold text-cocoa">
                Live Yarn Preview
              </span>
              <span className="text-xs font-bold bg-white/85 px-3 py-1 rounded-full text-cocoa">
                {designVariation}
              </span>
            </div>

            {/* Live Crochet Granny & Yarn Swatch Preview SVG */}
            <motion.div
              key={selectedColors.map((c) => c.hex).join("-")}
              initial={{ scale: 0.96, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-4xl bg-white/85 border-2 border-white p-5 flex flex-col items-center justify-center shadow-inner"
            >
              <svg viewBox="0 0 260 220" className="w-56 h-48">
                {/* Outer Granny Frame */}
                <rect x="30" y="14" width="200" height="170" rx="28" fill={c0} stroke="#59434A" strokeWidth="3.5" />
                <rect x="48" y="32" width="164" height="134" rx="22" fill={c1} stroke="#59434A" strokeWidth="2.5" strokeDasharray="6 4" />
                <rect x="68" y="52" width="124" height="94" rx="18" fill={c2} stroke="#59434A" strokeWidth="2.5" />
                <circle cx="130" cy="99" r="32" fill={c3} stroke="#59434A" strokeWidth="2.5" />
                {/* Crochet flower petal center */}
                <circle cx="130" cy="85" r="9" fill="#FFF8ED" stroke="#59434A" strokeWidth="1.8" />
                <circle cx="143" cy="96" r="9" fill="#FFF8ED" stroke="#59434A" strokeWidth="1.8" />
                <circle cx="137" cy="111" r="9" fill="#FFF8ED" stroke="#59434A" strokeWidth="1.8" />
                <circle cx="123" cy="111" r="9" fill="#FFF8ED" stroke="#59434A" strokeWidth="1.8" />
                <circle cx="117" cy="96" r="9" fill="#FFF8ED" stroke="#59434A" strokeWidth="1.8" />
                <circle cx="130" cy="99" r="7" fill="#FFF0B8" stroke="#59434A" strokeWidth="1.8" />
                {personalizedText && (
                  <g transform="translate(130, 198)">
                    <rect x="-78" y="-14" width="156" height="24" rx="12" fill="#FFF8ED" stroke="#59434A" strokeWidth="2" />
                    <text x="0" y="3" textAnchor="middle" fontSize="12" fontWeight="700" fill="#59434A">
                      {personalizedText}
                    </text>
                  </g>
                )}
              </svg>

              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {selectedColors.map((c) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-vanilla-cream border border-cocoa/15 text-[11px] font-bold text-cocoa"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-cocoa/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Customization Summary */}
            <div className="rounded-3xl bg-white/80 p-4 space-y-2 text-sm">
              <div className="flex justify-between font-semibold text-cocoa-light">
                <span>Item & Size</span>
                <span className="text-cocoa font-bold text-right">
                  {productType} ({size})
                </span>
              </div>
              <div className="flex justify-between font-semibold text-cocoa-light">
                <span>Est. Production Time</span>
                <span className="text-cocoa font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> ~{prodDays} days
                </span>
              </div>
              <div className="flex justify-between font-semibold text-cocoa-light">
                <span>Quantity</span>
                <span className="text-cocoa font-bold">{quantity}</span>
              </div>
              <div className="pt-2 border-t border-dashed border-cocoa/15 flex justify-between items-baseline">
                <span className="font-display font-bold text-cocoa">
                  Estimated Price
                </span>
                <span className="font-display text-3xl font-bold text-cocoa">
                  {formatINR(estimatedPrice)}
                </span>
              </div>
            </div>

            {/* Payment / Quote Mode */}
            <div className="space-y-2 text-xs font-bold text-cocoa">
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 cursor-pointer border border-cocoa/10">
                <input
                  type="radio"
                  checked={!requestQuote && payAdvanceNow}
                  onChange={() => {
                    setRequestQuote(false);
                    setPayAdvanceNow(true);
                  }}
                />
                <span>
                  Pay 40% Advance Now ({formatINR(advanceAmount)}) via Razorpay Demo & Lock Slot
                </span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 cursor-pointer border border-cocoa/10">
                <input
                  type="radio"
                  checked={requestQuote}
                  onChange={() => {
                    setRequestQuote(true);
                    setPayAdvanceNow(false);
                  }}
                />
                <span>
                  Request Custom Studio Quote First (Pay after design confirmation)
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full py-4 px-6 bg-cocoa text-vanilla-cream font-display font-bold text-base hover:bg-cocoa-dark transition shadow-candy flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting
                ? "Submitting Pre-Order..."
                : requestQuote
                ? "Request Custom Quote"
                : `Submit Pre-Order & Pay ${formatINR(advanceAmount)}`}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] font-semibold text-cocoa-light flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cocoa" />
              Separate pre-order tracking across all 9 crafting stages
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
