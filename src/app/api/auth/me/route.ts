import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentDbUser();
  if (!user) {
    return NextResponse.json({ user: null, wishlistIds: [] });
  }
  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    select: { productId: true },
  });
  return NextResponse.json({
    user,
    wishlistIds: wishlist.map((w) => w.productId),
  });
}
