import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.phone || !body.giftIdea) {
      return NextResponse.json(
        { error: "Please fill in your contact details and gift idea." },
        { status: 400 }
      );
    }

    const reqRecord = await prisma.customGiftRequest.create({
      data: {
        name: String(body.name),
        email: String(body.email),
        phone: String(body.phone),
        occasion: String(body.occasion || "Birthday / Celebration"),
        giftIdea: String(body.giftIdea),
        referenceImageUrl: String(body.referenceImageUrl || ""),
        budgetRange: String(body.budgetRange || "₹1,000 – ₹2,500"),
        deliveryDate: String(body.deliveryDate || ""),
        giftNote: String(body.giftNote || ""),
      },
    });

    return NextResponse.json({ request: reqRecord }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not submit gift request." },
      { status: 500 }
    );
  }
}
