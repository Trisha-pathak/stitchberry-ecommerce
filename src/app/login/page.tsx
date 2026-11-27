"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, LogIn } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, notify } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed.");
      } else {
        await refreshUser();
        notify(`Welcome back, ${data.user.name}!`, "pink");
        router.push(data.user.role === "ADMIN" ? "/admin" : "/account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="stitch-card rounded-5xl p-8 bg-vanilla-cream space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-powder-pink/70 px-3.5 py-1 text-xs font-bold text-cocoa">
            <Sparkles className="w-3.5 h-3.5" /> StitchBerry Studio
          </span>
          <h1 className="font-display text-3xl font-bold text-cocoa">
            Welcome Back!
          </h1>
          <p className="text-xs font-semibold text-cocoa-light">
            Track your crochet pre-orders, embroidery pickups & saved palettes.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl bg-powder-pink/70 border border-cocoa/20 px-4 py-2.5 text-xs font-bold text-cocoa">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-cocoa-light block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya@stitchberry.in"
              className="w-full rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-cocoa-light block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3.5 bg-cocoa text-vanilla-cream font-display font-bold flex items-center justify-center gap-2 hover:bg-cocoa-dark transition disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-dashed border-cocoa/15 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cocoa-light text-center">
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("ananya@stitchberry.in");
                setPassword("pastel123");
              }}
              className="rounded-full py-2 px-3 bg-powder-blue/70 hover:bg-powder-blue text-xs font-bold text-cocoa"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@stitchberry.in");
                setPassword("admin123");
              }}
              className="rounded-full py-2 px-3 bg-butter-yellow hover:bg-powder-pink text-xs font-bold text-cocoa"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <p className="text-center text-xs font-semibold text-cocoa-light">
          New to StitchBerry?{" "}
          <Link href="/register" className="text-cocoa font-bold underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
