import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { INITIAL_PRODUCTS } from "@/lib/seed-data";

export async function POST(req: Request) {
  try {
    const secret = process.env.SEED_SECRET;
    if (secret) {
      const authHeader = req.headers.get("x-seed-secret");
      if (authHeader !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const adminHash = await bcrypt.hash("admin123", 10);
    const customerHash = await bcrypt.hash("pastel123", 10);

    await prisma.user.upsert({
      where: { email: "admin@stitchberry.in" },
      update: {},
      create: {
        name: "Meera (Studio Founder)",
        email: "admin@stitchberry.in",
        passwordHash: adminHash,
        phone: "+91 98765 43210",
        role: "ADMIN",
        avatarColor: "#BFE3F5",
      },
    });

    const customer = await prisma.user.upsert({
      where: { email: "ananya@stitchberry.in" },
      update: {},
      create: {
        name: "Ananya Sharma",
        email: "ananya@stitchberry.in",
        passwordHash: customerHash,
        phone: "+91 98201 55443",
        role: "CUSTOMER",
        avatarColor: "#F7C6D9",
      },
    });

    const existingCount = await prisma.product.count();
    if (existingCount === 0) {
      for (const p of INITIAL_PRODUCTS) {
        const prod = await prisma.product.upsert({
          where: { slug: p.slug },
          update: p,
          create: p,
        });
        await prisma.review.create({
          data: {
            productId: prod.id,
            userId: customer.id,
            authorName: "Ananya S.",
            rating: 5,
            comment:
              "The yarn is unbelievably soft and the pastel shades look straight out of a candy dream!",
          },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Catalog and demo accounts are ready!",
    });
  } catch (err) {
    console.error("Seed API error:", err);
    return NextResponse.json(
      { error: "Database not connected or tables not pushed yet." },
      { status: 500 }
    );
  }
}
