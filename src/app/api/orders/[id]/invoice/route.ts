import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatINR, safeJsonParse } from "@/lib/constants";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
  });

  if (!order) {
    return new NextResponse("Order not found", { status: 404 });
  }

  const address = safeJsonParse<Record<string, string>>(order.addressJson, {});
  const items = safeJsonParse<
    { name: string; color: string; size: string; quantity: number; price: number }[]
  >(order.itemsJson, []);

  const rows = items
    .map(
      (it) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #f7c6d9;">${it.name} <br/><small style="color:#7d616a;">${it.color} • ${it.size}</small></td>
        <td style="padding:10px;border-bottom:1px solid #f7c6d9;text-align:center;">${it.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #f7c6d9;text-align:right;">${formatINR(it.price)}</td>
        <td style="padding:10px;border-bottom:1px solid #f7c6d9;text-align:right;">${formatINR(it.price * it.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${order.orderNumber} - StitchBerry</title>
  <style>
    body { font-family: system-ui, sans-serif; background:#FFF8ED; color:#59434A; padding:32px; }
    .card { max-width:740px; margin:0 auto; background:#fff; border:2px solid #F7C6D9; border-radius:24px; padding:32px; }
    .head { display:flex; justify-content:space-between; align-items:center; border-bottom:2px dashed #BFE3F5; padding-bottom:18px; }
    table { width:100%; border-collapse:collapse; margin-top:20px; }
    th { text-align:left; background:#FADCE8; padding:10px; }
    .totals { margin-top:20px; text-align:right; line-height:1.8; }
    @media print { body { background:#fff; padding:0; } .no-print { display:none; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="head">
      <div>
        <h1 style="margin:0;color:#59434A;">StitchBerry Studio</h1>
        <p style="margin:4px 0 0;color:#7D616A;">Handmade Crochet & Custom Embroidery • Mumbai, India</p>
      </div>
      <div style="text-align:right;">
        <strong>INVOICE #${order.orderNumber}</strong><br/>
        <small>Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}</small><br/>
        <small>Payment: ${order.paymentMethod} (${order.paymentStatus})</small>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;justify-content:space-between;gap:20px;">
      <div>
        <strong>Billed & Shipped To:</strong><br/>
        ${order.customerName}<br/>
        ${address.line1 || ""}<br/>
        ${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}<br/>
        Phone: ${order.customerPhone}
      </div>
      <div style="text-align:right;">
        <strong>Order Type:</strong> Ready-Made Crochet<br/>
        <strong>Status:</strong> ${order.status}<br/>
        ${order.giftWrap ? `<strong>Gift Wrap:</strong> Included` : ""}
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Price</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div>Subtotal: <strong>${formatINR(order.subtotal)}</strong></div>
      ${order.discount > 0 ? `<div>Coupon (${order.couponCode}): <strong>-${formatINR(order.discount)}</strong></div>` : ""}
      <div>Shipping: <strong>${order.shippingFee === 0 ? "FREE" : formatINR(order.shippingFee)}</strong></div>
      <div>GST (5%): <strong>${formatINR(order.tax)}</strong></div>
      <div style="font-size:20px;margin-top:8px;">Grand Total: <strong>${formatINR(order.total)}</strong></div>
    </div>
    <p style="margin-top:24px;text-align:center;color:#7D616A;font-size:13px;">
      Thank you for supporting handmade craft! Every loop is crocheted with love.
    </p>
    <div class="no-print" style="text-align:center;margin-top:16px;">
      <button onclick="window.print()" style="background:#59434A;color:#FFF8ED;border:none;padding:10px 22px;border-radius:999px;font-weight:700;cursor:pointer;">Print / Save as PDF</button>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
