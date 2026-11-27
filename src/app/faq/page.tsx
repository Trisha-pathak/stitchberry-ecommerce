import React from "react";
import { AnimatedHeading } from "@/components/PastelAnimations";

const FAQS = [
  {
    q: "How is a Custom Crochet Pre-Order different from Ready-Made shopping?",
    a: "Ready-made items are already handcrafted and ship within 48 hours. Custom Crochet Pre-Orders are crafted from scratch in your exact yarn color combination, size, and personalized lettering, and follow a dedicated 9-stage production timeline.",
  },
  {
    q: "How does Custom Embroidery on my own clothes stay safe during pickup?",
    a: "Our courier picks up your garment from your address in a sealed protective pouch. As soon as it arrives at our studio, we inspect and upload condition photographs to your dashboard before a single stitch begins.",
  },
  {
    q: "What payment methods do you support in India?",
    a: "We support Razorpay (UPI, GPay, PhonePe, Credit/Debit Cards, NetBanking) for all modules, plus Cash on Delivery on eligible ready-made orders.",
  },
  {
    q: "Can I save my yarn color combinations for later?",
    a: "Yes! Visit the Yarn Color Studio to experiment with our 14 pastel yarn shades and save palettes directly to your customer dashboard.",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading eyebrow="Helpful Answers" title="Frequently Asked Questions" />
      <div className="space-y-4">
        {FAQS.map((f) => (
          <div key={f.q} className="stitch-card rounded-4xl p-6 bg-white/90 space-y-2">
            <h2 className="font-display text-xl font-bold text-cocoa">{f.q}</h2>
            <p className="text-sm font-semibold text-cocoa-light leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
