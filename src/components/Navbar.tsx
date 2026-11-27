"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreContext";

const NAV_LINKS = [
  { href: "/shop", label: "Shop Crochet" },
  { href: "/custom-crochet", label: "Custom Crochet" },
  { href: "/embroidery", label: "Custom Embroidery" },
  { href: "/studio", label: "Yarn Studio" },
  { href: "/gifts", label: "Gift Corner" },
  { href: "/track", label: "Track Order" },
];

export function Navbar() {
  const pathname = usePathname();
  const {
    user,
    cartCount,
    setCartOpen,
    wishlistIds,
    yarnCursorEnabled,
    setYarnCursorEnabled,
  } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-vanilla-cream/85 border-b-2 border-powder-pink/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Mascot Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.06 }}
            transition={{ duration: 0.45 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-powder-pink to-powder-blue p-1.5 border-2 border-cocoa/15 shadow-sm flex items-center justify-center"
          >
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle
                cx="20"
                cy="21"
                r="14"
                fill="#FFF8ED"
                stroke="#59434A"
                strokeWidth="2.4"
              />
              <path
                d="M11 17 Q20 11 29 17 M10 23 Q20 18 30 23"
                fill="none"
                stroke="#F7C6D9"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="15.5" cy="19" r="1.7" fill="#59434A" />
              <circle cx="24.5" cy="19" r="1.7" fill="#59434A" />
              <path
                d="M17.5 23 Q20 26 22.5 23"
                fill="none"
                stroke="#59434A"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M27 8 L33 4"
                stroke="#59434A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          <div>
            <span className="font-display text-2xl font-bold tracking-tight text-cocoa block leading-none">
              StitchBerry
            </span>
            <span className="font-hand text-sm text-cocoa-light leading-none">
              pastel crochet & embroidery
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all ${
                  active
                    ? "bg-powder-pink/70 text-cocoa shadow-sm border border-cocoa/10"
                    : "text-cocoa/85 hover:bg-powder-blue/40 hover:text-cocoa"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setYarnCursorEnabled(!yarnCursorEnabled)}
            title="Toggle custom yarn ball cursor"
            className="hidden xl:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-soft-lavender/70 hover:bg-soft-lavender text-cocoa border border-cocoa/10 transition"
          >
            <Palette className="w-3.5 h-3.5" />
            {yarnCursorEnabled ? "Yarn Cursor: On" : "Yarn Cursor: Off"}
          </button>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold bg-butter-yellow border border-cocoa/15 text-cocoa hover:scale-105 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}

          <Link
            href="/account?tab=wishlist"
            aria-label="Wishlist"
            className="relative p-2.5 rounded-full bg-baby-pink/70 hover:bg-powder-pink text-cocoa transition hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cocoa text-vanilla-cream text-[10px] font-bold flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label="Open shopping basket"
            className="relative p-2.5 rounded-full bg-powder-blue/80 hover:bg-powder-blue text-cocoa transition hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cocoa text-vanilla-cream text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            href={user ? "/account" : "/login"}
            className="hidden sm:inline-flex items-center gap-2 rounded-full pl-2.5 pr-4 py-1.5 bg-vanilla-cream border-2 border-powder-pink/70 hover:border-powder-blue text-sm font-bold text-cocoa shadow-sm transition"
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-cocoa/15"
              style={{ backgroundColor: user?.avatarColor || "#FADCE8" }}
            >
              {user ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </span>
            <span>{user ? user.name.split(" ")[0] : "Sign In"}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden p-2.5 rounded-full bg-soft-lavender text-cocoa"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-powder-pink/40 bg-vanilla-cream/95 px-5 py-4 space-y-2 overflow-hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-2xl text-sm font-bold text-cocoa hover:bg-baby-pink/70"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-cocoa/10 flex flex-wrap gap-2">
              <Link
                href="/story"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-1.5 rounded-full bg-soft-lavender text-xs font-bold text-cocoa"
              >
                Handmade Story
              </Link>
              <Link
                href="/gallery"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-1.5 rounded-full bg-butter-yellow text-xs font-bold text-cocoa"
              >
                Customer Gallery
              </Link>
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-1.5 rounded-full bg-powder-pink text-xs font-bold text-cocoa flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {user ? "My Dashboard" : "Sign In / Join"}
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-1.5 rounded-full bg-powder-blue text-xs font-bold text-cocoa"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
