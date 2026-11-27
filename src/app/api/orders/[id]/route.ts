import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { id } = await context.params;
  const body = await req.json();

  const updated = await prisma.order.update({
    where: { id },
    data: {
      ...(body.status ? { status: String(body.status) } : {}),
      ...(body.paymentStatus ? { paymentStatus: String(body.paymentStatus) } : {}),
    },
  });
  return NextResponse.json({ order: updated });
}
