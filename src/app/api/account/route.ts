import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    profile,
    addresses,
    orders,
    preOrders,
    embroideries,
    savedDesigns,
    wishlist,
    notifications,
    tickets,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatarColor: true,
        createdAt: true,
      },
    }),
    prisma.address.findMany({ where: { userId: session.userId } }),
    prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.crochetPreOrder.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.embroideryBooking.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.savedDesign.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.wishlistItem.findMany({
      where: { userId: session.userId },
      include: { product: true },
    }),
    prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.supportTicket.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    profile,
    addresses,
    orders,
    preOrders,
    embroideries,
    savedDesigns,
    wishlist,
    notifications,
    tickets,
  });
}

export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  if (body.action === "update-profile") {
    const user = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: String(body.name || session.name),
        phone: String(body.phone || ""),
        avatarColor: String(body.avatarColor || "#F7C6D9"),
      },
      select: { id: true, name: true, email: true, phone: true, role: true, avatarColor: true },
    });
    return NextResponse.json({ user });
  }

  if (body.action === "add-address") {
    const address = await prisma.address.create({
      data: {
        userId: session.userId,
        label: String(body.label || "Home"),
        fullName: String(body.fullName || session.name),
        phone: String(body.phone || ""),
        line1: String(body.line1 || ""),
        line2: String(body.line2 || ""),
        city: String(body.city || ""),
        state: String(body.state || ""),
        pincode: String(body.pincode || ""),
        isDefault: Boolean(body.isDefault),
      },
    });
    return NextResponse.json({ address }, { status: 201 });
  }

  if (body.action === "delete-address") {
    await prisma.address.deleteMany({
      where: { id: String(body.addressId), userId: session.userId },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "save-design") {
    const design = await prisma.savedDesign.create({
      data: {
        userId: session.userId,
        title: String(body.title || "Pastel Yarn Mix"),
        designType: String(body.designType || "Yarn Palette"),
        colorsJson: JSON.stringify(body.colors || []),
        notes: String(body.notes || ""),
      },
    });
    return NextResponse.json({ design }, { status: 201 });
  }

  if (body.action === "delete-design") {
    await prisma.savedDesign.deleteMany({
      where: { id: String(body.designId), userId: session.userId },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "mark-notifications-read") {
    await prisma.notification.updateMany({
      where: { userId: session.userId },
      data: { isRead: true },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
