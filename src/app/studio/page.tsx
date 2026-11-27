"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Palette, BookmarkPlus, ArrowRight, RefreshCw, Check } from "lucide-react";
import { YARN_PALETTE } from "@/lib/constants";
import { AnimatedHeading } from "@/components/PastelAnimations";
import { useStore } from "@/context/StoreContext";

const PRESETS = [
  {
    name: "Cotton Candy Clouds",
    colors: ["Powder Pink", "Powder Blue", "Vanilla Cream", "Soft Lavender"],
  },
  {
    name: "Lemon Sorbet Picnic",
    colors: ["Butter Yellow", "Mint Sorbet", "Baby Pink", "Vanilla Cream"],
  },
  {
    name: "Berry Gelato",
    colors: ["Berry Rose", "Powder Pink", "Peach Gelato", "Dark Cocoa"],
  },
];

export default function YarnStudioPage() {
  const router = useRouter();
  const { user, notify } = useStore();
  const [title, setTitle] = useState("My Dream Pastel Mix");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<{ name: string; hex: string }[]>([
    YARN_PALETTE[0],
    YARN_PALETTE[3],
    YARN_PALETTE[8],
    YARN_PALETTE[7],
  ]);
  const [saving, setSaving] = useState(false);

  const toggleShade = (swatch: { name: string; hex: string }) => {
    setSelected((prev) => {
      const exists = prev.some((s) => s.name === swatch.name);
      if (exists) return prev.length > 2 ? prev.filter((s) => s.name !== swatch.name) : prev;
      return prev.length >= 5 ? [...prev.slice(1), swatch] : [...prev, swatch];
    });
  };

  const applyPreset = (names: string[], label: string) => {
    const matched = names
      .map((n) => YARN_PALETTE.find((y) => y.name === n))
      .filter(Boolean) as { name: string; hex: string }[];
    if (matched.length) {
      setSelected(matched);
      setTitle(label);
    }
  };

  const shufflePalette = () => {
    const shuffled = [...YARN_PALETTE].sort(() => Math.random() - 0.5).slice(0, 4);
    setSelected(shuffled);
  };

  const saveDesign = async () => {
    if (!user) {
      notify("Sign in first to save yarn palettes to your dashboard!", "blue");
      router.push("/login");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-design",
          title,
          designType: "Yarn Palette",
          colors: selected,
          notes,
        }),
      });
      if (res.ok) {
        notify("Palette saved to My Saved Designs!", "butter");
      }
    } finally {
      setSaving(false);
    }
  };

  const sendToPreOrder = () => {
    localStorage.setItem("stitchberry_studio_palette", JSON.stringify(selected));
    router.push("/custom-crochet");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading
        eyebrow="Creative Feature A • Color Playground"
        title="Yarn Color Studio"
        subtitle="Combine 2 to 5 silky cotton yarn shades, preview how they weave into a granny square and striped scarf, save palettes, or launch a custom crochet order."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Swatches & Controls */}
        <div className="lg:col-span-6 stitch-card rounded-5xl p-6 sm:p-8 bg-white/85 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-cocoa flex items-center gap-2">
              <Palette className="w-6 h-6" /> Pick 2–5 Yarn Shades
            </h2>
            <button
              type="button"
              onClick={shufflePalette}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-butter-yellow text-xs font-bold text-cocoa hover:scale-105 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Surprise Me
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p.colors, p.name)}
                className="px-3.5 py-1.5 rounded-full bg-soft-lavender/70 hover:bg-soft-lavender text-xs font-bold text-cocoa"
              >
                ✦ {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {YARN_PALETTE.map((sw) => {
              const active = selected.some((s) => s.name === sw.name);
              return (
                <button
                  key={sw.name}
                  type="button"
                  onClick={() => toggleShade(sw)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-2xl border-2 text-left transition ${
                    active
                      ? "border-cocoa bg-baby-pink/45 scale-[1.02]"
                      : "border-cocoa/10 bg-vanilla-cream"
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-cocoa/20 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: sw.hex }}
                  >
                    {active && <Check className="w-3.5 h-3.5 text-cocoa" />}
                  </span>
                  <span className="text-xs font-bold text-cocoa">{sw.name}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-2 border-t border-dashed border-cocoa/15">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your yarn combination"
              className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15 font-bold"
            />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (e.g. For birthday tulip bouquet or cardigan)"
              className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={saveDesign}
                disabled={saving}
                className="flex-1 rounded-full py-3 px-5 bg-powder-pink text-cocoa font-bold text-sm border border-cocoa/15 flex items-center justify-center gap-2 hover:scale-[1.02] transition"
              >
                <BookmarkPlus className="w-4 h-4" />
                {saving ? "Saving..." : "Save Palette"}
              </button>
              <button
                type="button"
                onClick={sendToPreOrder}
                className="flex-1 rounded-full py-3 px-5 bg-cocoa text-vanilla-cream font-bold text-sm flex items-center justify-center gap-2 hover:bg-cocoa-dark transition"
              >
                Use in Custom Pre-Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Crochet Swatch & Striped Scarf Preview */}
        <div className="lg:col-span-6 stitch-card rounded-5xl p-7 bg-gradient-to-br from-powder-blue/45 via-vanilla-cream to-baby-pink/45 space-y-6">
          <h3 className="font-display text-2xl font-bold text-cocoa">
            Live Crochet Stitch Preview: {title}
          </h3>

          <motion.div
            key={selected.map((s) => s.hex).join("-")}
            initial={{ opacity: 0.75, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Granny Square Swatch */}
            <div className="rounded-4xl bg-white/85 p-5 border-2 border-white flex flex-col items-center">
              <p className="text-xs font-bold text-cocoa-light mb-3">
                Granny Square Motif
              </p>
              <svg viewBox="0 0 180 180" className="w-40 h-40">
                <rect x="10" y="10" width="160" height="160" rx="22" fill={selected[0]?.hex} stroke="#59434A" strokeWidth="3" />
                <rect x="30" y="30" width="120" height="120" rx="18" fill={selected[1]?.hex || selected[0]?.hex} stroke="#59434A" strokeWidth="2.5" strokeDasharray="5 4" />
                <rect x="52" y="52" width="76" height="76" rx="14" fill={selected[2]?.hex || selected[0]?.hex} stroke="#59434A" strokeWidth="2.5" />
                <circle cx="90" cy="90" r="22" fill={selected[3]?.hex || selected[1]?.hex} stroke="#59434A" strokeWidth="2.5" />
              </svg>
            </div>

            {/* Striped Blanket / Scarf Swatch */}
            <div className="rounded-4xl bg-white/85 p-5 border-2 border-white flex flex-col items-center">
              <p className="text-xs font-bold text-cocoa-light mb-3">
                Striped Knit & Loop Texture
              </p>
              <div className="w-full h-40 rounded-3xl overflow-hidden border-2 border-cocoa/20 flex flex-col">
                {selected.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex items-center justify-center text-[11px] font-bold text-cocoa/80 border-b border-dashed border-cocoa/15 last:border-b-0"
                    style={{ backgroundColor: c.hex }}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
