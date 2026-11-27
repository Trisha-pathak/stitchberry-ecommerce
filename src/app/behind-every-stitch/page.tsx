import React from "react";
import { AnimatedHeading } from "@/components/PastelAnimations";

const STAGES = [
  {
    step: "01",
    title: "Curating Cotton-Candy Yarn Skeins",
    desc: "We hand-pick combed milk cotton and mercerized yarn skeins dyed in soft powder blue, baby pink, lavender, and butter yellow—tested for zero skin itch.",
    img: "/images/gallery/custom-tulip-bridal.svg",
  },
  {
    step: "02",
    title: "Loop-by-Loop Tension & Hook Work",
    desc: "Our crocheters stitch tightly for plushies so polyfill never peeks through, and loosely with airy drape for cardigans and market totes.",
    img: "/images/gallery/cloud-cardigan-custom.svg",
  },
  {
    step: "03",
    title: "Garment Condition Check & Hoop Framing",
    desc: "When your own jacket, kurti, or saree reaches our studio, we photograph it on arrival, stabilize delicate fabrics with water-soluble backing, and sketch your motif.",
    img: "/images/gallery/floral-denim-jacket.svg",
  },
  {
    step: "04",
    title: "French Knots, Bullion Roses & Steam Blocking",
    desc: "Every petal is hand-stitched, knots are sealed gently on the reverse side so they never scratch skin, and pieces are steam-blocked before ribbon wrapping.",
    img: "/images/gallery/saree-pallu-roses.svg",
  },
];

export default function BehindEveryStitchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <AnimatedHeading
        eyebrow="Creative Feature C • Studio Diary"
        title="Behind Every Stitch"
        subtitle="Peek inside our crochet hooks, embroidery hoops, and careful quality rituals from raw yarn to pastel parcel."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {STAGES.map((st) => (
          <div
            key={st.step}
            className="stitch-card rounded-5xl p-6 bg-white/90 space-y-4"
          >
            <img
              src={st.img}
              alt={st.title}
              className="w-full h-56 rounded-4xl object-cover border-2 border-white shadow-sm"
            />
            <span className="inline-block rounded-full bg-butter-yellow px-3.5 py-1 text-xs font-bold text-cocoa">
              Studio Reel {st.step}
            </span>
            <h2 className="font-display text-2xl font-bold text-cocoa">
              {st.title}
            </h2>
            <p className="text-sm font-semibold text-cocoa-light leading-relaxed">
              {st.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
