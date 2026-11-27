import React from "react";
import Link from "next/link";
import { Heart, Sparkles, Scissors } from "lucide-react";
import { AnimatedHeading } from "@/components/PastelAnimations";

export default function HandmadeStoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <AnimatedHeading
        eyebrow="Creative Feature B • About Us"
        title="Our Handmade Story"
        subtitle="Born from a cozy wooden table, pastel cotton skeins, and a belief that slow handmade craft makes everyday life feel like a warm hug."
      />

      <div className="stitch-card rounded-5xl p-8 sm:p-10 bg-gradient-to-br from-powder-pink/40 via-vanilla-cream to-powder-blue/40 space-y-6">
        <p className="text-base sm:text-lg text-cocoa font-semibold leading-relaxed">
          StitchBerry started in Mumbai in 2023 when founder Meera began crocheting forever tulip bouquets and hand-embroidering wildflowers onto friends&apos; well-loved denim jackets. Every piece is made strictly by hand—never factory-knitted—using soft combed cotton milk yarns and colorfast French embroidery floss.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {[
            {
              icon: Heart,
              title: "Slow Craftsmanship",
              text: "Each cardigan takes 18+ hours of granny-square assembly and hand-finishing.",
              bg: "bg-baby-pink/60",
            },
            {
              icon: Sparkles,
              title: "Artisan Community",
              text: "12 women crochet & zardozi artisans craft every order in sunlit home studios.",
              bg: "bg-butter-yellow/70",
            },
            {
              icon: Scissors,
              title: "Wardrobe Revival",
              text: "Instead of tossing plain clothes, our embroidery service turns your existing wardrobe into art.",
              bg: "bg-powder-blue/60",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`rounded-4xl p-5 ${item.bg} border border-white space-y-2`}>
                <Icon className="w-6 h-6 text-cocoa" />
                <h3 className="font-display text-xl font-bold text-cocoa">{item.title}</h3>
                <p className="text-xs font-semibold text-cocoa-light leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link href="/behind-every-stitch" className="rounded-full px-6 py-3 bg-cocoa text-vanilla-cream font-bold text-sm">
            See Behind Every Stitch
          </Link>
          <Link href="/shop" className="rounded-full px-6 py-3 bg-white border border-cocoa/15 text-cocoa font-bold text-sm">
            Explore the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
