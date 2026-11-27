"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Gift, CreditCard, Tag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { COUPONS, formatINR } from "@/lib/constants";
import { AnimatedHeading } from "@/components/PastelAnimations";

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, cartSubtotal, clearCart, user, notify } = useStore();

  const [couponCode, setCouponCode] = useState(
    (searchParams.get("coupon") || "").toUpperCase()
  );
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "UPI" | "COD">(
    "RAZORPAY"
  );
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerName((p) => p || user.name);
      setCustomerEmail((p) => p || user.email);
      setCustomerPhone((p) => p || user.phone);
    }
  }, [user]);

  const couponObj = COUPONS[couponCode.trim().toUpperCase()];
  const discount =
    couponObj?.type === "percent"
      ? Math.round((cartSubtotal * couponObj.value) / 100)
      : 0;
  const shipping =
    cartSubtotal === 0
      ? 0
      : couponObj?.type === "shipping" || cartSubtotal >= 1999
      ? 0
      : 79;
  const tax = Math.round(Math.max(0, cartSubtotal - discount) * 0.05);
  const total = Math.max(0, cartSubtotal - discount) + shipping + tax;

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      notify("Your cart is empty!", "pink");
      return;
    }
    setSubmitting(true);
    try {
      let rzpOrderId = "";
      if (paymentMethod !== "COD") {
        const payRes = await fetch("/api/payments/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, receipt: `ord_${Date.now()}` }),
        });
        const payData = await payRes.json();
        rzpOrderId = payData.order?.id || "";
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          address: { line1, city, state: stateName, pincode },
          items: cart,
          couponCode: couponObj ? couponCode.trim().toUpperCase() : "",
          paymentMethod,
          razorpayOrderId: rzpOrderId,
          giftWrap,
          giftNote,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        notify(`Order ${data.order.orderNumber} confirmed!`, "butter");
        router.push(`/orders/${data.order.id}`);
      } else {
        notify(data.error || "Checkout failed.", "pink");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading
        eyebrow="Ready-Made Order Checkout"
        title="Complete Your Basket"
        subtitle="Safe Indian payments via Razorpay (UPI, Cards, NetBanking) or Cash on Delivery."
      />

      <form
        onSubmit={submitOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div className="lg:col-span-7 space-y-6">
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-4">
            <h2 className="font-display text-2xl font-bold text-cocoa">
              1. Delivery Address & Contact
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                required
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Mobile Number"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
            </div>
            <input
              required
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="House / Flat / Street / Landmark"
              className="w-full rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                required
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="State"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
              <input
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                className="rounded-full px-4 py-2.5 text-sm bg-vanilla-cream border border-cocoa/15"
              />
            </div>
          </div>

          {/* Gift Wrap */}
          <div className="stitch-card rounded-4xl p-6 bg-baby-pink/40 space-y-3">
            <label className="flex items-center gap-2.5 font-display text-lg font-bold text-cocoa cursor-pointer">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(e) => setGiftWrap(e.target.checked)}
              />
              <Gift className="w-5 h-5" /> Add Complimentary Pastel Gift Wrap & Note
            </label>
            {giftWrap && (
              <textarea
                rows={2}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Write a sweet message for our handwritten card..."
                className="w-full rounded-3xl p-3.5 text-sm bg-white border border-cocoa/15"
              />
            )}
          </div>

          {/* Payment Methods */}
          <div className="stitch-card rounded-4xl p-6 bg-white/85 space-y-3">
            <h2 className="font-display text-2xl font-bold text-cocoa flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> 2. Payment Method (India)
            </h2>
            {[
              {
                id: "RAZORPAY" as const,
                title: "Razorpay (Cards, UPI, Wallets, NetBanking)",
                sub: "Instant payment confirmation",
              },
              {
                id: "UPI" as const,
                title: "Direct UPI (GPay / PhonePe / Paytm)",
                sub: "Zero convenience fee",
              },
              {
                id: "COD" as const,
                title: "Cash on Delivery (Ready-Made Only)",
                sub: "Pay at your doorstep",
              },
            ].map((m) => (
              <label
                key={m.id}
                className={`flex items-center gap-3 p-3.5 rounded-3xl border-2 cursor-pointer transition ${
                  paymentMethod === m.id
                    ? "border-cocoa bg-powder-blue/35"
                    : "border-cocoa/10 bg-vanilla-cream"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === m.id}
                  onChange={() => setPaymentMethod(m.id)}
                />
                <div>
                  <p className="font-bold text-sm text-cocoa">{m.title}</p>
                  <p className="text-xs text-cocoa-light">{m.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-5 stitch-card rounded-5xl p-6 bg-gradient-to-br from-powder-pink/45 via-vanilla-cream to-powder-blue/45 space-y-4">
          <h2 className="font-display text-2xl font-bold text-cocoa">
            Order Summary ({cart.length} items)
          </h2>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-xs font-semibold bg-white/80 rounded-2xl p-2.5"
              >
                <span>
                  {item.name} × {item.quantity}{" "}
                  <span className="text-cocoa-light">({item.color})</span>
                </span>
                <span className="font-bold">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="relative">
            <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-light" />
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon: STITCH10 / PASTEL15 / FREESHIP"
              className="w-full rounded-full pl-9 pr-4 py-2.5 text-xs bg-white border border-cocoa/15 font-bold uppercase"
            />
          </div>

          <div className="space-y-1.5 text-sm font-semibold">
            <div className="flex justify-between">
              <span className="text-cocoa-light">Subtotal</span>
              <span>{formatINR(cartSubtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({couponCode.toUpperCase()})</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-cocoa-light">Shipping</span>
              <span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cocoa-light">GST (5%)</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="pt-2 border-t border-dashed border-cocoa/15 flex justify-between items-baseline">
              <span className="font-display text-lg font-bold">Total</span>
              <span className="font-display text-3xl font-bold">
                {formatINR(total)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || cart.length === 0}
            className="w-full rounded-full py-4 bg-cocoa text-vanilla-cream font-display font-bold text-base hover:bg-cocoa-dark transition shadow-candy disabled:opacity-50"
          >
            {submitting ? "Processing..." : `Place Order • ${formatINR(total)}`}
          </button>
          <p className="text-[11px] font-semibold text-cocoa-light flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Downloadable invoice generated immediately
          </p>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-display text-xl">Loading checkout...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
