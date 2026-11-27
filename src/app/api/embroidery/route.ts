import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await prisma.embroideryBooking.findMany({
    where: session.role === "ADMIN" ? {} : { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();

    if (
      !body.garmentType ||
      !body.placement ||
      !body.embroideryType ||
      !body.customerName ||
      !body.mobileNumber ||
      !body.pickupAddress ||
      !body.pincode ||
      !body.preferredPickupDate
    ) {
      return NextResponse.json(
        { error: "Please complete all garment, embroidery, and pickup fields." },
        { status: 400 }
      );
    }

    const bookingNumber = `SB-EMB-${Math.floor(3000 + Math.random() * 6999)}`;

    const booking = await prisma.embroideryBooking.create({
      data: {
        bookingNumber,
        userId: session?.userId || null,
        garmentType: String(body.garmentType),
        otherGarmentText: String(body.otherGarmentText || ""),
        garmentImageUrl: String(body.garmentImageUrl || ""),
        referenceDesignUrl: String(body.referenceDesignUrl || ""),
        inspirationImageUrl: String(body.inspirationImageUrl || ""),
        placement: String(body.placement),
        threadColorsJson: JSON.stringify(body.threadColors || []),
        designSize: String(body.designSize || "Small Accent (4–5 in)"),
        embroideryType: String(body.embroideryType),
        personalizedText: String(body.personalizedText || ""),
        additionalInstructions: String(body.additionalInstructions || ""),
        customerName: String(body.customerName),
        mobileNumber: String(body.mobileNumber),
        customerEmail: String(body.customerEmail || session?.email || ""),
        pickupAddress: String(body.pickupAddress),
        pincode: String(body.pincode),
        preferredPickupDate: String(body.preferredPickupDate),
        preferredPickupSlot: String(
          body.preferredPickupSlot || "Morning (9:00 AM – 12:00 PM)"
        ),
        estimatedPrice: Number(body.estimatedPrice || 1199),
        pickupCharge: Number(body.pickupCharge ?? 99),
        deliveryCharge: Number(body.deliveryCharge ?? 99),
        estimatedCompletionDays: Number(body.estimatedCompletionDays || 10),
        status: "Booking received",
        paymentStatus: body.requestQuote ? "Quotation Requested" : "Booking Confirmed",
      },
    });

    if (session?.userId) {
      await prisma.notification.create({
        data: {
          userId: session.userId,
          title: `Embroidery Booking ${bookingNumber} Received!`,
          message: `We will review your ${booking.garmentType} design & confirm your pickup slot for ${booking.preferredPickupDate}.`,
          type: "EMBROIDERY",
          link: "/account",
        },
      });
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error("Embroidery booking error:", err);
    return NextResponse.json(
      { error: "Failed to submit embroidery booking." },
      { status: 500 }
    );
  }
}
