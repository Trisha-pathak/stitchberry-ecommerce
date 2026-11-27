import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      return NextResponse.json({
        ok: true,
        message: "Database already seeded.",
      });
    }

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

    await prisma.user.upsert({
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

    return NextResponse.json({
      ok: true,
      message: "Demo users seeded. Run `npm run db:seed` for full sample catalog.",
    });
  } catch (err) {
    console.error("Seed API error:", err);
    return NextResponse.json(
      { error: "Database tables not pushed yet. Run `npx prisma db push`." },
      { status: 500 }
    );
  }
}
