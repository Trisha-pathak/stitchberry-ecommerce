import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const related = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      OR: [{ category: product.category }, { isFeatured: true }],
    },
    take: 4,
    orderBy: { popularity: "desc" },
  });

  return NextResponse.json({ product, related });
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

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(body.name !== undefined ? { name: String(body.name) } : {}),
      ...(body.category !== undefined ? { category: String(body.category) } : {}),
      ...(body.description !== undefined ? { description: String(body.description) } : {}),
      ...(body.specifications !== undefined ? { specifications: String(body.specifications) } : {}),
      ...(body.price !== undefined ? { price: Number(body.price) } : {}),
      ...(body.stock !== undefined ? { stock: Number(body.stock) } : {}),
      ...(body.isOutOfStock !== undefined ? { isOutOfStock: Boolean(body.isOutOfStock) } : {}),
      ...(body.isFeatured !== undefined ? { isFeatured: Boolean(body.isFeatured) } : {}),
      ...(body.colors !== undefined ? { colorsJson: JSON.stringify(body.colors) } : {}),
      ...(body.sizes !== undefined ? { sizesJson: JSON.stringify(body.sizes) } : {}),
      ...(body.images !== undefined ? { imagesJson: JSON.stringify(body.images) } : {}),
    },
  });

  return NextResponse.json({ product: updated });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { id } = await context.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
