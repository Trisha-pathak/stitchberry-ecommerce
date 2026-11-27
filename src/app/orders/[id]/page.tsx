import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR, safeJsonParse } from "@/lib/constants";
import { CheckCircle2, FileDown, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
  });

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-cocoa">
          Order not found
        </h1>
        <Link href="/shop" className="underline font-bold text-cocoa">
          Return to shop
        </Link>
      </div>
    );
  }

  const items = safeJsonParse<
    { name: string; color: string; size: string; quantity: number; price: number }[]
  >(order.itemsJson, []);
  const addr = safeJsonParse<Record<string, string>>(order.addressJson, {});

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="stitch-card rounded-5xl p-8 sm:p-10 bg-vanilla-cream space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-butter-yellow flex items-center justify-center border-2 border-cocoa/15">
            <CheckCircle2 className="w-9 h-9 text-cocoa" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cocoa">
            Order Confirmed!
          </h1>
          <p className="text-sm font-semibold text-cocoa-light">
            Order Number:{" "}
            <span className="font-display text-lg text-cocoa bg-powder-pink/60 px-3 py-0.5 rounded-full">
              {order.orderNumber}
            </span>
          </p>
        </div>

        <div className="rounded-3xl bg-white/85 p-5 border border-powder-blue space-y-3">
          <p className="font-display font-bold text-cocoa">Items Ordered</p>
          {items.map((it, idx) => (
            <div key={idx} className="flex justify-between text-sm font-semibold">
              <span>
                {it.name} × {it.quantity} ({it.color}, {it.size})
              </span>
              <span>{formatINR(it.price * it.quantity)}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-dashed border-cocoa/15 flex justify-between font-display text-lg font-bold">
            <span>Total Paid ({order.paymentMethod})</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-baby-pink/40 p-4 text-xs font-semibold text-cocoa">
          <strong>Delivery Address:</strong> {order.customerName}, {addr.line1},{" "}
          {addr.city}, {addr.state} - {addr.pincode} ({order.customerPhone})
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`/api/orders/${order.id}/invoice`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-cocoa text-vanilla-cream font-bold text-sm"
          >
            <FileDown className="w-4 h-4" /> Download / Print Invoice
          </a>
          <Link
            href={`/track?code=${order.orderNumber}`}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-powder-blue text-cocoa font-bold text-sm"
          >
            <Sparkles className="w-4 h-4" /> Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
