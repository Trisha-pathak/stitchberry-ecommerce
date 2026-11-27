import React from "react";
import { Droplets, Sun, Archive, Sparkles } from "lucide-react";
import { AnimatedHeading } from "@/components/PastelAnimations";

export default function CarePage() {
  const tips = [
    {
      icon: Droplets,
      title: "Gentle Hand Wash Only",
      desc: "Soak crochet bags, cardigans, and embroidered outfits in cool water with mild liquid detergent for 10 minutes. Swirl gently—never wring or twist.",
      bg: "bg-powder-blue/45",
    },
    {
      icon: Sun,
      title: "Flat Towel Dry in Shade",
      desc: "Press excess water out inside a clean cotton towel, reshape granny squares or plushie ears, and dry flat away from harsh midday sunlight.",
      bg: "bg-butter-yellow/60",
    },
    {
      icon: Archive,
      title: "Folded Storage (Never Hang)",
      desc: "Store crochet cardigans and embroidered sarees folded inside breathable cotton muslin bags so gravity never stretches the hand-knitted loops.",
      bg: "bg-powder-pink/45",
    },
    {
      icon: Sparkles,
      title: "Embroidery & Plushie Spot Care",
      desc: "For forever flowers and plushies, lightly dust with a soft makeup brush or lint roller. Iron embroidered garments inside-out on low steam.",
      bg: "bg-soft-lavender/60",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading
        eyebrow="Creative Feature F • Longevity Guide"
        title="Handmade Care Instructions"
        subtitle="Keep your pastel crochet keepsakes and hand-embroidered clothes soft, bright, and heirloom-ready for years."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.title} className={`stitch-card rounded-4xl p-6 ${t.bg} space-y-3`}>
              <Icon className="w-7 h-7 text-cocoa" />
              <h2 className="font-display text-2xl font-bold text-cocoa">{t.title}</h2>
              <p className="text-sm font-semibold text-cocoa-light leading-relaxed">{t.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
