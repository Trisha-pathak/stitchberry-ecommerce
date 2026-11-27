"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { AnimatedHeading } from "@/components/PastelAnimations";
import { useStore } from "@/context/StoreContext";

export default function ContactPage() {
  const { notify } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (res.ok) {
      setSent(true);
      notify("Message received! We'll reply shortly.", "butter");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading
        eyebrow="Say Hello"
        title="Contact StitchBerry"
        subtitle="Questions about custom yarn shades, bulk bridesmaid hampers, or garment pickup slots? Write to us!"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 stitch-card rounded-4xl p-6 bg-powder-blue/45 space-y-4">
          <h2 className="font-display text-2xl font-bold text-cocoa">Studio Desk</h2>
          <p className="text-xs font-semibold text-cocoa flex items-center gap-2">
            <Mail className="w-4 h-4" /> hello@stitchberry.in
          </p>
          <p className="text-xs font-semibold text-cocoa flex items-center gap-2">
            <Phone className="w-4 h-4" /> +91 98765 43210 (Mon–Sat, 10 AM–7 PM)
          </p>
          <p className="text-xs font-semibold text-cocoa flex items-center gap-2">
            <MapPin className="w-4 h-4" /> 14th Road, Bandra West, Mumbai 400050
          </p>
        </div>

        <div className="md:col-span-7 stitch-card rounded-4xl p-6 bg-white/90">
          {sent ? (
            <p className="font-display text-xl font-bold text-cocoa py-8 text-center">
              Thank you! Your message is in our studio inbox.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15" />
              </div>
              <input required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15" />
              <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message..." className="w-full rounded-3xl p-4 text-sm bg-vanilla-cream border border-cocoa/15" />
              <button type="submit" className="rounded-full px-6 py-3 bg-cocoa text-vanilla-cream font-bold text-sm inline-flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
