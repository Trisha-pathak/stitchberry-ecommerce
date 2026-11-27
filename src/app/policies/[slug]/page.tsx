import React from "react";
import { AnimatedHeading } from "@/components/PastelAnimations";

const POLICIES: Record<string, { title: string; body: string[] }> = {
  shipping: {
    title: "Shipping & Return Policy",
    body: [
      "Ready-made crochet products ship within 1–2 working days across India. Free shipping applies on ready-made orders above ₹1,999 (or use code FREESHIP).",
      "Custom Crochet Pre-Orders take 7–16 working days depending on item complexity and timeline preference.",
      "Custom Embroidery bookings include insured doorstep pickup and return delivery (₹99 each way) with arrival condition photo verification.",
      "Ready-made unused items in original packaging are eligible for a 7-day exchange or refund. Customized pre-orders and embroidered garments are bespoke and non-returnable unless damaged in transit.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "StitchBerry collects only the details needed to craft, personalize, pick up, and deliver your orders—such as your name, email, phone number, pickup/delivery address, and uploaded design photos.",
      "Uploaded garment and inspiration photos are used solely by our studio artisans and quality team (unless you opt in to share completed work in our Customer Gallery).",
      "We never sell or share customer data with third-party marketers. Payments are processed securely via Razorpay.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "Every StitchBerry product is handmade, so gentle millimeter variations in loop size or floral petal placement are part of authentic craft.",
      "For Custom Embroidery on customer-owned garments, customers confirm garments are freshly washed before pickup. Our studio records arrival condition photos prior to starting work.",
      "Advance payments on Custom Crochet Pre-Orders reserve yarn dye lots and artisan studio slots.",
    ],
  },
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug] || POLICIES.shipping;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <AnimatedHeading eyebrow="Studio Policies" title={policy.title} />
      <div className="stitch-card rounded-5xl p-8 bg-white/90 space-y-4">
        {policy.body.map((para, i) => (
          <p key={i} className="text-sm sm:text-base font-semibold text-cocoa-light leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
