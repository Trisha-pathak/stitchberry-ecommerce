import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

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

  const updated = await prisma.crochetPreOrder.update({
    where: { id },
    data: {
      ...(body.status !== undefined ? { status: String(body.status) } : {}),
      ...(body.quotedPrice !== undefined
        ? { quotedPrice: body.quotedPrice === null ? null : Number(body.quotedPrice) }
        : {}),
      ...(body.advanceAmount !== undefined ? { advanceAmount: Number(body.advanceAmount) } : {}),
      ...(body.paymentStatus !== undefined ? { paymentStatus: String(body.paymentStatus) } : {}),
      ...(body.expectedDeliveryDate !== undefined
        ? { expectedDeliveryDate: String(body.expectedDeliveryDate) }
        : {}),
      ...(body.adminNotes !== undefined ? { adminNotes: String(body.adminNotes) } : {}),
    },
  });

  if (updated.userId) {
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: `Pre-Order ${updated.preOrderNumber} Updated`,
        message: `Status is now "${updated.status}". ${updated.adminNotes ? updated.adminNotes : ""}`,
        type: "PREORDER",
        link: "/account",
      },
    });
  }

  return NextResponse.json({ preOrder: updated });
}
