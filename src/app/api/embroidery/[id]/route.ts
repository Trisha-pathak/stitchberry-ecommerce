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

  const updated = await prisma.embroideryBooking.update({
    where: { id },
    data: {
      ...(body.status !== undefined ? { status: String(body.status) } : {}),
      ...(body.confirmedPrice !== undefined
        ? { confirmedPrice: body.confirmedPrice === null ? null : Number(body.confirmedPrice) }
        : {}),
      ...(body.paymentStatus !== undefined ? { paymentStatus: String(body.paymentStatus) } : {}),
      ...(body.pickupPersonName !== undefined ? { pickupPersonName: String(body.pickupPersonName) } : {}),
      ...(body.pickupPersonPhone !== undefined ? { pickupPersonPhone: String(body.pickupPersonPhone) } : {}),
      ...(body.pickupScheduledAt !== undefined ? { pickupScheduledAt: String(body.pickupScheduledAt) } : {}),
      ...(body.garmentConditionNotes !== undefined
        ? { garmentConditionNotes: String(body.garmentConditionNotes) }
        : {}),
      ...(body.garmentConditionPhotos !== undefined
        ? { garmentConditionPhotosJson: JSON.stringify(body.garmentConditionPhotos) }
        : {}),
      ...(body.completedWorkPhotos !== undefined
        ? { completedWorkPhotosJson: JSON.stringify(body.completedWorkPhotos) }
        : {}),
    },
  });

  if (updated.userId) {
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: `Embroidery ${updated.bookingNumber}: ${updated.status}`,
        message:
          updated.garmentConditionNotes && updated.status === "Garment received and inspected"
            ? `Garment condition recorded: ${updated.garmentConditionNotes}`
            : `Your ${updated.garmentType} embroidery booking moved to "${updated.status}".`,
        type: "EMBROIDERY",
        link: "/account",
      },
    });
  }

  return NextResponse.json({ booking: updated });
}
