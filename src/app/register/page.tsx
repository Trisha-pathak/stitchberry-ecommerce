"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser, notify } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        await refreshUser();
        notify("Welcome to the StitchBerry family!", "butter");
        router.push("/account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="stitch-card rounded-5xl p-8 bg-vanilla-cream space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-bold text-cocoa">
            Join StitchBerry
          </h1>
          <p className="text-xs font-semibold text-cocoa-light">
            Save yarn palettes, track embroidery pickups & collect sweet coupons.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl bg-powder-pink/70 border border-cocoa/20 px-4 py-2.5 text-xs font-bold text-cocoa">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3.5">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile Number (+91 ...)"
            className="w-full rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
          />
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="w-full rounded-full px-4 py-3 text-sm bg-white border border-cocoa/15"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3.5 bg-cocoa text-vanilla-cream font-display font-bold flex items-center justify-center gap-2 hover:bg-cocoa-dark transition disabled:opacity-60"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-cocoa-light">
          Already have an account?{" "}
          <Link href="/login" className="text-cocoa font-bold underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
