"use client";

import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("Hi StitchBerry! I need help with an order.");
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";

  const quickTopics = [
    "Help me pick yarn colors for a custom crochet pre-order",
    "I want to book custom embroidery pickup for my outfit",
    "Can you check my order / pre-order status?",
  ];

  const openWhatsApp = (text: string) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            className="mb-3 w-80 rounded-4xl bg-vanilla-cream border-2 border-powder-pink shadow-candy-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-powder-pink to-powder-blue px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-cocoa">
                  StitchBerry Concierge
                </p>
                <p className="text-xs font-semibold text-cocoa/80">
                  Replies quickly on WhatsApp
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full bg-white/70 text-cocoa"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-cocoa-light">
                Tap a quick question:
              </p>
              {quickTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => openWhatsApp(topic)}
                  className="w-full text-left text-xs font-semibold p-2.5 rounded-2xl bg-baby-pink/55 hover:bg-powder-blue/50 text-cocoa border border-cocoa/10 transition"
                >
                  {topic}
                </button>
              ))}
              <div className="pt-2 flex gap-2">
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="flex-1 rounded-full px-3.5 py-2 text-xs bg-white border border-cocoa/15 text-cocoa focus:outline-none focus:border-powder-pink"
                  placeholder="Write your message..."
                />
                <button
                  type="button"
                  onClick={() => openWhatsApp(msg)}
                  className="p-2.5 rounded-full bg-cocoa text-vanilla-cream hover:scale-105 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="WhatsApp Support"
        className="flex items-center gap-2 rounded-full pl-4 pr-5 py-3 bg-gradient-to-r from-powder-pink via-butter-yellow to-powder-blue border-2 border-white shadow-candy-lg text-cocoa font-display font-bold text-sm"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">WhatsApp Help</span>
      </motion.button>
    </div>
  );
}
