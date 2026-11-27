import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { COUPONS } from "@/lib/constants";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await prisma.order.findMany({
    where: session.role === "ADMIN" ? {} : { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      items,
      couponCode,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      giftWrap,
      giftNote,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !address?.line1 || !items?.length) {
      return NextResponse.json(
        { error: "Please complete all contact, address, and cart fields." },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, i: { price: number; quantity: number }) =>
        sum + Number(i.price) * Number(i.quantity),
      0
    );

    const code = String(couponCode || "").trim().toUpperCase();
    const coupon = COUPONS[code];
    let discount = 0;
    let shippingFee = subtotal >= 1999 ? 0 : 79;

    if (coupon?.type === "percent") {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon?.type === "shipping") {
      shippingFee = 0;
    }

    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.05);
    const total = taxable + shippingFee + tax;

    const orderNumber = `SB-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.userId || null,
        customerName: String(customerName),
        customerEmail: String(customerEmail),
        customerPhone: String(customerPhone),
        addressJson: JSON.stringify(address),
        itemsJson: JSON.stringify(items),
        couponCode: code,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        paymentMethod: String(paymentMethod || "RAZORPAY"),
        paymentStatus: paymentMethod === "COD" ? "COD Pending" : "PAID",
        razorpayOrderId: String(razorpayOrderId || `order_sb_${Date.now()}`),
        razorpayPaymentId: String(
          razorpayPaymentId || (paymentMethod === "COD" ? "" : `pay_sb_${Date.now()}`)
        ),
        status: "Confirmed",
        giftWrap: Boolean(giftWrap),
        giftNote: String(giftNote || ""),
      },
    });

    // Decrement stock safely
    for (const item of items) {
      if (item.productId) {
        const prod = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (prod) {
          const nextStock = Math.max(0, prod.stock - Number(item.quantity || 1));
          await prisma.product.update({
            where: { id: prod.id },
            data: {
              stock: nextStock,
              isOutOfStock: nextStock === 0,
              popularity: prod.popularity + 2,
            },
          });
        }
      }
    }

    if (session?.userId) {
      await prisma.notification.create({
        data: {
          userId: session.userId,
          title: `Order ${orderNumber} Confirmed!`,
          message: `We're packing your handmade crochet treasures with pastel tissue & love.`,
          type: "ORDER",
          link: `/orders/${order.id}`,
        },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Checkout failed." }, { status: 500 });
  }
}
