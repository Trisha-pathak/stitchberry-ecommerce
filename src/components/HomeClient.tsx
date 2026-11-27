"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  ShoppingBag,
  Palette,
  Scissors,
  ArrowRight,
  Gift,
  Heart,
  ShieldCheck,
} from "lucide-react";
import {
  AnimatedHeading,
  CrochetNeedleDivider,
} from "@/components/PastelAnimations";
import { ProductCard, ProductRecord } from "@/components/ProductCard";

export function HomeClient({
  featuredProducts,
}: {
  featuredProducts: ProductRecord[];
}) {
  const prefersReduced = useReducedMotion();

  const serviceCards = [
    {
      num: "01",
      title: "Shop Ready-Made Crochet",
      desc: "Discover and purchase handmade crochet bouquets, bags, plushies, accessories, and cozy wearables ready to ship with pastel gift charm.",
      cta: "Shop Ready-Made",
      href: "/shop",
      bg: "from-powder-blue/65 via-vanilla-cream to-baby-pink/45",
      thread: "#BFE3F5",
      motif: "shop",
    },
    {
      num: "02",
      title: "Customize Your Crochet",
      desc: "Choose your own colors, size, design variations, and name personalization. Build your dream yarn palette and place a made-to-order pre-order.",
      cta: "Design Your Crochet",
      href: "/custom-crochet",
      bg: "from-powder-pink/65 via-vanilla-cream to-butter-yellow/50",
      thread: "#F7C6D9",
      motif: "custom",
    },
    {
      num: "03",
      title: "Custom Embroidery on Your Clothes",
      desc: "Send us your clothes, choose an embroidery design, and let us transform your garments. We arrange doorstep pickup and deliver them safely back.",
      cta: "Book Embroidery Pickup",
      href: "/embroidery",
      bg: "from-soft-lavender/75 via-vanilla-cream to-powder-blue/45",
      thread: "#E7DDF7",
      motif: "embroidery",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-10 pb-20 lg:pt-14 lg:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Copy */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-butter-yellow/90 border-2 border-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cocoa shadow-sm">
              <Sparkles className="w-4 h-4 text-cocoa" />
              Candy-Pastel Crochet & Embroidery Studio
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-cocoa leading-[1.08] tracking-tight">
              A Little Loop of{" "}
              <span className="relative inline-block px-2">
                <span className="relative z-10">Happiness!</span>
                <span className="absolute inset-x-0 bottom-1 h-4 bg-powder-pink/75 -rotate-1 rounded-full -z-0" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-cocoa-light font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
              Handmade with love, stitched with imagination. Discover crochet treasures and personalized embroidery made just for you.
            </p>

            {/* 3 Required Hero CTAs with playful yarn-wrap hover */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 bg-powder-pink hover:bg-baby-pink text-cocoa font-display font-bold text-base border-2 border-cocoa/15 shadow-candy transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop Handmade
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/custom-crochet"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 bg-powder-blue hover:bg-powder-blue/85 text-cocoa font-display font-bold text-base border-2 border-cocoa/15 shadow-candy transition"
                >
                  <Palette className="w-4 h-4" />
                  Create Your Own
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/embroidery"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 bg-butter-yellow hover:bg-soft-lavender text-cocoa font-display font-bold text-base border-2 border-cocoa/15 shadow-candy transition"
                >
                  <Scissors className="w-4 h-4" />
                  Custom Embroidery
                </Link>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-bold text-cocoa-light">
              <span className="inline-flex items-center gap-1.5 bg-white/75 rounded-full px-3.5 py-1.5 border border-powder-pink/50">
                <Heart className="w-3.5 h-3.5 fill-powder-pink text-cocoa" /> 100% Hand-Crocheted
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/75 rounded-full px-3.5 py-1.5 border border-powder-blue/60">
                <ShieldCheck className="w-3.5 h-3.5 text-cocoa" /> Doorstep Garment Pickup
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/75 rounded-full px-3.5 py-1.5 border border-soft-lavender">
                ✦ Coupon: STITCH10
              </span>
            </div>
          </motion.div>

          {/* Right Illustrated 3D-Pastel Crochet World */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-5xl bg-gradient-to-br from-powder-blue/55 via-baby-pink/50 to-butter-yellow/55 p-5 sm:p-8 border-4 border-white shadow-candy-lg overflow-hidden">
              <svg
                viewBox="0 0 540 430"
                className="w-full h-auto drop-shadow-sm"
                role="img"
                aria-label="Illustrated pastel crochet world with yarn balls, crochet flowers, handbag, bunny plushie, and cute StitchBerry crochet mascot"
              >
                <defs>
                  <radialGradient id="cloudGrad" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#FFF8ED" />
                    <stop offset="100%" stopColor="#FADCE8" />
                  </radialGradient>
                </defs>

                {/* Pastel Candy Clouds */}
                <ellipse cx="110" cy="85" rx="75" ry="38" fill="url(#cloudGrad)" opacity="0.9" />
                <ellipse cx="425" cy="90" rx="80" ry="42" fill="#FFF8ED" opacity="0.88" />
                <ellipse cx="270" cy="365" rx="220" ry="44" fill="#FFF8ED" opacity="0.85" />

                {/* Animated-feel Yarn Ball Left */}
                <g transform="translate(95, 290)">
                  <circle cx="0" cy="0" r="44" fill="#BFE3F5" stroke="#59434A" strokeWidth="3.5" />
                  <path d="M-28 -16 Q0 -34 28 -16 M-34 2 Q0 -14 34 4 M-26 20 Q0 8 26 22" fill="none" stroke="#59434A" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                {/* Crochet Tote Bag */}
                <g transform="translate(422, 235)">
                  <path d="M-28 -25 C-28 -65 28 -65 28 -25" fill="none" stroke="#59434A" strokeWidth="6" strokeLinecap="round" />
                  <rect x="-48" y="-25" width="96" height="86" rx="20" fill="#FFF8ED" stroke="#59434A" strokeWidth="3.5" />
                  <rect x="-34" y="-11" width="30" height="30" rx="8" fill="#F7C6D9" stroke="#59434A" strokeWidth="2" />
                  <rect x="4" y="-11" width="30" height="30" rx="8" fill="#BFE3F5" stroke="#59434A" strokeWidth="2" />
                  <circle cx="-19" cy="4" r="6" fill="#FFF0B8" />
                  <circle cx="19" cy="4" r="6" fill="#E7DDF7" />
                </g>

                {/* Cute Crochet Mascot Character in Center */}
                <g transform="translate(265, 210)">
                  {/* Pom-pom bunny/berry ears */}
                  <circle cx="-36" cy="-76" r="22" fill="#F7C6D9" stroke="#59434A" strokeWidth="3.5" />
                  <circle cx="36" cy="-76" r="22" fill="#BFE3F5" stroke="#59434A" strokeWidth="3.5" />
                  {/* Head & yarn texture */}
                  <circle cx="0" cy="-14" r="68" fill="#FFF8ED" stroke="#59434A" strokeWidth="4" />
                  <path d="M-46 -42 Q0 -62 46 -42" fill="none" stroke="#F7C6D9" strokeWidth="5" strokeLinecap="round" />
                  {/* Sweet face */}
                  <circle cx="-22" cy="-16" r="6" fill="#59434A" />
                  <circle cx="22" cy="-16" r="6" fill="#59434A" />
                  <circle cx="-24" cy="-18" r="2" fill="#FFF8ED" />
                  <circle cx="20" cy="-18" r="2" fill="#FFF8ED" />
                  <ellipse cx="-34" cy="-2" rx="10" ry="6" fill="#F7C6D9" />
                  <ellipse cx="34" cy="-2" rx="10" ry="6" fill="#F7C6D9" />
                  <path d="M-8 -4 Q0 6 8 -4" fill="none" stroke="#59434A" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Body holding tiny crochet hook */}
                  <ellipse cx="0" cy="82" rx="54" ry="48" fill="#FADCE8" stroke="#59434A" strokeWidth="4" />
                  <circle cx="0" cy="76" r="18" fill="#FFF0B8" stroke="#59434A" strokeWidth="2.5" />
                  {/* Crochet hook */}
                  <line x1="48" y1="74" x2="102" y2="28" stroke="#59434A" strokeWidth="5" strokeLinecap="round" />
                  <path d="M102 28 C108 22 100 14 94 20" fill="none" stroke="#59434A" strokeWidth="4" strokeLinecap="round" />
                </g>

                {/* Crochet Flowers Left & Top */}
                <g transform="translate(115, 145)">
                  <circle cx="0" cy="-20" r="14" fill="#F7C6D9" stroke="#59434A" strokeWidth="2.5" />
                  <circle cx="19" cy="-6" r="14" fill="#F7C6D9" stroke="#59434A" strokeWidth="2.5" />
                  <circle cx="12" cy="16" r="14" fill="#F7C6D9" stroke="#59434A" strokeWidth="2.5" />
                  <circle cx="-12" cy="16" r="14" fill="#F7C6D9" stroke="#59434A" strokeWidth="2.5" />
                  <circle cx="-19" cy="-6" r="14" fill="#F7C6D9" stroke="#59434A" strokeWidth="2.5" />
                  <circle cx="0" cy="0" r="12" fill="#FFF0B8" stroke="#59434A" strokeWidth="2.5" />
                </g>

                {/* Plushie Bunny */}
                <g transform="translate(175, 310)">
                  <ellipse cx="-14" cy="-34" rx="8" ry="20" fill="#FFF8ED" stroke="#59434A" strokeWidth="2.5" />
                  <ellipse cx="14" cy="-34" rx="8" ry="20" fill="#FFF8ED" stroke="#59434A" strokeWidth="2.5" />
                  <circle cx="0" cy="-6" r="24" fill="#E7DDF7" stroke="#59434A" strokeWidth="2.5" />
                  <circle cx="-7" cy="-8" r="2.5" fill="#59434A" />
                  <circle cx="7" cy="-8" r="2.5" fill="#59434A" />
                  <path d="M-3 -2 Q0 2 3 -2" stroke="#59434A" strokeWidth="2" fill="none" />
                </g>

                {/* Flowing Hero Wool Thread leading downward */}
                <motion.path
                  d="M 45 45 C 120 120, 40 240, 140 340 C 230 420, 360 360, 480 420"
                  fill="none"
                  stroke="#59434A"
                  strokeOpacity="0.35"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Animated wool thread leading visitor down to Section 2 */}
        <div className="flex justify-center mt-8">
          <motion.svg
            width="90"
            height="72"
            viewBox="0 0 90 72"
            animate={prefersReduced ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <motion.path
              d="M45 2 C65 18, 25 36, 45 54 L45 66"
              fill="none"
              stroke="#59434A"
              strokeWidth="2.8"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            <path
              d="M36 58 L45 68 L54 58"
              fill="none"
              stroke="#59434A"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </div>
      </section>

      {/* SECTION 2: EXPLORE WHAT WE CREATE */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <AnimatedHeading
          eyebrow="Three Ways To Love Handmade"
          title="Explore What We Create"
          subtitle="Whether you want a ready-made pastel treasure, a custom crochet creation in your palette, or intricate hand-embroidery on your own favorite outfit."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mt-12">
          {serviceCards.map((card, idx) => (
            <motion.div
              key={card.num}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              whileHover={prefersReduced ? undefined : { y: -8 }}
              className={`stitch-card rounded-5xl p-7 bg-gradient-to-br ${card.bg} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-4xl font-bold text-cocoa/35">
                    {card.num}
                  </span>
                  <svg width="72" height="24" viewBox="0 0 72 24">
                    <path
                      d="M4 12 Q20 2 36 12 T68 12"
                      fill="none"
                      stroke="#59434A"
                      strokeOpacity="0.35"
                      strokeWidth="2.5"
                      strokeDasharray="5 4"
                    />
                    <circle cx="66" cy="12" r="5" fill={card.thread} stroke="#59434A" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* Unique Card Illustration */}
                <div className="h-36 rounded-3xl bg-white/75 border border-white flex items-center justify-center mb-5 p-4">
                  {card.motif === "shop" && (
                    <svg viewBox="0 0 180 110" className="w-40 h-28">
                      <circle cx="52" cy="60" r="28" fill="#BFE3F5" stroke="#59434A" strokeWidth="2.5" />
                      <circle cx="122" cy="56" r="24" fill="#F7C6D9" stroke="#59434A" strokeWidth="2.5" />
                      <circle cx="88" cy="36" r="20" fill="#FFF0B8" stroke="#59434A" strokeWidth="2.5" />
                      <path d="M36 55 Q52 44 68 55 M108 52 Q122 42 136 52" stroke="#59434A" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                  {card.motif === "custom" && (
                    <svg viewBox="0 0 180 110" className="w-40 h-28">
                      <circle cx="42" cy="54" r="18" fill="#F7C6D9" stroke="#59434A" strokeWidth="2.5" />
                      <circle cx="76" cy="40" r="18" fill="#BFE3F5" stroke="#59434A" strokeWidth="2.5" />
                      <circle cx="110" cy="54" r="18" fill="#FFF0B8" stroke="#59434A" strokeWidth="2.5" />
                      <circle cx="142" cy="42" r="16" fill="#E7DDF7" stroke="#59434A" strokeWidth="2.5" />
                      <path d="M30 85 Q90 66 152 85" stroke="#59434A" strokeWidth="2.5" strokeDasharray="5 4" fill="none" />
                    </svg>
                  )}
                  {card.motif === "embroidery" && (
                    <svg viewBox="0 0 180 110" className="w-40 h-28">
                      <circle cx="90" cy="55" r="38" fill="#FFF8ED" stroke="#59434A" strokeWidth="4" />
                      <circle cx="90" cy="55" r="30" fill="none" stroke="#F7C6D9" strokeWidth="2" strokeDasharray="4 4" />
                      <circle cx="90" cy="44" r="8" fill="#F7C6D9" stroke="#59434A" strokeWidth="2" />
                      <circle cx="78" cy="58" r="8" fill="#BFE3F5" stroke="#59434A" strokeWidth="2" />
                      <circle cx="102" cy="58" r="8" fill="#FFF0B8" stroke="#59434A" strokeWidth="2" />
                      <line x1="118" y1="26" x2="152" y2="10" stroke="#59434A" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <h3 className="font-display text-2xl font-bold text-cocoa">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-sm text-cocoa-light font-semibold leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={card.href}
                  className="inline-flex items-center justify-between w-full rounded-full px-5 py-3 bg-cocoa text-vanilla-cream font-bold text-sm hover:bg-cocoa-dark transition group"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <CrochetNeedleDivider />

      {/* FEATURED PRODUCTS */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <AnimatedHeading
            eyebrow="Fresh Off The Hook"
            title="Sweet Ready-Made Favorites"
            centered={false}
          />
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-powder-pink/80 hover:bg-powder-pink text-cocoa font-bold text-sm border border-cocoa/15 self-start md:self-auto transition"
          >
            View All 9 Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <CrochetNeedleDivider flip />

      {/* CREATIVE PLAYGROUND & GIFT CORNER BANNERS */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-7">
        <div className="stitch-card rounded-5xl p-8 bg-gradient-to-br from-powder-blue/60 via-vanilla-cream to-soft-lavender/65 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3.5 py-1 text-xs font-bold text-cocoa">
              <Palette className="w-3.5 h-3.5" /> Interactive Color Lab
            </span>
            <h3 className="font-display text-3xl font-bold text-cocoa">
              Yarn Color Studio
            </h3>
            <p className="text-sm font-semibold text-cocoa-light leading-relaxed">
              Mix & match 14 ice-cream yarn shades, preview a live crochet stitch swatch, save palettes to your account, or send your combo straight into a custom pre-order!
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#F7C6D9", "#BFE3F5", "#FFF0B8", "#E7DDF7", "#CBEFD9"].map((hex) => (
                <span
                  key={hex}
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <Link
              href="/studio"
              className="ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-cocoa text-vanilla-cream font-bold text-sm hover:scale-105 transition"
            >
              Open Studio <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="stitch-card rounded-5xl p-8 bg-gradient-to-br from-baby-pink/75 via-vanilla-cream to-butter-yellow/60 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3.5 py-1 text-xs font-bold text-cocoa">
              <Gift className="w-3.5 h-3.5" /> Gift Corner & Custom Keepsakes
            </span>
            <h3 className="font-display text-3xl font-bold text-cocoa">
              Wrap Happiness in Pastel
            </h3>
            <p className="text-sm font-semibold text-cocoa-light leading-relaxed">
              Add satin gift wrapping and handwritten notes to any order, or pitch a brand-new custom crochet gift idea with a reference photo!
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/gifts"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-powder-pink border border-cocoa/15 text-cocoa font-bold text-sm hover:scale-105 transition"
            >
              Explore Gift Corner
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-white/85 border border-cocoa/15 text-cocoa font-bold text-sm hover:bg-powder-blue/40 transition"
            >
              Customer Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
