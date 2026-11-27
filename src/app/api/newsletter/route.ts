import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const clean = String(email || "").trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    await prisma.newsletterSubscriber.upsert({
      where: { email: clean },
      update: {},
      create: { email: clean },
    });
    return NextResponse.json({
      message: "Subscribed! Check out code PASTEL15 for 15% off.",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not subscribe right now." },
      { status: 500 }
    );
  }
}
