"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, CheckCircle2, Camera } from "lucide-react";
import {
  PREORDER_STATUSES,
  EMBROIDERY_STATUSES,
  formatINR,
  safeJsonParse,
} from "@/lib/constants";
import { AnimatedHeading } from "@/components/PastelAnimations";

function TrackInner() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "SB-EMB-3012");
  const [result, setResult] = useState<{
    type: "ORDER" | "PREORDER" | "EMBROIDERY";
    record: Record<string, unknown>;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lookup = async (targetCode: string) => {
    if (!targetCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/track?code=${encodeURIComponent(targetCode.trim())}`
      );
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setResult(null);
        setError(data.error || "Not found.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) lookup(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rec = result?.record || {};
  const stages =
    result?.type === "PREORDER"
      ? [...PREORDER_STATUSES]
      : result?.type === "EMBROIDERY"
      ? [...EMBROIDERY_STATUSES]
      : ["Confirmed", "Packed with Care", "Shipped", "Delivered"];

  const currentIdx = stages.indexOf(String(rec.status || ""));
  const conditionPhotos = safeJsonParse<string[]>(
    String(rec.garmentConditionPhotosJson || "[]"),
    []
  );
  const completedPhotos = safeJsonParse<string[]>(
    String(rec.completedWorkPhotosJson || "[]"),
    []
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <AnimatedHeading
        eyebrow="Live Studio Tracker"
        title="Track Your Order"
        subtitle="Enter any Ready-Made Order (SB-ORD-xxxx), Custom Pre-Order (SB-PRE-xxxx), or Embroidery Booking (SB-EMB-xxxx)."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(code);
        }}
        className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-cocoa-light" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SB-ORD-1001, SB-PRE-2041, SB-EMB-3012"
            className="w-full rounded-full pl-11 pr-4 py-3.5 text-sm bg-white border-2 border-powder-pink font-bold uppercase text-cocoa"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full px-7 py-3.5 bg-cocoa text-vanilla-cream font-display font-bold hover:bg-cocoa-dark transition"
        >
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2 text-xs font-bold">
        {["SB-ORD-1001", "SB-PRE-2041", "SB-EMB-3012"].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => {
              setCode(sample);
              lookup(sample);
            }}
            className="px-3.5 py-1.5 rounded-full bg-butter-yellow/80 hover:bg-butter-yellow text-cocoa border border-cocoa/10"
          >
            Try {sample}
          </button>
        ))}
      </div>

      {error && (
        <div className="stitch-card rounded-4xl p-6 text-center text-sm font-bold text-cocoa bg-powder-pink/40">
          {error}
        </div>
      )}

      {result && (
        <div className="stitch-card rounded-5xl p-7 sm:p-9 bg-white/90 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-cocoa/15 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider bg-powder-blue/70 px-3 py-1 rounded-full text-cocoa">
                {result.type === "ORDER"
                  ? "Ready-Made Order"
                  : result.type === "PREORDER"
                  ? "Custom Crochet Pre-Order"
                  : "Custom Embroidery Service"}
              </span>
              <h2 className="font-display text-2xl font-bold text-cocoa mt-2">
                {String(
                  rec.orderNumber || rec.preOrderNumber || rec.bookingNumber
                )}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-cocoa-light">Current Stage</p>
              <p className="font-display text-xl font-bold text-cocoa">
                {String(rec.status)}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {stages.map((st, idx) => {
              const done = currentIdx >= idx;
              return (
                <div
                  key={st}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                    done
                      ? "bg-powder-pink/55 border-cocoa/25 text-cocoa"
                      : "bg-vanilla-cream/70 border-cocoa/10 text-cocoa-light"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      done ? "text-cocoa" : "text-cocoa/25"
                    }`}
                  />
                  <span>{st}</span>
                </div>
              );
            })}
          </div>

          {result.type === "EMBROIDERY" && (
            <div className="rounded-3xl bg-powder-blue/30 p-5 space-y-3 border border-powder-blue">
              <p className="font-display font-bold text-cocoa flex items-center gap-2">
                <Camera className="w-4 h-4" /> Pickup & Garment Inspection Record
              </p>
              {Boolean(rec.pickupPersonName) && (
                <p className="text-xs font-semibold text-cocoa">
                  Pickup Assigned: <strong>{String(rec.pickupPersonName)}</strong> (
                  {String(rec.pickupPersonPhone || "")}) •{" "}
                  {String(rec.pickupScheduledAt || "")}
                </p>
              )}
              {Boolean(rec.garmentConditionNotes) && (
                <p className="text-xs font-semibold text-cocoa-light">
                  Condition Check on Arrival:{" "}
                  <span className="text-cocoa">{String(rec.garmentConditionNotes)}</span>
                </p>
              )}
              {(conditionPhotos.length > 0 || completedPhotos.length > 0) && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {conditionPhotos.map((u, i) => (
                    <div key={`c-${i}`} className="text-center">
                      <img
                        src={u}
                        alt="Arrival inspection"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-sm"
                      />
                      <span className="text-[10px] font-bold text-cocoa-light">
                        Arrival Check
                      </span>
                    </div>
                  ))}
                  {completedPhotos.map((u, i) => (
                    <div key={`f-${i}`} className="text-center">
                      <img
                        src={u}
                        alt="Completed embroidery"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-powder-pink shadow-sm"
                      />
                      <span className="text-[10px] font-bold text-cocoa">
                        Finished Work
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {result.type === "PREORDER" && (
            <div className="rounded-3xl bg-baby-pink/40 p-4 text-xs font-semibold text-cocoa space-y-1">
              <p>
                <strong>Item:</strong> {String(rec.productType)} ({String(rec.size)})
              </p>
              <p>
                <strong>Quoted / Est. Price:</strong>{" "}
                {formatINR(Number(rec.quotedPrice ?? rec.estimatedPrice ?? 0))} •{" "}
                <strong>Payment:</strong> {String(rec.paymentStatus)}
              </p>
              {Boolean(rec.adminNotes) && (
                <p>
                  <strong>Studio Note:</strong> {String(rec.adminNotes)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-display text-xl">Loading tracker...</div>}>
      <TrackInner />
    </Suspense>
  );
}
