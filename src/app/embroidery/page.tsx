"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Scissors,
  Upload,
  Check,
  MapPin,
  Camera,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  GARMENT_TYPES,
  EMBROIDERY_PLACEMENTS,
  EMBROIDERY_TYPES,
  DESIGN_SIZES,
  PICKUP_SLOTS,
  YARN_PALETTE,
  EMBROIDERY_STATUSES,
  formatINR,
} from "@/lib/constants";
import { AnimatedHeading } from "@/components/PastelAnimations";
import { useStore } from "@/context/StoreContext";

export default function EmbroideryPage() {
  const { user, notify } = useStore();

  // Step 1
  const [garmentType, setGarmentType] = useState<string>(GARMENT_TYPES[6]); // Jackets
  const [otherGarmentText, setOtherGarmentText] = useState("");

  // Step 2
  const [garmentImageUrl, setGarmentImageUrl] = useState("");
  const [referenceDesignUrl, setReferenceDesignUrl] = useState("");
  const [inspirationImageUrl, setInspirationImageUrl] = useState("");
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

  // Step 3
  const [placement, setPlacement] = useState<string>(EMBROIDERY_PLACEMENTS[2]);
  const [threadColors, setThreadColors] = useState<{ name: string; hex: string }[]>([
    { name: "Powder Pink", hex: "#F7C6D9" },
    { name: "Powder Blue", hex: "#BFE3F5" },
    { name: "Butter Yellow", hex: "#FFF0B8" },
  ]);
  const [designSize, setDesignSize] = useState<string>(DESIGN_SIZES[2]);
  const [embroideryType, setEmbroideryType] = useState<string>(EMBROIDERY_TYPES[0]);
  const [personalizedText, setPersonalizedText] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  // Step 4
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [preferredPickupDate, setPreferredPickupDate] = useState("2026-12-04");
  const [preferredPickupSlot, setPreferredPickupSlot] = useState<string>(
    PICKUP_SLOTS[0]
  );

  // Step 5
  const [requestQuote, setRequestQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<{
    bookingNumber: string;
    status: string;
    estimatedPrice: number;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setCustomerName((p) => p || user.name);
      setCustomerEmail((p) => p || user.email);
      setMobileNumber((p) => p || user.phone);
    }
  }, [user]);

  const uploadToSlot = async (
    slot: "garment" | "reference" | "inspiration",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSlot(slot);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        if (slot === "garment") setGarmentImageUrl(data.url);
        if (slot === "reference") setReferenceDesignUrl(data.url);
        if (slot === "inspiration") setInspirationImageUrl(data.url);
        notify("Image uploaded safely!", "blue");
      } else {
        notify(data.error || "Upload failed.", "pink");
      }
    } finally {
      setUploadingSlot(null);
    }
  };

  const toggleThread = (swatch: { name: string; hex: string }) => {
    setThreadColors((prev) => {
      const exists = prev.some((c) => c.name === swatch.name);
      if (exists) return prev.length > 1 ? prev.filter((c) => c.name !== swatch.name) : prev;
      return prev.length >= 6 ? prev : [...prev, swatch];
    });
  };

  const sizeBase = designSize.includes("Tiny")
    ? 650
    : designSize.includes("Small")
    ? 950
    : designSize.includes("Medium")
    ? 1350
    : designSize.includes("Large")
    ? 1799
    : 2299;
  const textFee = personalizedText.trim() ? 180 : 0;
  const estimatedPrice = sizeBase + textFee;
  const pickupCharge = 99;
  const deliveryCharge = 99;

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/embroidery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garmentType,
          otherGarmentText,
          garmentImageUrl,
          referenceDesignUrl,
          inspirationImageUrl,
          placement,
          threadColors,
          designSize,
          embroideryType,
          personalizedText,
          additionalInstructions,
          customerName,
          mobileNumber,
          customerEmail,
          pickupAddress,
          pincode,
          preferredPickupDate,
          preferredPickupSlot,
          estimatedPrice,
          pickupCharge,
          deliveryCharge,
          estimatedCompletionDays: 10,
          requestQuote,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedBooking(data.booking);
        notify("Embroidery pickup booked!", "butter");
      } else {
        notify(data.error || "Please complete all booking details.", "pink");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (createdBooking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="stitch-card rounded-5xl p-8 sm:p-10 bg-vanilla-cream text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-powder-blue flex items-center justify-center border-2 border-cocoa/15">
            <Scissors className="w-10 h-10 text-cocoa" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cocoa">
            Embroidery Pickup Booking Confirmed!
          </h1>
          <p className="text-cocoa-light font-semibold">
            Booking Code:{" "}
            <span className="font-display text-xl text-cocoa bg-butter-yellow px-4 py-1 rounded-full">
              {createdBooking.bookingNumber}
            </span>
          </p>
          <p className="text-sm text-cocoa-light max-w-lg mx-auto">
            Our studio reviews your garment & design, confirms the final quote, schedules pickup, and uploads garment condition inspection photos upon receipt to protect your outfit.
          </p>

          <div className="text-left bg-white/85 rounded-3xl p-5 border border-powder-pink">
            <p className="font-display font-bold text-cocoa mb-3 text-sm">
              12-Stage Pickup, Inspection & Delivery Workflow:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EMBROIDERY_STATUSES.map((st, idx) => (
                <div
                  key={st}
                  className={`px-3 py-2 rounded-2xl text-xs font-bold border ${
                    st === createdBooking.status
                      ? "bg-powder-pink border-cocoa text-cocoa"
                      : "bg-vanilla-cream/70 border-cocoa/10 text-cocoa-light"
                  }`}
                >
                  {idx + 1}. {st}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/track?code=${createdBooking.bookingNumber}`}
              className="rounded-full px-6 py-3 bg-cocoa text-vanilla-cream font-bold text-sm"
            >
              Track Live Workflow
            </Link>
            <Link
              href="/account"
              className="rounded-full px-6 py-3 bg-powder-pink text-cocoa font-bold text-sm"
            >
              Open My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <AnimatedHeading
        eyebrow="Module 03 • Doorstep Garment Transformation"
        title="Your Clothes, Our Creativity"
        subtitle="Send us your cherished denim jackets, sarees, kurtis, shirts, or baby clothes. We pick them up from your home, record condition photos on arrival, hand-embroider your design, and deliver them back."
      />

      {/* Condition Inspection Guarantee Banner */}
      <div className="stitch-card rounded-4xl p-5 bg-gradient-to-r from-powder-blue/50 via-vanilla-cream to-soft-lavender/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="p-3 rounded-2xl bg-white border border-cocoa/15 shrink-0">
            <Camera className="w-6 h-6 text-cocoa" />
          </span>
          <div>
            <p className="font-display font-bold text-cocoa">
              Garment Condition Photo Confirmation Guarantee
            </p>
            <p className="text-xs font-semibold text-cocoa-light">
              Every garment is photographed & inspected upon studio arrival in your dashboard so you have 100% peace of mind across all 12 stages.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-butter-yellow px-4 py-1.5 text-xs font-bold text-cocoa shrink-0">
          <ShieldCheck className="w-4 h-4" /> Insured Doorstep Pickup
        </span>
      </div>

      <form
        onSubmit={submitBooking}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div className="lg:col-span-8 space-y-7">
          {/* STEP 1 */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Step 1: Choose Your Garment
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {GARMENT_TYPES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGarmentType(g)}
                  className={`px-4 py-2.5 rounded-full text-sm font-bold border-2 transition ${
                    garmentType === g
                      ? "bg-powder-pink border-cocoa text-cocoa shadow-sm scale-105"
                      : "bg-vanilla-cream border-cocoa/10 text-cocoa-light hover:bg-powder-blue/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {garmentType === "Other garments" && (
              <input
                required
                value={otherGarmentText}
                onChange={(e) => setOtherGarmentText(e.target.value)}
                placeholder="Describe your garment (e.g. Lehenga blouse, linen scarf, canvas cap)"
                className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
            )}
          </div>

          {/* STEP 2 */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Step 2: Upload Your Clothing & Design Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  slot: "garment" as const,
                  title: "Picture of Your Garment",
                  url: garmentImageUrl,
                },
                {
                  slot: "reference" as const,
                  title: "Reference Embroidery Design",
                  url: referenceDesignUrl,
                },
                {
                  slot: "inspiration" as const,
                  title: "Extra Inspiration Image",
                  url: inspirationImageUrl,
                },
              ].map((item) => (
                <label
                  key={item.slot}
                  className="rounded-3xl border-2 border-dashed border-powder-pink bg-vanilla-cream/70 p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-baby-pink/40 transition min-h-[150px]"
                >
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <Upload className="w-7 h-7 text-cocoa/60" />
                  )}
                  <span className="text-xs font-bold text-cocoa">
                    {uploadingSlot === item.slot ? "Uploading..." : item.title}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadToSlot(item.slot, e)}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* STEP 3 */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-5">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Step 3: Select Embroidery Preferences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Embroidery Placement
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm font-semibold bg-vanilla-cream border border-cocoa/15"
                >
                  {EMBROIDERY_PLACEMENTS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Type of Embroidery
                </label>
                <select
                  value={embroideryType}
                  onChange={(e) => setEmbroideryType(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm font-semibold bg-vanilla-cream border border-cocoa/15"
                >
                  {EMBROIDERY_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Design Size
                </label>
                <select
                  value={designSize}
                  onChange={(e) => setDesignSize(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm font-semibold bg-vanilla-cream border border-cocoa/15"
                >
                  {DESIGN_SIZES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-cocoa-light mb-2">
                Preferred Thread Colors (Select up to 6)
              </p>
              <div className="flex flex-wrap gap-2">
                {YARN_PALETTE.map((sw) => {
                  const active = threadColors.some((c) => c.name === sw.name);
                  return (
                    <button
                      key={sw.name}
                      type="button"
                      onClick={() => toggleThread(sw)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                        active
                          ? "border-cocoa bg-powder-blue/40 shadow-sm"
                          : "border-cocoa/15 bg-vanilla-cream"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-cocoa/20 flex items-center justify-center"
                        style={{ backgroundColor: sw.hex }}
                      >
                        {active && <Check className="w-2.5 h-2.5 text-cocoa" />}
                      </span>
                      {sw.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Text or Name Personalization (+₹180)
                </label>
                <input
                  value={personalizedText}
                  onChange={(e) => setPersonalizedText(e.target.value)}
                  placeholder="Optional monogram, quote, or baby name"
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Additional Instructions
                </label>
                <input
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Fabric sensitivity, bead preferences, etc."
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Step 4: Pickup Address & Time Slot
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Mobile Number"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email for updates"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Complete Pickup Address (Flat, Street, Landmark)"
                className="sm:col-span-2 rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode (e.g. 400050)"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Preferred Pickup Date
                </label>
                <input
                  type="date"
                  required
                  value={preferredPickupDate}
                  onChange={(e) => setPreferredPickupDate(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-cocoa-light block mb-1.5">
                  Preferred Pickup Time Slot
                </label>
                <select
                  value={preferredPickupSlot}
                  onChange={(e) => setPreferredPickupSlot(e.target.value)}
                  className="w-full rounded-full px-4 py-2.5 text-sm font-semibold bg-vanilla-cream border border-cocoa/15"
                >
                  {PICKUP_SLOTS.map((slot) => (
                    <option key={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 5 & 6 Sticky Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="stitch-card rounded-5xl p-6 bg-gradient-to-br from-soft-lavender/70 via-vanilla-cream to-powder-pink/55 space-y-5">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              Step 5: Booking & Pricing
            </h2>

            <div className="rounded-3xl bg-white/85 p-4 space-y-2 text-xs font-semibold text-cocoa">
              <div className="flex justify-between">
                <span className="text-cocoa-light">Garment</span>
                <span className="font-bold">{garmentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-light">Placement</span>
                <span className="font-bold">{placement}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-light">Embroidery</span>
                <span className="font-bold">{embroideryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-light">Size</span>
                <span className="font-bold">{designSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-light">Est. Completion</span>
                <span className="font-bold">~10 Working Days</span>
              </div>
              <div className="border-t border-dashed border-cocoa/15 pt-2 flex justify-between">
                <span className="text-cocoa-light">Estimated Embroidery</span>
                <span className="font-bold">{formatINR(estimatedPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-light">Insured Pickup Charge</span>
                <span className="font-bold">{formatINR(pickupCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-light">Return Delivery Charge</span>
                <span className="font-bold">{formatINR(deliveryCharge)}</span>
              </div>
              <div className="border-t border-dashed border-cocoa/15 pt-2 flex justify-between items-baseline">
                <span className="font-display text-base font-bold">
                  Est. Total
                </span>
                <span className="font-display text-2xl font-bold">
                  {formatINR(estimatedPrice + pickupCharge + deliveryCharge)}
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/85 text-xs font-bold text-cocoa cursor-pointer border border-cocoa/10">
              <input
                type="checkbox"
                checked={requestQuote}
                onChange={(e) => setRequestQuote(e.target.checked)}
              />
              <span>
                Request exact studio quotation after designer reviews my photos
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full py-4 px-6 bg-cocoa text-vanilla-cream font-display font-bold text-base hover:bg-cocoa-dark transition shadow-candy flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? "Booking Pickup..." : "Submit Embroidery Booking"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="rounded-3xl bg-white/70 p-4 space-y-2">
              <p className="text-xs font-bold text-cocoa flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Step 6: How Pickup & Delivery Works
              </p>
              <p className="text-[11px] font-semibold text-cocoa-light leading-relaxed">
                1. Booking reviewed → 2. Price confirmed → 3. Courier picks up garment → 4. Condition photographed on arrival → 5. Hand embroidery → 6. Quality check & doorstep return!
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
