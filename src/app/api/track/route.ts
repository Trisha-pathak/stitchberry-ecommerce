import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Enter a tracking number." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber: code },
  });
  if (order) {
    return NextResponse.json({ type: "ORDER", record: order });
  }

  const preOrder = await prisma.crochetPreOrder.findFirst({
    where: { preOrderNumber: code },
  });
  if (preOrder) {
    return NextResponse.json({ type: "PREORDER", record: preOrder });
  }

  const embroidery = await prisma.embroideryBooking.findFirst({
    where: { bookingNumber: code },
  });
  if (embroidery) {
    return NextResponse.json({ type: "EMBROIDERY", record: embroidery });
  }

  return NextResponse.json(
    { error: "No order, pre-order, or embroidery booking found with that code." },
    { status: 404 }
  );
}
