import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const preOrders = await prisma.crochetPreOrder.findMany({
    where: session.role === "ADMIN" ? {} : { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ preOrders });
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();

    if (
      !body.productType ||
      !body.selectedColors?.length ||
      !body.contactName ||
      !body.contactPhone ||
      !body.contactEmail ||
      !body.deliveryAddress?.line1
    ) {
      return NextResponse.json(
        { error: "Please complete product choices, colors, address, and contact details." },
        { status: 400 }
      );
    }

    const preOrderNumber = `SB-PRE-${Math.floor(2000 + Math.random() * 7999)}`;
    const payAdvanceNow = Boolean(body.payAdvanceNow);
    const estimatedPrice = Number(body.estimatedPrice || 1499);
    const advanceAmount = payAdvanceNow ? Math.round(estimatedPrice * 0.4) : 0;

    const preOrder = await prisma.crochetPreOrder.create({
      data: {
        preOrderNumber,
        userId: session?.userId || null,
        productType: String(body.productType),
        baseProductId: String(body.baseProductId || ""),
        selectedColorsJson: JSON.stringify(body.selectedColors),
        size: String(body.size || "Standard"),
        designVariation: String(body.designVariation || "Signature Pastel"),
        personalizedText: String(body.personalizedText || ""),
        referenceImageUrl: String(body.referenceImageUrl || ""),
        specialInstructions: String(body.specialInstructions || ""),
        quantity: Number(body.quantity || 1),
        requiredDeliveryDate: String(body.requiredDeliveryDate || ""),
        timelinePreference: String(body.timelinePreference || "Standard (10-14 days)"),
        estimatedPrice,
        quotedPrice: body.requestQuote ? null : estimatedPrice,
        advanceAmount,
        paymentStatus: payAdvanceNow
          ? "Advance Paid"
          : body.requestQuote
          ? "Quotation Requested"
          : "Pending Advance",
        status: payAdvanceNow
          ? "Pre-Order Received"
          : body.requestQuote
          ? "Design Confirmation"
          : "Awaiting Advance Payment",
        deliveryAddressJson: JSON.stringify(body.deliveryAddress),
        contactName: String(body.contactName),
        contactPhone: String(body.contactPhone),
        contactEmail: String(body.contactEmail),
      },
    });

    if (session?.userId) {
      await prisma.notification.create({
        data: {
          userId: session.userId,
          title: `Custom Pre-Order ${preOrderNumber} Received!`,
          message: `We received your custom ${preOrder.productType} request. Our yarn studio will confirm colors & timeline shortly.`,
          type: "PREORDER",
          link: "/account",
        },
      });
    }

    return NextResponse.json({ preOrder }, { status: 201 });
  } catch (err) {
    console.error("PreOrder error:", err);
    return NextResponse.json(
      { error: "Failed to submit crochet pre-order." },
      { status: 500 }
    );
  }
}
