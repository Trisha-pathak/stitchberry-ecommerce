import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ items: [] });
  }
  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.userId },
    include: { product: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ ok: true, localOnly: true });
  }
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId: session.userId, productId },
    },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }
  await prisma.wishlistItem.create({
    data: { userId: session.userId, productId },
  });
  return NextResponse.json({ saved: true });
}
