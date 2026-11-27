import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getSessionUser();
  const body = await req.json();
  const rating = Math.min(5, Math.max(1, Number(body.rating || 5)));
  const comment = String(body.comment || "").trim();
  const authorName = String(body.authorName || session?.name || "Sweet Shopper").trim();

  if (!comment) {
    return NextResponse.json(
      { error: "Please write a short review comment." },
      { status: 400 }
    );
  }

  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const review = await prisma.review.create({
    data: {
      productId: product.id,
      userId: session?.userId || null,
      authorName,
      rating,
      comment,
    },
  });

  const stats = await prisma.review.aggregate({
    where: { productId: product.id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: product.id },
    data: {
      ratingAvg: Number((stats._avg.rating || 5).toFixed(1)),
      ratingCount: stats._count.rating,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
