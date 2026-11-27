import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "";
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const color = (searchParams.get("color") || "").trim().toLowerCase();
  const availability = searchParams.get("availability") || "";
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 999999);
  const sort = searchParams.get("sort") || "popular";

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : sort === "newest"
      ? { createdAt: "desc" as const }
      : { popularity: "desc" as const };

  const all = await prisma.product.findMany({
    where: {
      ...(category && category !== "All" ? { category } : {}),
      price: { gte: minPrice, lte: maxPrice },
      ...(availability === "in-stock"
        ? { isOutOfStock: false, stock: { gt: 0 } }
        : availability === "low-stock"
        ? { isOutOfStock: false, stock: { gt: 0, lte: 5 } }
        : {}),
    },
    orderBy,
  });

  const filtered = all.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search);
    const matchesColor =
      !color || p.colorsJson.toLowerCase().includes(color);
    return matchesSearch && matchesColor;
  });

  return NextResponse.json({ products: filtered });
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name || !body.category || !body.price) {
      return NextResponse.json(
        { error: "Name, category, and price are required." },
        { status: 400 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

    const product = await prisma.product.create({
      data: {
        slug,
        name,
        category: String(body.category),
        description: String(body.description || "Handmade crochet treasure crafted with pastel cotton yarn."),
        specifications: String(body.specifications || "100% soft combed cotton yarn • Handmade in India"),
        price: Number(body.price),
        compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
        stock: Number(body.stock ?? 10),
        isOutOfStock: Boolean(body.isOutOfStock),
        colorsJson: JSON.stringify(
          body.colors || [
            { name: "Powder Pink", hex: "#F7C6D9" },
            { name: "Powder Blue", hex: "#BFE3F5" },
          ]
        ),
        sizesJson: JSON.stringify(body.sizes || ["Standard"]),
        imagesJson: JSON.stringify(
          body.images?.length
            ? body.images
            : ["/images/products/cotton-candy-tulip-bouquet-1.svg"]
        ),
        isFeatured: Boolean(body.isFeatured),
        isSeasonal: Boolean(body.isSeasonal),
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json(
      { error: "Could not create product." },
      { status: 500 }
    );
  }
}
