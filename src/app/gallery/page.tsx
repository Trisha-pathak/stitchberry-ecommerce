import React from "react";
import Link from "next/link";
import { AnimatedHeading } from "@/components/PastelAnimations";

const GALLERY_ITEMS = [
  {
    img: "/images/gallery/floral-denim-jacket.svg",
    title: "Riya's Wildflower Denim Jacket",
    tag: "Custom Embroidery • Back Panel",
    quote: "\"Picked up from Pune & returned looking straight out of a storybook!\"",
  },
  {
    img: "/images/gallery/pastel-kurti-collar.svg",
    title: "Mehek's French Knot Kurti",
    tag: "Custom Embroidery • Collar & Cuffs",
    quote: "\"The baby-pink French knots matched my organza dupatta perfectly.\"",
  },
  {
    img: "/images/gallery/custom-tulip-bridal.svg",
    title: "Tia's Bridesmaid Tulip Bouquets",
    tag: "Custom Crochet Pre-Order • 25 Stems",
    quote: "\"Every bridesmaid kept her crochet bouquet on her bedside table.\"",
  },
  {
    img: "/images/gallery/baby-romper-bunny.svg",
    title: "Baby Aarav's Bunny Romper",
    tag: "Custom Embroidery • Baby Clothes",
    quote: "\"Super soft backing inside so nothing touches baby's skin.\"",
  },
  {
    img: "/images/gallery/saree-pallu-roses.svg",
    title: "Nandini's Bullion Rose Saree Pallu",
    tag: "Custom Embroidery • Sarees",
    quote: "\"The arrival inspection photo gave me full confidence sending my heirloom saree.\"",
  },
  {
    img: "/images/gallery/cloud-cardigan-custom.svg",
    title: "Ananya's Lavender Cloud Cardigan",
    tag: "Custom Crochet Pre-Order • M/L",
    quote: "\"Built the 4-color mix in the Yarn Studio and wore it all winter!\"",
  },
];

export default function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading
        eyebrow="Creative Feature H • Shared With Permission"
        title="Customer Gallery"
        subtitle="Real custom crochet pre-orders, ready-made favorites, and completed embroidery transformations worn by our community."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GALLERY_ITEMS.map((g) => (
          <div key={g.title} className="stitch-card rounded-5xl p-5 bg-white/90 space-y-3">
            <img
              src={g.img}
              alt={g.title}
              className="w-full h-52 rounded-3xl object-cover"
            />
            <span className="inline-block rounded-full bg-powder-blue/65 px-3 py-1 text-[11px] font-bold text-cocoa">
              {g.tag}
            </span>
            <h2 className="font-display text-xl font-bold text-cocoa">{g.title}</h2>
            <p className="text-xs font-semibold text-cocoa-light italic">{g.quote}</p>
          </div>
        ))}
      </div>
      <div className="text-center pt-4">
        <Link
          href="/embroidery"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 bg-cocoa text-vanilla-cream font-display font-bold"
        >
          Transform Your Own Garment
        </Link>
      </div>
    </div>
  );
}
