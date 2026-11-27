import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { safeJsonParse } from "@/lib/constants";

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const [
    products,
    orders,
    preOrders,
    embroideries,
    customers,
    giftRequests,
    tickets,
  ] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.crochetPreOrder.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.embroideryBooking.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        addresses: true,
        orders: { select: { id: true, total: true, paymentStatus: true, createdAt: true } },
        preOrders: { select: { id: true, estimatedPrice: true, status: true } },
        embroideries: { select: { id: true, estimatedPrice: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customGiftRequest.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.supportTicket.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const regularRevenue = orders.reduce((s, o) => s + o.total, 0);
  const preOrderRevenue = preOrders.reduce(
    (s, p) => s + (p.quotedPrice ?? p.estimatedPrice),
    0
  );
  const embroideryRevenue = embroideries.reduce(
    (s, e) => s + (e.confirmedPrice ?? e.estimatedPrice),
    0
  );
  const totalRevenue = regularRevenue + preOrderRevenue + embroideryRevenue;

  const pendingPickups = embroideries.filter((e) =>
    ["Booking received", "Design reviewed", "Price confirmed", "Pickup scheduled"].includes(
      e.status
    )
  ).length;

  const ongoingEmbroidery = embroideries.filter((e) =>
    ["Garment picked up", "Garment received and inspected", "Embroidery started", "Work completed", "Quality check"].includes(
      e.status
    )
  ).length;

  const pendingDeliveries =
    orders.filter((o) => o.status !== "Delivered").length +
    preOrders.filter((p) => p.status !== "Delivered").length +
    embroideries.filter((e) =>
      ["Ready for delivery", "Out for delivery"].includes(e.status)
    ).length;

  const lowStockProducts = products.filter((p) => p.stock <= 5 || p.isOutOfStock);

  // Best sellers map from order items + popularity
  const salesMap: Record<string, { name: string; sold: number; revenue: number }> = {};
  for (const ord of orders) {
    const items = safeJsonParse<{ name: string; quantity: number; price: number }[]>(
      ord.itemsJson,
      []
    );
    for (const it of items) {
      if (!salesMap[it.name]) {
        salesMap[it.name] = { name: it.name, sold: 0, revenue: 0 };
      }
      salesMap[it.name].sold += it.quantity;
      salesMap[it.name].revenue += it.quantity * it.price;
    }
  }

  return NextResponse.json({
    kpis: {
      totalRevenue,
      regularRevenue,
      preOrderRevenue,
      embroideryRevenue,
      totalOrders: orders.length + preOrders.length + embroideries.length,
      readyMadeSalesCount: orders.length,
      preOrderCount: preOrders.length,
      embroideryCount: embroideries.length,
      pendingPickups,
      ongoingEmbroidery,
      pendingDeliveries,
      lowStockCount: lowStockProducts.length,
    },
    products,
    orders,
    preOrders,
    embroideries,
    customers,
    giftRequests,
    tickets,
    bestSellers: Object.values(salesMap).sort((a, b) => b.sold - a.sold),
  });
}
